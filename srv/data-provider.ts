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

export class DashboardService extends cds.ApplicationService {
    async init(): Promise<void> {
        const service = this as any;
        service.on("kpi", async () => {
            const db = await cds.connect.to("db");
            const { Employees, Skills, EmployeeSkills, SkillRequests } = db.entities;
            const [employees, skills, employeeSkills, pendingRequests] = await Promise.all([
                db.run(SELECT.one`count(*) as cnt`.from(Employees).where({ isActive: true })),
                db.run(SELECT.one`count(*) as cnt`.from(Skills).where({ isActive: true, status: "approved" })),
                db.run(SELECT.one`count(*) as cnt`.from(EmployeeSkills)),
                db.run(SELECT.one`count(*) as cnt`.from(SkillRequests).where({ status: "pendingReview" }))
            ]);
            return {
                employees: parseInt(employees?.cnt ?? "0"),
                skills: parseInt(skills?.cnt ?? "0"),
                employeeSkills: parseInt(employeeSkills?.cnt ?? "0"),
                pendingRequests: parseInt(pendingRequests?.cnt ?? "0")
            };
        });
        return super.init();
    }
}
