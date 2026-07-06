using EmployeeSkillsCV from '../data-provider';

using {
    SkillCategories   as DBSkillCategories,
    ProficiencyLevels as DBProficiencyLevels,
    Skills            as DBSkills,
    SkillAliases      as DBSkillAliases,
    EmployeeSkills    as DBEmployeeSkills,
    SkillEvidence     as DBSkillEvidence,
    SkillRequests     as DBSkillRequests
} from '../../db/cds-models/skills';

extend service EmployeeSkillsCV with {
    /********************************************************************************************************/
    /* Action - Function Imports                                                                            */
    /********************************************************************************************************/

    function searchSkills(query : String(160)) returns array of Skills;

    function normalizeSkillInput(input : String(160)) returns array of SkillAliases;

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

    action approveSkillRequest(requestID : UUID) returns SkillRequests;

    action mergeSkillRequestAsAlias(requestID : UUID, skillID : UUID) returns SkillRequests;

    action rejectSkillRequest(requestID : UUID, reason : String(1000)) returns SkillRequests;

    action mergeDuplicateSkills(sourceSkillID : UUID, targetSkillID : UUID) returns Boolean;

    /********************************************************************************************************/
    /* Main Entities                                                                                        */
    /********************************************************************************************************/

    entity SkillCategories   as projection on DBSkillCategories;
    entity ProficiencyLevels as projection on DBProficiencyLevels;
    @cds.redirection.target: true
    entity Skills            as projection on DBSkills;
    entity SkillAliases      as projection on DBSkillAliases;
    @cds.redirection.target: true
    entity EmployeeSkills    as projection on DBEmployeeSkills;
    entity SkillEvidence     as projection on DBSkillEvidence;
    entity SkillRequests     as projection on DBSkillRequests;

    /********************************************************************************************************/
    /* Composite or Table Views                                                                             */
    /********************************************************************************************************/

    @readonly
    @cds.search: {canonicalName, normalizedName}
    entity VSkills           as
        select from DBSkills {
            key ID,
                categoryID,
                toCategory.name as categoryName : String(120),
                canonicalName,
                normalizedName,
                description,
                status,
                toStatus.text   as statusText   : String(80),
                isActive
        };

    @readonly
    entity VEmployeeSkills   as
        select from DBEmployeeSkills {
            key ID,
                employeeID,
                toEmployee.firstName || ' ' || toEmployee.lastName as employeeName : String(161),
                skillID,
                toSkill.canonicalName as skillName : String(160),
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
};
