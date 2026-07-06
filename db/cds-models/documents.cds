using {managed} from '@sap/cds/common';
using {Employees} from './personnel';
using {Skills} from './skills';
using {
    DocumentTypes,
    UploadStatuses,
    ExtractionStatuses,
    CandidateDecisions,
    TemplateStatuses,
    GenerationStatuses
} from './value-help-list';

@assert.unique: {dmsObject: [dmsRepositoryID, dmsObjectID]}
entity DocumentAssets : managed {
    key ID              : UUID;
        dmsObjectID     : String(120);
        dmsRepositoryID : String(120);
        fileName        : String(255) not null;
        mimeType        : String(120);
        fileSize        : Integer64;
        checksum        : String(128);
        documentType    : DocumentTypes:code;
        versionLabel    : String(40);
        toDocumentType  : Association to one DocumentTypes
                              on toDocumentType.code = $self.documentType;
        toUploadedCV    : Association to one UploadedCVs
                              on toUploadedCV.documentAssetID = $self.ID;
        toGeneratedCV   : Association to one GeneratedCVs
                              on toGeneratedCV.documentAssetID = $self.ID;
};

entity UploadedCVs : managed {
    key ID               : UUID;
        employeeID       : Employees:ID not null;
        documentAssetID  : DocumentAssets:ID not null;
        uploadStatus     : UploadStatuses:code default 'uploading';
        uploadedAt       : DateTime @cds.on.insert: $now;
        toEmployee       : Association to one Employees
                               on toEmployee.ID = $self.employeeID;
        toDocumentAsset  : Association to one DocumentAssets
                               on toDocumentAsset.ID = $self.documentAssetID;
        toUploadStatus   : Association to one UploadStatuses
                               on toUploadStatus.code = $self.uploadStatus;
        toExtractionRuns : Composition of many CVExtractionRuns
                               on toExtractionRuns.uploadedCVID = $self.ID;
};

entity CVExtractionRuns : managed {
    key ID           : UUID;
        uploadedCVID : UploadedCVs:ID not null;
        provider     : String(80);
        modelVersion : String(80);
        status       : ExtractionStatuses:code default 'queued';
        errorMessage : String(2000);
        startedAt    : DateTime;
        finishedAt   : DateTime;
        toUploadedCV : Association to one UploadedCVs
                           on toUploadedCV.ID = $self.uploadedCVID;
        toStatus     : Association to one ExtractionStatuses
                           on toStatus.code = $self.status;
        toCandidates : Composition of many ExtractedSkillCandidates
                           on toCandidates.extractionRunID = $self.ID;
};

entity ExtractedSkillCandidates : managed {
    key ID              : UUID;
        extractionRunID : CVExtractionRuns:ID not null;
        matchedSkillID  : Skills:ID;
        rawText         : String(160) not null;
        normalizedText  : String(160);
        confidence      : Decimal(5, 2) @assert.range: [0, 100];
        decision        : CandidateDecisions:code default 'pending';
        decidedAt       : DateTime;
        toExtractionRun : Association to one CVExtractionRuns
                              on toExtractionRun.ID = $self.extractionRunID;
        toMatchedSkill  : Association to one Skills
                              on toMatchedSkill.ID = $self.matchedSkillID;
        toDecision      : Association to one CandidateDecisions
                              on toDecision.code = $self.decision;
};

entity CVTemplates : managed {
    key ID         : UUID;
        name       : String(120) not null;
        description: String(500);
        status     : TemplateStatuses:code default 'draft';
        isActive   : Boolean default false;
        toStatus   : Association to one TemplateStatuses
                         on toStatus.code = $self.status;
        toVersions : Composition of many CVTemplateVersions
                         on toVersions.templateID = $self.ID;
};

entity CVTemplateVersions : managed {
    key ID              : UUID;
        templateID      : CVTemplates:ID not null;
        versionLabel    : String(40) not null;
        language        : String(10);
        adobeTemplateID : String(120);
        dmsObjectID     : String(120);
        isActive        : Boolean default false;
        toTemplate      : Association to one CVTemplates
                              on toTemplate.ID = $self.templateID;
        toGeneratedCVs  : Association to many GeneratedCVs
                              on toGeneratedCVs.templateVersionID = $self.ID;
};

entity GeneratedCVs : managed {
    key ID                 : UUID;
        employeeID         : Employees:ID not null;
        templateVersionID  : CVTemplateVersions:ID not null;
        documentAssetID    : DocumentAssets:ID;
        generationStatus   : GenerationStatuses:code default 'requested';
        generatedAt        : DateTime;
        toEmployee         : Association to one Employees
                                 on toEmployee.ID = $self.employeeID;
        toTemplateVersion  : Association to one CVTemplateVersions
                                 on toTemplateVersion.ID = $self.templateVersionID;
        toDocumentAsset    : Association to one DocumentAssets
                                 on toDocumentAsset.ID = $self.documentAssetID;
        toGenerationStatus : Association to one GenerationStatuses
                                 on toGenerationStatus.code = $self.generationStatus;
};

