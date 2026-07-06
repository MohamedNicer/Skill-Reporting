using EmployeeSkillsCV from '../data-provider';

using {
    DocumentAssets           as DBDocumentAssets,
    UploadedCVs              as DBUploadedCVs,
    CVExtractionRuns         as DBCVExtractionRuns,
    ExtractedSkillCandidates as DBExtractedSkillCandidates,
    CVTemplates              as DBCVTemplates,
    CVTemplateVersions       as DBCVTemplateVersions,
    GeneratedCVs             as DBGeneratedCVs
} from '../../db/cds-models/documents';

extend service EmployeeSkillsCV with {
    /********************************************************************************************************/
    /* Action - Function Imports                                                                            */
    /********************************************************************************************************/

    action uploadCV(
        employeeID : String(255),
        fileName : String(255),
        mimeType : String(120)
    ) returns UploadedCVs;

    action startExtraction(uploadedCVID : UUID) returns CVExtractionRuns;

    action confirmExtractedSkills(extractionRunID : UUID) returns Boolean;

    action generateCV(employeeID : String(255), templateVersionID : UUID) returns GeneratedCVs;

    function downloadDocument(documentAssetID : UUID) returns String(1000);

    /********************************************************************************************************/
    /* Main Entities                                                                                        */
    /********************************************************************************************************/

    entity DocumentAssets           as projection on DBDocumentAssets;
    @cds.redirection.target: true
    entity UploadedCVs              as projection on DBUploadedCVs;
    entity CVExtractionRuns         as projection on DBCVExtractionRuns;
    entity ExtractedSkillCandidates as projection on DBExtractedSkillCandidates;
    entity CVTemplates              as projection on DBCVTemplates;
    entity CVTemplateVersions       as projection on DBCVTemplateVersions;
    @cds.redirection.target: true
    entity GeneratedCVs             as projection on DBGeneratedCVs;

    /********************************************************************************************************/
    /* Composite or Table Views                                                                             */
    /********************************************************************************************************/

    @readonly
    entity VUploadedCVs             as
        select from DBUploadedCVs {
            key ID,
                employeeID,
                toEmployee.firstName || ' ' || toEmployee.lastName as employeeName : String(161),
                documentAssetID,
                toDocumentAsset.fileName as fileName : String(255),
                toDocumentAsset.mimeType as mimeType : String(120),
                uploadStatus,
                toUploadStatus.text as uploadStatusText : String(80),
                uploadedAt
        };

    @readonly
    entity VGeneratedCVs            as
        select from DBGeneratedCVs {
            key ID,
                employeeID,
                toEmployee.firstName || ' ' || toEmployee.lastName as employeeName : String(161),
                templateVersionID,
                toTemplateVersion.toTemplate.name as templateName : String(120),
                documentAssetID,
                toDocumentAsset.fileName as fileName : String(255),
                generationStatus,
                toGenerationStatus.text as generationStatusText : String(80),
                generatedAt
        };
};

