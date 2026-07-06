import { Service, TypedRequest, connect, utils } from "@sap/cds";
import { getCurrentEmployee, normalizeText, recordAudit } from "../util";

const approveSkillRequest = async (req: TypedRequest<any>): Promise<any> => {
    const db: Service = await connect.to("db");
    const { SkillRequests, Skills } = db.entities;
    const actor = await getCurrentEmployee(req.user.id);
    const request = await db.run(SELECT.one.from(SkillRequests).where({ ID: req.data.requestID, status: "pendingReview" }));
    if (!request) return req.reject(404, "Pending skill request not found.");
    const skillID = utils.uuid();
    await db.run(INSERT.into(Skills).entries({ ID: skillID, canonicalName: request.requestedText, normalizedName: request.normalizedText, categoryID: req.data.categoryID, description: req.data.description, status: "active", isActive: true }));
    await db.run(UPDATE(SkillRequests).with({ resolvedSkillID: skillID, status: "decided", decision: "approvedAsNewSkill", decidedAt: new Date().toISOString() }).where({ ID: request.ID }));
    await recordAudit(actor.ID, "SkillApproved", "SkillRequests", request.ID);
    return db.run(SELECT.one.from(SkillRequests).where({ ID: request.ID }));
};

const mergeSkillRequestAsAlias = async (req: TypedRequest<any>): Promise<any> => {
    const db: Service = await connect.to("db");
    const { SkillRequests, SkillAliases } = db.entities;
    const actor = await getCurrentEmployee(req.user.id);
    const request = await db.run(SELECT.one.from(SkillRequests).where({ ID: req.data.requestID, status: "pendingReview" }));
    if (!request) return req.reject(404, "Pending skill request not found.");
    await db.run(INSERT.into(SkillAliases).entries({ ID: utils.uuid(), skillID: req.data.skillID, aliasText: request.requestedText, normalizedAlias: request.normalizedText, aliasType: "synonym", isActive: true }));
    await db.run(UPDATE(SkillRequests).with({ resolvedSkillID: req.data.skillID, status: "decided", decision: "mergedAsAlias", decidedAt: new Date().toISOString() }).where({ ID: request.ID }));
    await recordAudit(actor.ID, "SkillMergedAsAlias", "SkillRequests", request.ID);
    return db.run(SELECT.one.from(SkillRequests).where({ ID: request.ID }));
};

const rejectSkillRequest = async (req: TypedRequest<any>): Promise<any> => {
    const db: Service = await connect.to("db");
    const { SkillRequests } = db.entities;
    const actor = await getCurrentEmployee(req.user.id);
    await db.run(UPDATE(SkillRequests).with({ status: "decided", decision: "rejected", adminComment: req.data.reason, decidedAt: new Date().toISOString() }).where({ ID: req.data.requestID, status: "pendingReview" }));
    await recordAudit(actor.ID, "SkillRequestRejected", "SkillRequests", req.data.requestID);
    return db.run(SELECT.one.from(SkillRequests).where({ ID: req.data.requestID }));
};

const mergeDuplicateSkills = async (req: TypedRequest<any>): Promise<boolean> => {
    const db: Service = await connect.to("db");
    const { EmployeeSkills, SkillAliases, Skills } = db.entities;
    const source = await db.run(SELECT.one.from(Skills).where({ ID: req.data.sourceSkillID }));
    if (!source) return req.reject(404, "Source skill not found.");
    await db.run(UPDATE(EmployeeSkills).with({ skillID: req.data.targetSkillID }).where({ skillID: req.data.sourceSkillID }));
    await db.run(INSERT.into(SkillAliases).entries({ ID: utils.uuid(), skillID: req.data.targetSkillID, aliasText: source.canonicalName, normalizedAlias: normalizeText(source.canonicalName), aliasType: "legacyName", isActive: true }));
    await db.run(UPDATE(Skills).with({ status: "deprecated", isActive: false }).where({ ID: req.data.sourceSkillID }));
    return true;
};

export { approveSkillRequest, mergeDuplicateSkills, mergeSkillRequestAsAlias, rejectSkillRequest };
