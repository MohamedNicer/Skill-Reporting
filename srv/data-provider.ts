import cds, { Request } from "@sap/cds";
import { addSkillToProfile, cancelSkillRequest, findSkillSuggestions, removeSkill, requestSkill, setNormalizedAliasFields, setNormalizedSkillFields, submitSkillRequest, updateSkillDetails, updateSkillRequest } from "./lib/event-handlers/skills";
import { confirmExtractedSkills, downloadDocument, generateCV, startExtraction, uploadCV } from "./lib/event-handlers/documents";
import { approveSkillRequest, deactivateSkill, deprecateSkill, mergeDuplicateSkills, mergeSkillRequestAsAlias, reactivateSkill, rejectSkillRequest, requestClarification } from "./lib/event-handlers/admin";
import { endorseSkill, getDepartmentHeatmap, getSkillActivityAnalytics } from "./lib/event-handlers/manager";

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
        service.on("submitSkillRequest", submitSkillRequest);
        service.on("updateSkillRequest", updateSkillRequest);
        service.on("cancelSkillRequest", cancelSkillRequest);

        // Row-level / team scoping: employees see own data, managers see self + direct reports
        service.before("READ", ["EmployeeSkills", "VEmployeeSkills"], async (req: Request) => {
            if (req.user.is("HRAdmin") || req.user.is("SkillsAdmin") || req.user.is("Auditor")) {
                return; // Full access
            }
            const db = await cds.connect.to("db");
            const { Employees } = db.entities;
            let currentEmp = await db.run(SELECT.one.from(Employees).where({ email: req.user.id }));
            if (!currentEmp) currentEmp = await db.run(SELECT.one.from(Employees).where({ ID: req.user.id }));
            if (currentEmp) {
                if (req.user.is("Manager")) {
                    const teamMembers = await db.run(SELECT.from(Employees).columns("ID").where({ managerID: currentEmp.ID }));
                    const allowedEmpIds = teamMembers.map((e: any) => e.ID);
                    allowedEmpIds.push(currentEmp.ID);
                    req.query.where({ employeeID: { in: allowedEmpIds } });
                } else {
                    req.query.where({ employeeID: currentEmp.ID });
                }
            }
        });

        service.before("READ", ["SkillRequests", "VSkillRequests"], async (req: Request) => {
            if (req.user.is("HRAdmin") || req.user.is("SkillsAdmin") || req.user.is("Auditor")) {
                return; // Full access
            }
            const db = await cds.connect.to("db");
            const { Employees } = db.entities;
            let currentEmp = await db.run(SELECT.one.from(Employees).where({ email: req.user.id }));
            if (!currentEmp) currentEmp = await db.run(SELECT.one.from(Employees).where({ ID: req.user.id }));
            if (currentEmp) {
                if (req.user.is("Manager")) {
                    const teamMembers = await db.run(SELECT.from(Employees).columns("ID").where({ managerID: currentEmp.ID }));
                    const allowedEmpIds = teamMembers.map((e: any) => e.ID);
                    allowedEmpIds.push(currentEmp.ID);
                    req.query.where({ requestedByID: { in: allowedEmpIds } });
                } else {
                    req.query.where({ requestedByID: currentEmp.ID });
                }
            }
        });

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
        service.on("requestClarification", requestClarification);
        service.on("mergeSkillRequestAsAlias", mergeSkillRequestAsAlias);
        service.on("rejectSkillRequest", rejectSkillRequest);
        service.on("mergeDuplicateSkills", mergeDuplicateSkills);
        service.on("deprecateSkill", deprecateSkill);
        service.on("reactivateSkill", reactivateSkill);
        service.on("deactivateSkill", deactivateSkill);
        return super.init();
    }
}

export class AnalyticsService extends cds.ApplicationService {
    async init(): Promise<void> {
        const service = this as any;

        // Manager team scoping: filter VTeamSkills to only team members
        service.before("READ", "VTeamSkills", async (req: Request) => {
            if (req.user.is("HRAdmin") || req.user.is("SkillsAdmin") || req.user.is("Auditor")) {
                return; // Full access
            }
            if (req.user.is("Manager")) {
                // Find the employee record for this manager user
                const db = await cds.connect.to("db");
                const { Employees } = db.entities;
                let manager = await db.run(SELECT.one.from(Employees).where({ email: req.user.id }));
                if (!manager) manager = await db.run(SELECT.one.from(Employees).where({ ID: req.user.id }));
                if (manager) {
                    // Filter to only direct reports
                    req.query.where({ managerID: manager.ID });
                }
            }
        });

        // Manager team scoping: filter VEmployees to only team members
        service.before("READ", "VEmployees", async (req: Request) => {
            if (req.user.is("HRAdmin") || req.user.is("SkillsAdmin") || req.user.is("Auditor")) {
                return; // Full access
            }
            if (req.user.is("Manager")) {
                const db = await cds.connect.to("db");
                const { Employees } = db.entities;
                let manager = await db.run(SELECT.one.from(Employees).where({ email: req.user.id }));
                if (!manager) manager = await db.run(SELECT.one.from(Employees).where({ ID: req.user.id }));
                if (manager) {
                    req.query.where({ managerID: manager.ID });
                }
            }
        });

        service.on("endorseSkill", endorseSkill);
        service.on("departmentHeatmap", async () => getDepartmentHeatmap());
        service.on("skillActivityAnalytics", async () => getSkillActivityAnalytics());

        service.on("findEmployeesBySkill", async (req: Request) => {
            const db = await cds.connect.to("db");
            const { EmployeeSkills } = db.entities;
            const where: any = { skillID: req.data.skillID };
            if (req.data.proficiencyLevelID) {
                where.proficiencyLevelID = req.data.proficiencyLevelID;
            }
            return db.run(
                SELECT.from(EmployeeSkills)
                    .columns(
                        "ID", "employeeID",
                        "toEmployee.firstName as firstName", "toEmployee.lastName as lastName",
                        "skillID", "toSkill.canonicalName as skillName",
                        "proficiencyLevelID", "toProficiencyLevel.label as proficiencyLevel",
                        "yearsExperience"
                    )
                    .where(where)
            );
        });

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

        // User info endpoint for frontend role-aware visibility + employee details
        service.on("userInfo", async (req: Request) => {
            const db = await cds.connect.to("db");
            const { Employees, Departments } = db.entities;

            // Look up employee record by email or ID
            let employee: any = null;
            try {
                employee = await db.run(SELECT.one.from(Employees).where({ email: req.user.id }));
                if (!employee) employee = await db.run(SELECT.one.from(Employees).where({ ID: req.user.id }));
            } catch {
                // Employee lookup failed — not critical
            }

            // Look up department name if employee has one
            let departmentName: string | null = null;
            if (employee?.departmentID) {
                try {
                    const dept = await db.run(SELECT.one.from(Departments).where({ ID: employee.departmentID }));
                    departmentName = dept?.name || null;
                } catch { /* ignore */ }
            }

            return {
                id: req.user.id,
                Employee: req.user.is("Employee"),
                Manager: req.user.is("Manager"),
                HRAdmin: req.user.is("HRAdmin"),
                SkillsAdmin: req.user.is("SkillsAdmin"),
                Auditor: req.user.is("Auditor"),
                // Employee details (null if no record found)
                employeeID: employee?.ID || null,
                employeeNumber: employee?.employeeNumber || null,
                firstName: employee?.firstName || req.user.id,
                lastName: employee?.lastName || "",
                email: employee?.email || req.user.id,
                jobTitle: employee?.jobTitle || null,
                departmentName: departmentName,
                location: employee?.location || null
            };
        });

        // Helper to get team member employee IDs for a Manager
        const getTeamEmployeeIds = async (db: any, userId: string) => {
            const { Employees } = db.entities;
            let manager = await db.run(SELECT.one.from(Employees).where({ email: userId }));
            if (!manager) manager = await db.run(SELECT.one.from(Employees).where({ ID: userId }));
            if (manager) {
                const teamMembers = await db.run(SELECT.from(Employees).columns("ID").where({ managerID: manager.ID, isActive: true }));
                const ids = teamMembers.map((e: any) => e.ID);
                ids.push(manager.ID);
                return ids;
            }
            return [];
        };

        service.on("kpi", async (req: Request) => {
            const db = await cds.connect.to("db");
            const { Employees, Skills, EmployeeSkills, SkillRequests } = db.entities;

            const isAdmin = req.user.is("HRAdmin") || req.user.is("SkillsAdmin");
            const isAuditor = req.user.is("Auditor");
            const isManager = req.user.is("Manager");

            let employeeFilter: any = { isActive: true };
            let skillAssignmentFilter: any = {};
            let requestFilter: any = { status: "pendingReview" };

            if (!isAdmin && !isAuditor && isManager) {
                const db = await cds.connect.to("db");
                const { Employees } = db.entities;
                let manager = await db.run(SELECT.one.from(Employees).where({ email: req.user.id }));
                if (!manager) manager = await db.run(SELECT.one.from(Employees).where({ ID: req.user.id }));
                if (manager) {
                    employeeFilter = { managerID: manager.ID, isActive: true };

                    const teamMembers = await db.run(SELECT.from(Employees).columns("ID").where({ managerID: manager.ID, isActive: true }));
                    const ids = teamMembers.map((e: any) => e.ID);
                    ids.push(manager.ID); // Include manager's own skills in skill assignments & requests

                    skillAssignmentFilter = { employeeID: { in: ids } };
                    requestFilter = { status: "pendingReview", requestedByID: { in: ids } };
                }
            }

            const [employees, skills, employeeSkills, pendingRequests] = await Promise.all([
                db.run(SELECT.one`count(*) as cnt`.from(Employees).where(employeeFilter)),
                db.run(SELECT.one`count(*) as cnt`.from(Skills).where({ isActive: true, status: "approved" })),
                db.run(SELECT.one`count(*) as cnt`.from(EmployeeSkills).where(skillAssignmentFilter)),
                db.run(SELECT.one`count(*) as cnt`.from(SkillRequests).where(requestFilter))
            ]);
            return {
                employees: parseInt(employees?.cnt ?? "0"),
                skills: parseInt(skills?.cnt ?? "0"),
                employeeSkills: parseInt(employeeSkills?.cnt ?? "0"),
                pendingRequests: parseInt(pendingRequests?.cnt ?? "0")
            };
        });

        service.on("topSkills", async (req: Request) => {
            const db = await cds.connect.to("db");
            const { EmployeeSkills } = db.entities;

            const isAdmin = req.user.is("HRAdmin") || req.user.is("SkillsAdmin");
            const isAuditor = req.user.is("Auditor");
            const isManager = req.user.is("Manager");

            let query = SELECT.from(EmployeeSkills)
                .columns("toSkill.canonicalName as skillName", "toSkill.imageUrl as imageUrl", "count(employeeID) as count");

            if (!isAdmin && !isAuditor && isManager) {
                const teamIds = await getTeamEmployeeIds(db, req.user.id);
                if (teamIds.length > 0) {
                    query.where({ employeeID: { in: teamIds } });
                }
            }

            const result = await db.run(
                query.groupBy("toSkill.canonicalName", "toSkill.imageUrl")
                    .orderBy("count desc")
                    .limit(3)
            );
            return result.map((r: any) => {
                let finalImageUrl = r.imageUrl || "sap-icon://education";
                if (finalImageUrl && !finalImageUrl.startsWith("sap-icon://") && !finalImageUrl.startsWith("http") && !finalImageUrl.startsWith("/")) {
                    finalImageUrl = "../../" + finalImageUrl;
                }
                return { skillName: r.skillName, imageUrl: finalImageUrl, count: parseInt(r.count) };
            });
        });

        service.on("skillsByCategory", async () => {
            const db = await cds.connect.to("db");
            const { Skills } = db.entities;
            const result = await db.run(
                SELECT.from(Skills)
                    .columns("toCategory.name as categoryName", "count(ID) as count")
                    .where({ isActive: true })
                    .groupBy("toCategory.name")
                    .orderBy("count desc")
            );
            return result.map((r: any) => ({ categoryName: r.categoryName, count: parseInt(r.count) }));
        });

        service.on("requestsStatus", async (req: Request) => {
            const db = await cds.connect.to("db");
            const { SkillRequests } = db.entities;

            const isAdmin = req.user.is("HRAdmin") || req.user.is("SkillsAdmin");
            const isAuditor = req.user.is("Auditor");
            const isManager = req.user.is("Manager");

            let query = SELECT.from(SkillRequests).columns("status", "count(ID) as count");

            if (!isAdmin && !isAuditor && isManager) {
                const teamIds = await getTeamEmployeeIds(db, req.user.id);
                if (teamIds.length > 0) {
                    query.where({ requestedByID: { in: teamIds } });
                }
            }

            const result = await db.run(
                query.groupBy("status").orderBy("count desc")
            );
            const formatStatus = (s: string) => {
                if (!s) return "Unknown";
                let str = s.replace(/([A-Z])/g, " $1");
                return str.charAt(0).toUpperCase() + str.slice(1);
            };
            return result.map((r: any) => ({ status: formatStatus(r.status), count: parseInt(r.count) }));
        });
        return super.init();
    }
}
