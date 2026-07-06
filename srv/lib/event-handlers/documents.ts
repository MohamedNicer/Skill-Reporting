import { Buffer } from "node:buffer";
import { Service, TypedRequest, connect, utils } from "@sap/cds";
import { CandidateDecisionInput } from "../../types/global.types";
import { checksum, getCurrentEmployee, normalizeText, recordAudit, toBuffer } from "../util";
import { findSkillSuggestions } from "./skills";

const uploadCV = async (req: TypedRequest<any>): Promise<any> => {
    const db: Service = await connect.to("db");
    const { DocumentAssets, UploadedCVs } = db.entities;
    const employee = req.data.employeeID ? { ID: req.data.employeeID } : await getCurrentEmployee(req.user.id);
    const content = toBuffer(req.data.content || req.data.fileContent || "");
    if (!req.data.fileName || !req.data.mimeType) return req.reject(400, "fileName and mimeType are required.");
    if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(req.data.mimeType)) return req.reject(422, "Only PDF and DOCX CV files are supported.");

    const assetID = utils.uuid();
    const cvID = utils.uuid();
    await db.run(INSERT.into(DocumentAssets).entries({ ID: assetID, storageProvider: "HANA_DB", dbObjectID: assetID, fileName: req.data.fileName, mimeType: req.data.mimeType, fileSize: content.length, checksum: content.length ? checksum(content) : undefined, documentType: "uploadedCV", versionLabel: "1", content }));
    await db.run(INSERT.into(UploadedCVs).entries({ ID: cvID, employeeID: employee.ID, documentAssetID: assetID, uploadStatus: "storedInHana", uploadedAt: new Date().toISOString() }));
    await recordAudit(employee.ID, "CVUploaded", "UploadedCVs", cvID);
    return db.run(SELECT.one.from(UploadedCVs).where({ ID: cvID }));
};

const startExtraction = async (req: TypedRequest<any>): Promise<any> => {
    const db: Service = await connect.to("db");
    const { UploadedCVs, DocumentAssets, CVExtractionRuns, ExtractedSkillCandidates } = db.entities;
    const cv = await db.run(SELECT.one.from(UploadedCVs).where({ ID: req.data.uploadedCVID }));
    if (!cv) return req.reject(404, "Uploaded CV not found.");
    const asset = await db.run(SELECT.one.from(DocumentAssets).where({ ID: cv.documentAssetID }));
    const runID = utils.uuid();
    await db.run(INSERT.into(CVExtractionRuns).entries({ ID: runID, uploadedCVID: cv.ID, provider: "hana-db-placeholder", modelVersion: "manual-review-v1", status: "extracting", startedAt: new Date().toISOString() }));

    const searchableText = `${asset?.fileName || ""}`.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    const rawTerms = searchableText.split(/\s+/).filter((term: string) => term.length > 1);
    for (const term of rawTerms) {
        const suggestions = await findSkillSuggestions(term);
        await db.run(INSERT.into(ExtractedSkillCandidates).entries({ ID: utils.uuid(), extractionRunID: runID, matchedSkillID: suggestions[0]?.skillID, rawText: term, normalizedText: normalizeText(term), confidence: suggestions[0] ? suggestions[0].confidence * 100 : 35, decision: "pending" }));
    }
    await db.run(UPDATE(CVExtractionRuns).with({ status: "completed", finishedAt: new Date().toISOString() }).where({ ID: runID }));
    await recordAudit(cv.employeeID, "CVExtractionCompleted", "CVExtractionRuns", runID);
    return db.run(SELECT.one.from(CVExtractionRuns).where({ ID: runID }));
};

const confirmExtractedSkills = async (req: TypedRequest<any>): Promise<boolean> => {
    const db: Service = await connect.to("db");
    const { ExtractedSkillCandidates, CVExtractionRuns, UploadedCVs, EmployeeSkills, SkillEvidence } = db.entities;
    let decisions: CandidateDecisionInput[] = req.data.decisions || [];
    if (!decisions.length && req.data.extractionRunID) {
        const candidates = await db.run(SELECT.from(ExtractedSkillCandidates).where({ extractionRunID: req.data.extractionRunID, decision: "pending" })) as any[];
        decisions = candidates.map(candidate => ({ candidateID: candidate.ID, decision: "accepted" }));
    }
    for (const decision of decisions) {
        const candidate = await db.run(SELECT.one.from(ExtractedSkillCandidates).where({ ID: decision.candidateID }));
        if (!candidate) continue;
        const run = await db.run(SELECT.one.from(CVExtractionRuns).where({ ID: candidate.extractionRunID }));
        const cv = await db.run(SELECT.one.from(UploadedCVs).where({ ID: run.uploadedCVID }));
        await db.run(UPDATE(ExtractedSkillCandidates).with({ decision: decision.decision, decidedAt: new Date().toISOString() }).where({ ID: decision.candidateID }));
        if (decision.decision === "accepted" && candidate.matchedSkillID) {
            let employeeSkill = await db.run(SELECT.one.from(EmployeeSkills).where({ employeeID: cv.employeeID, skillID: candidate.matchedSkillID }));
            if (!employeeSkill) {
                const employeeSkillID = utils.uuid();
                await db.run(INSERT.into(EmployeeSkills).entries({ ID: employeeSkillID, employeeID: cv.employeeID, skillID: candidate.matchedSkillID, source: "cvExtraction", validationStatus: "selfDeclared", confirmedAt: new Date().toISOString() }));
                employeeSkill = { ID: employeeSkillID };
            }
            await db.run(INSERT.into(SkillEvidence).entries({ ID: utils.uuid(), employeeSkillID: employeeSkill.ID, evidenceType: "cvExtraction", sourceEntity: "ExtractedSkillCandidates", sourceEntityID: candidate.ID, confidence: candidate.confidence, note: "Accepted from CV extraction review." }));
        }
    }
    return true;
};

const generateCV = async (req: TypedRequest<any>): Promise<any> => {
    const db: Service = await connect.to("db");
    const { Employees, CVTemplateVersions, DocumentAssets, GeneratedCVs, EmployeeSkills, Skills } = db.entities;
    const employee = req.data.employeeID ? await db.run(SELECT.one.from(Employees).where({ ID: req.data.employeeID })) : await getCurrentEmployee(req.user.id);
    const template = await db.run(SELECT.one.from(CVTemplateVersions).where({ ID: req.data.templateVersionID, isActive: true }));
    if (!template) return req.reject(404, "Active CV template version not found.");
    const employeeSkills = await db.run(SELECT.from(EmployeeSkills).where({ employeeID: employee.ID })) as any[];
    const skillNames: string[] = [];
    for (const employeeSkill of employeeSkills) {
        const skill = await db.run(SELECT.one.from(Skills).where({ ID: employeeSkill.skillID }));
        if (skill) skillNames.push(skill.canonicalName);
    }
    const cvText = [`${employee.firstName || ""} ${employee.lastName || ""}`.trim(), employee.jobTitle || "", employee.email || "", "", "Skills", ...skillNames.map(name => `- ${name}`)].join("\n");
    const content = Buffer.from(cvText, "utf8");
    const assetID = utils.uuid();
    const generatedID = utils.uuid();
    await db.run(INSERT.into(DocumentAssets).entries({ ID: assetID, storageProvider: "HANA_DB", dbObjectID: assetID, fileName: `${employee.ID}-generated-cv.txt`, mimeType: "text/plain", fileSize: content.length, checksum: checksum(content), documentType: "generatedCV", versionLabel: "1", content }));
    await db.run(INSERT.into(GeneratedCVs).entries({ ID: generatedID, employeeID: employee.ID, templateVersionID: template.ID, documentAssetID: assetID, generationStatus: "ready", generatedAt: new Date().toISOString() }));
    await recordAudit(employee.ID, "CVGenerated", "GeneratedCVs", generatedID);
    return db.run(SELECT.one.from(GeneratedCVs).where({ ID: generatedID }));
};

const downloadDocument = async (req: TypedRequest<any>): Promise<string | Error> => {
    const db: Service = await connect.to("db");
    const { DocumentAssets } = db.entities;
    const asset = await db.run(SELECT.one.from(DocumentAssets).where({ ID: req.data.documentAssetID }));
    if (!asset) return req.reject(404, "Document asset not found.");
    return asset.content ? Buffer.from(asset.content).toString("base64") : "";
};

export { confirmExtractedSkills, downloadDocument, generateCV, startExtraction, uploadCV };

