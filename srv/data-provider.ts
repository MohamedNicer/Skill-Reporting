import cds, { Request } from "@sap/cds";
import { addSkillToProfile, findSkillSuggestions, removeSkill, requestSkill, setNormalizedAliasFields, setNormalizedSkillFields, updateSkillDetails } from "./lib/event-handlers/skills";
import { confirmExtractedSkills, downloadDocument, generateCV, startExtraction, uploadCV } from "./lib/event-handlers/documents";
import { approveSkillRequest, mergeDuplicateSkills, mergeSkillRequestAsAlias, rejectSkillRequest } from "./lib/event-handlers/admin";

export class CatalogService extends cds.ApplicationService {
    async init(): Promise<void> {
        const service = this as any;
        service.on("searchSkills", async (req: Request) => findSkillSuggestions(req.data.query));
        service.on("normalizeSkillInput", async (req: Request) => findSkillSuggestions(req.data.input));
        return super.init();
    }
}

export class EmployeeProfileService extends cds.ApplicationService {
    async init(): Promise<void> {
        const service = this as any;
        service.on("addSkill", addSkillToProfile);
        service.on("updateSkillDetails", updateSkillDetails);
        service.on("removeSkill", removeSkill);
        service.on("requestSkill", requestSkill);
        return super.init();
    }
}

export class CVService extends cds.ApplicationService {
    async init(): Promise<void> {
        const service = this as any;
        service.on("uploadCV", uploadCV);
        service.on("startExtraction", startExtraction);
        service.on("confirmExtractedSkills", confirmExtractedSkills);
        service.on("generateCV", generateCV);
        service.on("downloadDocument", downloadDocument);
        return super.init();
    }
}

export class AdminService extends cds.ApplicationService {
    async init(): Promise<void> {
        const service = this as any;
        service.before(["CREATE", "UPDATE"], "Skills", setNormalizedSkillFields);
        service.before(["CREATE", "UPDATE"], "SkillAliases", setNormalizedAliasFields);
        
        service.on("approveSkillRequest", approveSkillRequest);
        service.on("mergeSkillRequestAsAlias", mergeSkillRequestAsAlias);
        service.on("rejectSkillRequest", rejectSkillRequest);
        service.on("mergeDuplicateSkills", mergeDuplicateSkills);
        return super.init();
    }
}

export class AnalyticsService extends cds.ApplicationService {
    async init(): Promise<void> {
        return super.init();
    }
}

export class IntegrationService extends cds.ApplicationService {
    async init(): Promise<void> {
        return super.init();
    }
}
