import { Request, Service, TypedRequest, connect, utils } from "@sap/cds";
import { SkillSuggestion } from "../../types/global.types";
import { getCurrentEmployee, normalizeText, recordAudit } from "../util";

const findSkillSuggestions = async (input: string): Promise<SkillSuggestion[]> => {
    const db: Service = await connect.to("db");
    const { Skills, SkillAliases } = db.entities;
    const normalized = normalizeText(input);
    if (!normalized) return [];

    const aliases = await db.run(SELECT.from(SkillAliases).where({ normalizedAlias: normalized, isActive: true })) as any[];
    const aliasSuggestions: SkillSuggestion[] = [];
    for (const alias of aliases) {
        const skill = await db.run(SELECT.one.from(Skills).where({ ID: alias.skillID, isActive: true }));
        if (skill) aliasSuggestions.push({ skillID: skill.ID, canonicalName: skill.canonicalName, matchedBy: "alias", confidence: 1 });
    }

    const skills = await db.run(SELECT.from(Skills).where({ isActive: true })) as any[];
    const skillSuggestions: SkillSuggestion[] = skills
        .filter(skill => skill.normalizedName === normalized || normalizeText(skill.canonicalName).includes(normalized))
        .map(skill => ({ skillID: skill.ID, canonicalName: skill.canonicalName, matchedBy: skill.normalizedName === normalized ? "skill" : "contains", confidence: skill.normalizedName === normalized ? 1 : 0.65 }));

    const suggestions = [...aliasSuggestions, ...skillSuggestions];
    return suggestions.filter((suggestion, index) => suggestions.findIndex(item => item.skillID === suggestion.skillID) === index);
};

const addSkillToProfile = async (req: TypedRequest<any>): Promise<any> => {
    const db: Service = await connect.to("db");
    const { EmployeeSkills } = db.entities;
    const employee = req.data.employeeID ? { ID: req.data.employeeID } : await getCurrentEmployee(req.user.id);
    const existing = await db.run(SELECT.one.from(EmployeeSkills).where({ employeeID: employee.ID, skillID: req.data.skillID }));
    if (existing) return req.reject(409, "This skill is already assigned to the profile.");
    const ID = utils.uuid();
    await db.run(INSERT.into(EmployeeSkills).entries({ ID, employeeID: employee.ID, skillID: req.data.skillID, proficiencyLevelID: req.data.proficiencyLevelID, yearsExperience: req.data.yearsExperience, lastUsedOn: req.data.lastUsedOn, source: "manual", validationStatus: "selfDeclared", confirmedAt: new Date().toISOString() }));
    await recordAudit(employee.ID, "EmployeeSkillChanged", "EmployeeSkills", ID);
    return db.run(SELECT.one.from(EmployeeSkills).where({ ID }));
};

const updateSkillDetails = async (req: TypedRequest<any>): Promise<any> => {
    const db: Service = await connect.to("db");
    const { EmployeeSkills } = db.entities;
    await db.run(UPDATE(EmployeeSkills).with({ proficiencyLevelID: req.data.proficiencyLevelID, yearsExperience: req.data.yearsExperience, lastUsedOn: req.data.lastUsedOn }).where({ ID: req.data.employeeSkillID }));
    const updated = await db.run(SELECT.one.from(EmployeeSkills).where({ ID: req.data.employeeSkillID }));
    if (updated) await recordAudit(updated.employeeID, "EmployeeSkillChanged", "EmployeeSkills", req.data.employeeSkillID);
    return updated;
};

const removeSkill = async (req: TypedRequest<any>): Promise<boolean> => Boolean(await dbDeleteEmployeeSkill(req.data.employeeSkillID));

const dbDeleteEmployeeSkill = async (employeeSkillID: string): Promise<number> => {
    const db: Service = await connect.to("db");
    const { EmployeeSkills } = db.entities;
    const existing = await db.run(SELECT.one.from(EmployeeSkills).where({ ID: employeeSkillID }));
    const deleted = await db.run(DELETE.from(EmployeeSkills).where({ ID: employeeSkillID }));
    if (deleted && existing) await recordAudit(existing.employeeID, "EmployeeSkillChanged", "EmployeeSkills", employeeSkillID);
    return deleted;
};

const requestSkill = async (req: TypedRequest<any>): Promise<any> => {
    const db: Service = await connect.to("db");
    const { SkillRequests } = db.entities;
    const employee = req.data.requestedByID ? { ID: req.data.requestedByID } : await getCurrentEmployee(req.user.id);
    const ID = utils.uuid();
    await db.run(INSERT.into(SkillRequests).entries({ ID, requestedByID: employee.ID, requestType: req.data.requestType || "newSkill", requestedText: req.data.requestedText, normalizedText: normalizeText(req.data.requestedText), status: "pendingReview", requestedAt: new Date().toISOString() }));
    await recordAudit(employee.ID, "SkillRequested", "SkillRequests", ID);
    return db.run(SELECT.one.from(SkillRequests).where({ ID }));
};

const setNormalizedSkillFields = async (req: Request): Promise<void> => {
    if (req.data.canonicalName && !req.data.normalizedName) req.data.normalizedName = normalizeText(req.data.canonicalName);
};

const setNormalizedAliasFields = async (req: Request): Promise<void> => {
    if (req.data.aliasText && !req.data.normalizedAlias) req.data.normalizedAlias = normalizeText(req.data.aliasText);
};

export { addSkillToProfile, findSkillSuggestions, removeSkill, requestSkill, setNormalizedAliasFields, setNormalizedSkillFields, updateSkillDetails };
