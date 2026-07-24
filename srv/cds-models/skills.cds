using {
    CatalogService,
    EmployeeProfileService,
    AdminService,
    AnalyticsService
} from '../data-provider';

using {
    SkillCategories   as DBSkillCategories,
    ProficiencyLevels as DBProficiencyLevels,
    Skills            as DBSkills,
    SkillAliases      as DBSkillAliases,
    EmployeeSkills    as DBEmployeeSkills,
    SkillEvidence     as DBSkillEvidence,
    SkillRequests     as DBSkillRequests
} from '../../db/cds-models/skills';

// -------------------------------------------------------------------------
// Catalog Service (Read-Only access to skills catalog — all authenticated)
// -------------------------------------------------------------------------
extend service CatalogService with {
    function searchSkills(query : String(160)) returns array of Skills;
    function normalizeSkillInput(input : String(160)) returns array of SkillAliases;

    @readonly
    @restrict: [{ grant: 'READ', to: 'authenticated-user' }]
    entity SkillCategories   as projection on DBSkillCategories;

    @readonly
    @restrict: [{ grant: 'READ', to: 'authenticated-user' }]
    entity ProficiencyLevels as projection on DBProficiencyLevels;

    @readonly
    @cds.redirection.target: true
    @restrict: [{ grant: 'READ', to: 'authenticated-user' }]
    entity Skills            as projection on DBSkills;

    @readonly
    @restrict: [{ grant: 'READ', to: 'authenticated-user' }]
    entity SkillAliases      as projection on DBSkillAliases;

    @readonly
    @cds.search: {canonicalName, normalizedName}
    @restrict: [{ grant: 'READ', to: 'authenticated-user' }]
    entity VSkills as
        select from DBSkills {
            key ID,
                categoryID,
                toCategory.name as categoryName : String(120),
                canonicalName,
                normalizedName,
                description,
                imageUrl,
                status,
                toStatus.text   as statusText   : String(80),
                isActive
        };
}

// -------------------------------------------------------------------------
// Employee Profile Service (Manage own skills — row-level ownership)
// -------------------------------------------------------------------------
extend service EmployeeProfileService with {
    action addSkill(
        employeeID : String(255),
        skillID : UUID,
        proficiencyLevelID : String(40),
        yearsExperience : Decimal(5, 2)
    ) returns EmployeeSkills;

    action updateSkillDetails(
        employeeSkillID : UUID,
        proficiencyLevelID : String(40),
        yearsExperience : Decimal(5, 2),
        lastUsedOn : Date
    ) returns EmployeeSkills;

    action removeSkill(employeeSkillID : UUID) returns Boolean;

    action requestSkill(
        requestedByID : String(255),
        requestedText : String(160),
        requestType : String(20)
    ) returns SkillRequests;

    action submitSkillRequest(requestID : UUID) returns SkillRequests;
    action updateSkillRequest(requestID : UUID, requestedText : String(160)) returns SkillRequests;
    action cancelSkillRequest(requestID : UUID) returns SkillRequests;

    @readonly entity ProficiencyLevels as projection on DBProficiencyLevels;
    @readonly entity Skills            as projection on DBSkills;

    @cds.redirection.target: true
    entity EmployeeSkills    as projection on DBEmployeeSkills;

    entity SkillEvidence     as projection on DBSkillEvidence;
    @cds.redirection.target: true
    entity SkillRequests     as projection on DBSkillRequests;

    @readonly
    entity VEmployeeSkills as
        select from DBEmployeeSkills {
            key ID,
                employeeID,
                toEmployee.firstName || ' ' || toEmployee.lastName as employeeName : String(161),
                skillID,
                toSkill.canonicalName as skillName : String(160),
                toSkill.imageUrl as skillImageUrl : String,
                toSkill.categoryID,
                toSkill.toCategory.name as categoryName : String(120),
                proficiencyLevelID,
                toProficiencyLevel.label as proficiencyLevel : String(80),
                yearsExperience,
                lastUsedOn,
                source,
                toSource.text as sourceText : String(80),
                validationStatus,
                toValidationStatus.text as validationStatusText : String(80),
                confirmedAt
        };

    @readonly
    @cds.search: {requestedByName, requestedText}
    entity VSkillRequests as
        select from DBSkillRequests {
            key ID,
                requestedByID,
                toRequestedBy.firstName || ' ' || toRequestedBy.lastName as requestedByName : String(161),
                resolvedSkillID,
                toResolvedSkill.canonicalName as resolvedSkillName : String(160),
                requestType,
                toRequestType.text as requestTypeText : String(80),
                requestedText,
                normalizedText,
                status,
                toStatus.text as statusText : String(80),
                decision,
                toDecision.text as decisionText : String(80),
                adminComment,
                requestedAt,
                decidedAt
        };
}

// -------------------------------------------------------------------------
// Admin Service (Full CRUD on all skill entities — HRAdmin / SkillsAdmin)
// -------------------------------------------------------------------------
extend service AdminService with {
    @restrict: [{ grant: 'WRITE', to: ['HRAdmin', 'SkillsAdmin'] }]
    action approveSkillRequest(requestID : UUID) returns SkillRequests;

    @restrict: [{ grant: 'WRITE', to: ['HRAdmin', 'SkillsAdmin'] }]
    action mergeSkillRequestAsAlias(requestID : UUID, skillID : UUID) returns SkillRequests;

    @restrict: [{ grant: 'WRITE', to: ['HRAdmin', 'SkillsAdmin'] }]
    action rejectSkillRequest(requestID : UUID, reason : String(1000)) returns SkillRequests;

    @restrict: [{ grant: 'WRITE', to: ['HRAdmin', 'SkillsAdmin'] }]
    action requestClarification(requestID : UUID, adminComment : String(1000)) returns SkillRequests;

    @restrict: [{ grant: 'WRITE', to: 'SkillsAdmin' }]
    action mergeDuplicateSkills(sourceSkillID : UUID, targetSkillID : UUID) returns Boolean;

    @restrict: [{ grant: 'WRITE', to: 'SkillsAdmin' }]
    action deprecateSkill(skillID : UUID) returns Skills;

    @restrict: [{ grant: 'WRITE', to: 'SkillsAdmin' }]
    action reactivateSkill(skillID : UUID) returns Skills;

    @restrict: [{ grant: 'WRITE', to: 'SkillsAdmin' }]
    action deactivateSkill(skillID : UUID) returns Skills;

    @restrict: [{ grant: '*', to: 'SkillsAdmin' }, { grant: 'READ', to: ['HRAdmin', 'Auditor'] }]
    entity SkillCategories   as projection on DBSkillCategories;

    @restrict: [{ grant: '*', to: 'SkillsAdmin' }, { grant: 'READ', to: ['HRAdmin', 'Auditor'] }]
    entity ProficiencyLevels as projection on DBProficiencyLevels;

    @cds.redirection.target: true
    @restrict: [{ grant: '*', to: 'SkillsAdmin' }, { grant: 'READ', to: ['HRAdmin', 'Auditor'] }]
    entity Skills            as projection on DBSkills;

    @restrict: [{ grant: '*', to: 'SkillsAdmin' }, { grant: 'READ', to: ['HRAdmin', 'Auditor'] }]
    entity SkillAliases      as projection on DBSkillAliases;

    @cds.redirection.target: true
    @restrict: [{ grant: ['READ', 'UPDATE'], to: ['HRAdmin', 'SkillsAdmin'] }, { grant: 'READ', to: 'Auditor' }]
    entity EmployeeSkills    as projection on DBEmployeeSkills;

    @restrict: [{ grant: 'READ', to: ['HRAdmin', 'SkillsAdmin', 'Auditor'] }]
    entity SkillEvidence     as projection on DBSkillEvidence;

    @cds.redirection.target: true
    @restrict: [{ grant: '*', to: ['HRAdmin', 'SkillsAdmin'] }, { grant: 'READ', to: 'Auditor' }]
    entity SkillRequests     as projection on DBSkillRequests;

    @readonly
    @cds.search: {canonicalName, normalizedName}
    entity VSkills as
        select from DBSkills {
            key ID,
                categoryID,
                toCategory.name as categoryName : String(120),
                canonicalName,
                normalizedName,
                description,
                imageUrl,
                status,
                toStatus.text   as statusText   : String(80),
                isActive
        };

    @readonly
    entity VEmployeeSkills as
        select from DBEmployeeSkills {
            key ID,
                employeeID,
                toEmployee.firstName || ' ' || toEmployee.lastName as employeeName : String(161),
                skillID,
                toSkill.canonicalName as skillName : String(160),
                toSkill.imageUrl as skillImageUrl : String,
                toSkill.categoryID,
                toSkill.toCategory.name as categoryName : String(120),
                proficiencyLevelID,
                toProficiencyLevel.label as proficiencyLevel : String(80),
                yearsExperience,
                lastUsedOn,
                source,
                toSource.text as sourceText : String(80),
                validationStatus,
                toValidationStatus.text as validationStatusText : String(80),
                confirmedAt
        };

    @readonly
    @cds.search: {requestedByName, requestedText}
    entity VSkillRequests as
        select from DBSkillRequests {
            key ID,
                requestedByID,
                toRequestedBy.firstName || ' ' || toRequestedBy.lastName as requestedByName : String(161),
                resolvedSkillID,
                toResolvedSkill.canonicalName as resolvedSkillName : String(160),
                requestType,
                toRequestType.text as requestTypeText : String(80),
                requestedText,
                normalizedText,
                status,
                toStatus.text as statusText : String(80),
                decision,
                toDecision.text as decisionText : String(80),
                adminComment,
                requestedAt,
                decidedAt
        };
}

// -------------------------------------------------------------------------
// Analytics Service (Manager + Admin views — team-scoped for managers)
// -------------------------------------------------------------------------
extend service AnalyticsService with {
    action endorseSkill(employeeSkillID : UUID, validationStatus : String(20), note : String(1000)) returns Boolean;
    function findEmployeesBySkill(skillID : UUID, proficiencyLevelID : String(40)) returns array of VTeamSkills;

    type DepartmentHeatmapRow {
        departmentID       : String(40);
        departmentName     : String(120);
        totalEmployees     : Integer;
        totalSkills        : Integer;
        beginnerCount      : Integer;
        intermediateCount   : Integer;
        advancedCount      : Integer;
        expertCount        : Integer;
    }
    function departmentHeatmap() returns array of DepartmentHeatmapRow;

    type SourceAnalyticsRow {
        source    : String(40);
        sourceText: String(80);
        count     : Integer;
    }
    type RequestAnalyticsRow {
        status    : String(40);
        count     : Integer;
    }
    type SkillActivitySummary {
        sources : array of SourceAnalyticsRow;
        requests: array of RequestAnalyticsRow;
    }
    function skillActivityAnalytics() returns SkillActivitySummary;

    @readonly
    entity VTeamSkills as
        select from DBEmployeeSkills {
            key ID,
                employeeID,
                toEmployee.firstName || ' ' || toEmployee.lastName as employeeName : String(161),
                toEmployee.departmentID,
                toEmployee.toDepartment.name as departmentName : String(120),
                toEmployee.managerID,
                skillID,
                toSkill.canonicalName as skillName : String(160),
                toSkill.imageUrl as skillImageUrl : String,
                toSkill.categoryID,
                toSkill.toCategory.name as categoryName : String(120),
                proficiencyLevelID,
                toProficiencyLevel.label as proficiencyLevel : String(80),
                yearsExperience,
                validationStatus,
                toValidationStatus.text as validationStatusText : String(80)
        };
}
