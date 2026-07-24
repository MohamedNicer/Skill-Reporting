import { Service, TypedRequest, connect, utils } from "@sap/cds";
import { getCurrentEmployee, recordAudit } from "../util";

const endorseSkill = async (req: TypedRequest<any>): Promise<any> => {
    const db: Service = await connect.to("db");
    const { EmployeeSkills, SkillEvidence } = db.entities;
    const actor = await getCurrentEmployee(req.user.id);

    const empSkill = await db.run(SELECT.one.from(EmployeeSkills).where({ ID: req.data.employeeSkillID }));
    if (!empSkill) return req.reject(404, "Employee skill assignment not found.");

    const newStatus = req.data.validationStatus || "managerValidated";
    await db.run(UPDATE(EmployeeSkills).with({
        validationStatus: newStatus,
        confirmedAt: new Date().toISOString()
    }).where({ ID: empSkill.ID }));

    const evidenceID = utils.uuid();
    await db.run(INSERT.into(SkillEvidence).entries({
        ID: evidenceID,
        employeeSkillID: empSkill.ID,
        evidenceType: "managerEndorsement",
        sourceEntity: "Employees",
        sourceEntityID: actor.ID,
        confidence: 100,
        note: req.data.note || `Endorsed by manager ${actor.firstName} ${actor.lastName}`
    }));

    await recordAudit(actor.ID, "SkillEndorsed", "EmployeeSkills", empSkill.ID);
    return true;
};

const getDepartmentHeatmap = async (): Promise<any[]> => {
    const db: Service = await connect.to("db");
    const { Departments, Employees, EmployeeSkills, ProficiencyLevels } = db.entities;

    const departments = await db.run(SELECT.from(Departments)) as any[];
    const heatmap: any[] = [];

    for (const dept of departments) {
        const empCountObj = await db.run(SELECT.one`count(*) as cnt`.from(Employees).where({ departmentID: dept.ID, isActive: true }));
        const empCount = parseInt(empCountObj?.cnt ?? "0");

        const empList = await db.run(SELECT.from(Employees).columns("ID").where({ departmentID: dept.ID })) as any[];
        const empIds = empList.map(e => e.ID);

        let totalSkills = 0;
        let beginnerCount = 0;
        let intermediateCount = 0;
        let advancedCount = 0;
        let expertCount = 0;

        if (empIds.length > 0) {
            const skillsList = await db.run(SELECT.from(EmployeeSkills).where({ employeeID: { in: empIds } })) as any[];
            totalSkills = skillsList.length;

            for (const s of skillsList) {
                if (s.proficiencyLevelID) {
                    const prof = await db.run(SELECT.one.from(ProficiencyLevels).where({ ID: s.proficiencyLevelID }));
                    const rank = prof?.rank ?? 1;
                    if (rank <= 1) beginnerCount++;
                    else if (rank === 2) intermediateCount++;
                    else if (rank === 3) advancedCount++;
                    else expertCount++;
                } else {
                    beginnerCount++;
                }
            }
        }

        heatmap.push({
            departmentID: dept.ID,
            departmentName: dept.name,
            totalEmployees: empCount,
            totalSkills: totalSkills,
            beginnerCount: beginnerCount,
            intermediateCount: intermediateCount,
            advancedCount: advancedCount,
            expertCount: expertCount
        });
    }

    return heatmap;
};

const getSkillActivityAnalytics = async (): Promise<any> => {
    const db: Service = await connect.to("db");
    const { EmployeeSkills, SkillRequests, SkillSources, SkillRequestStatuses } = db.entities;

    const sourceCounts = await db.run(
        SELECT.from(EmployeeSkills)
            .columns("source", "count(ID) as count")
            .groupBy("source")
    ) as any[];

    const sourcesFormatted: any[] = [];
    for (const sc of sourceCounts) {
        const srcObj = await db.run(SELECT.one.from(SkillSources).where({ code: sc.source }));
        sourcesFormatted.push({
            source: sc.source || "manual",
            sourceText: srcObj?.text || sc.source || "Manual Entry",
            count: parseInt(sc.count)
        });
    }

    const requestCounts = await db.run(
        SELECT.from(SkillRequests)
            .columns("status", "count(ID) as count")
            .groupBy("status")
    ) as any[];

    const requestsFormatted = requestCounts.map((rc: any) => ({
        status: rc.status,
        count: parseInt(rc.count)
    }));

    return {
        sources: sourcesFormatted,
        requests: requestsFormatted
    };
};

export { endorseSkill, getDepartmentHeatmap, getSkillActivityAnalytics };
