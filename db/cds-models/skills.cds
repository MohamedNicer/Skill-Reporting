using {managed} from '@sap/cds/common';
using {Employees} from './personnel';
using {
    SkillStatuses,
    AliasTypes,
    SkillSources,
    SkillValidationStatuses,
    SkillRequestTypes,
    SkillRequestStatuses,
    SkillRequestDecisions,
    EvidenceTypes,
    ProficiencyScaleTypes
} from './value-help-list';

entity SkillCategories : managed {
    key ID                  : String(40);
        name                : String(120) not null;
        description         : String(500);
        sortOrder           : Integer;
        isActive            : Boolean default true;
        toSkills            : Association to many Skills
                                  on toSkills.categoryID = $self.ID;
        toProficiencyLevels : Composition of many ProficiencyLevels
                                  on toProficiencyLevels.categoryID = $self.ID;
};

@assert.unique: {categoryLevel: [categoryID, code]}
entity ProficiencyLevels : managed {
    key ID          : String(40);
        categoryID  : SkillCategories:ID not null;
        code        : String(40) not null;
        label       : String(80) not null;
        scaleType   : ProficiencyScaleTypes:code;
        rank        : Integer;
        isActive    : Boolean default true;
        toCategory  : Association to one SkillCategories
                          on toCategory.ID = $self.categoryID;
        toScaleType : Association to one ProficiencyScaleTypes
                          on toScaleType.code = $self.scaleType;
};

@assert.unique: {normalizedName: [normalizedName]}
entity Skills : managed {
    key ID                 : UUID;
        categoryID         : SkillCategories:ID;
        canonicalName      : String(160) not null;
        normalizedName     : String(160) not null;
        description        : String(1000);
        status             : SkillStatuses:code default 'proposed';
        isActive           : Boolean default false;
        toCategory         : Association to one SkillCategories
                                 on toCategory.ID = $self.categoryID;
        toStatus           : Association to one SkillStatuses
                                 on toStatus.code = $self.status;
        toAliases          : Composition of many SkillAliases
                                 on toAliases.skillID = $self.ID;
        toEmployeeSkills   : Association to many EmployeeSkills
                                 on toEmployeeSkills.skillID = $self.ID;
        toResolvedRequests : Association to many SkillRequests
                                 on toResolvedRequests.resolvedSkillID = $self.ID;
};

@assert.unique: {normalizedAlias: [normalizedAlias]}
entity SkillAliases : managed {
    key ID              : UUID;
        skillID         : Skills:ID not null;
        aliasText       : String(160) not null;
        normalizedAlias : String(160) not null;
        aliasType       : AliasTypes:code;
        locale          : String(10);
        isActive        : Boolean default true;
        toSkill         : Association to one Skills
                              on toSkill.ID = $self.skillID;
        toAliasType     : Association to one AliasTypes
                              on toAliasType.code = $self.aliasType;
};

@assert.unique: {employeeSkill: [employeeID, skillID]}
entity EmployeeSkills : managed {
    key ID                 : UUID;
        employeeID         : Employees:ID not null;
        skillID            : Skills:ID not null;
        proficiencyLevelID : ProficiencyLevels:ID;
        yearsExperience    : Decimal(5, 2) @assert.range: [0, 80];
        lastUsedOn         : Date;
        source             : SkillSources:code;
        validationStatus   : SkillValidationStatuses:code default 'selfDeclared';
        confirmedAt        : DateTime;
        toEmployee         : Association to one Employees
                                 on toEmployee.ID = $self.employeeID;
        toSkill            : Association to one Skills
                                 on toSkill.ID = $self.skillID;
        toProficiencyLevel : Association to one ProficiencyLevels
                                 on toProficiencyLevel.ID = $self.proficiencyLevelID;
        toSource           : Association to one SkillSources
                                 on toSource.code = $self.source;
        toValidationStatus : Association to one SkillValidationStatuses
                                 on toValidationStatus.code = $self.validationStatus;
        toEvidence         : Composition of many SkillEvidence
                                 on toEvidence.employeeSkillID = $self.ID;
};

entity SkillEvidence : managed {
    key ID              : UUID;
        employeeSkillID : EmployeeSkills:ID not null;
        evidenceType    : EvidenceTypes:code;
        sourceEntity    : String(80);
        sourceEntityID  : UUID;
        confidence      : Decimal(5, 2) @assert.range: [0, 100];
        note            : String(1000);
        toEmployeeSkill : Association to one EmployeeSkills
                              on toEmployeeSkill.ID = $self.employeeSkillID;
        toEvidenceType  : Association to one EvidenceTypes
                              on toEvidenceType.code = $self.evidenceType;
};

entity SkillRequests : managed {
    key ID              : UUID;
        requestedByID   : Employees:ID not null;
        resolvedSkillID : Skills:ID;
        requestType     : SkillRequestTypes:code;
        requestedText   : String(160) not null;
        normalizedText  : String(160);
        status          : SkillRequestStatuses:code default 'draft';
        decision        : SkillRequestDecisions:code;
        adminComment    : String(1000);
        requestedAt     : DateTime @cds.on.insert: $now;
        decidedAt       : DateTime;
        toRequestedBy   : Association to one Employees
                              on toRequestedBy.ID = $self.requestedByID;
        toResolvedSkill : Association to one Skills
                              on toResolvedSkill.ID = $self.resolvedSkillID;
        toRequestType   : Association to one SkillRequestTypes
                              on toRequestType.code = $self.requestType;
        toStatus        : Association to one SkillRequestStatuses
                              on toStatus.code = $self.status;
        toDecision      : Association to one SkillRequestDecisions
                              on toDecision.code = $self.decision;
};
