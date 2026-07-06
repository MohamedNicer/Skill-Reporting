using EmployeeSkillsCV from '../data-provider';

using {
    SkillStatuses           as DBSkillStatuses,
    AliasTypes              as DBAliasTypes,
    SkillSources            as DBSkillSources,
    SkillValidationStatuses as DBSkillValidationStatuses,
    SkillRequestTypes       as DBSkillRequestTypes,
    SkillRequestStatuses    as DBSkillRequestStatuses,
    SkillRequestDecisions   as DBSkillRequestDecisions,
    EvidenceTypes           as DBEvidenceTypes,
    DocumentTypes           as DBDocumentTypes,
    UploadStatuses          as DBUploadStatuses,
    ExtractionStatuses      as DBExtractionStatuses,
    CandidateDecisions      as DBCandidateDecisions,
    TemplateStatuses        as DBTemplateStatuses,
    GenerationStatuses      as DBGenerationStatuses,
    ProficiencyScaleTypes   as DBProficiencyScaleTypes
} from '../../db/cds-models/value-help-list';

extend service EmployeeSkillsCV with {
    @readonly entity VHSkillStatuses           as projection on DBSkillStatuses;
    @readonly entity VHAliasTypes              as projection on DBAliasTypes;
    @readonly entity VHSkillSources            as projection on DBSkillSources;
    @readonly entity VHSkillValidationStatuses as projection on DBSkillValidationStatuses;
    @readonly entity VHSkillRequestTypes       as projection on DBSkillRequestTypes;
    @readonly entity VHSkillRequestStatuses    as projection on DBSkillRequestStatuses;
    @readonly entity VHSkillRequestDecisions   as projection on DBSkillRequestDecisions;
    @readonly entity VHEvidenceTypes           as projection on DBEvidenceTypes;
    @readonly entity VHDocumentTypes           as projection on DBDocumentTypes;
    @readonly entity VHUploadStatuses          as projection on DBUploadStatuses;
    @readonly entity VHExtractionStatuses      as projection on DBExtractionStatuses;
    @readonly entity VHCandidateDecisions      as projection on DBCandidateDecisions;
    @readonly entity VHTemplateStatuses        as projection on DBTemplateStatuses;
    @readonly entity VHGenerationStatuses      as projection on DBGenerationStatuses;
    @readonly entity VHProficiencyScaleTypes   as projection on DBProficiencyScaleTypes;
};
