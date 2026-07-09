using { AdminService } from '../srv/data-provider';

annotate AdminService.VEmployees with @(
    UI: {
        LineItem: [
            { Value: employeeNumber, Label: 'Employee Number' },
            { Value: fullName, Label: 'Full Name' },
            { Value: email, Label: 'Email' },
            { Value: departmentName, Label: 'Department' },
            { Value: jobTitle, Label: 'Job Title' }
        ],
        SelectionFields: [ employeeNumber, fullName, departmentID ],
        HeaderInfo: {
            TypeName: 'Employee',
            TypeNamePlural: 'Employees'
        }
    }
);

annotate AdminService.VEmployees with {
    employeeNumber @title: 'Employee Number';
    fullName @title: 'Full Name';
    email @title: 'Email';
    departmentName @title: 'Department Name';
    jobTitle @title: 'Job Title';
    departmentID @(
        title: 'Department',
        Common.Text: departmentName,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'Departments',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: departmentID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' }
            ]
        }
    );
};

annotate AdminService.VSkills with @(
    UI: {
        LineItem: [
            { Value: canonicalName, Label: 'Skill Name' },
            { Value: categoryName, Label: 'Category' },
            { Value: statusText, Label: 'Status' }
        ],
        SelectionFields: [ canonicalName, categoryID ],
        HeaderInfo: {
            TypeName: 'Skill',
            TypeNamePlural: 'Skills'
        }
    }
);

annotate AdminService.VSkills with {
    canonicalName @title: 'Skill Name';
    categoryName @title: 'Category';
    statusText @title: 'Status';
    categoryID @(
        title: 'Category',
        Common.Text: categoryName,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'SkillCategories',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: categoryID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' }
            ]
        }
    );
};

annotate AdminService.VEmployeeSkills with @(
    UI: {
        LineItem: [
            { Value: employeeName, Label: 'Employee' },
            { Value: skillName, Label: 'Skill' },
            { Value: proficiencyLevel, Label: 'Proficiency' },
            { Value: yearsExperience, Label: 'Years Exp' },
            { Value: validationStatusText, Label: 'Validation' },
            { Value: categoryName, Label: 'Category' }
        ],
        SelectionFields: [ employeeID, skillID, proficiencyLevelID ],
        HeaderInfo: {
            TypeName: 'Employee Skill',
            TypeNamePlural: 'Employee Skills'
        }
    }
);

annotate AdminService.VEmployeeSkills with {
    employeeName @title: 'Employee Name';
    skillName @title: 'Skill Name';
    proficiencyLevel @title: 'Proficiency Level';
    categoryName @title: 'Category Name';
    yearsExperience @title: 'Years of Experience';
    validationStatusText @title: 'Validation Status';
    employeeID @(
        title: 'Employee',
        Common.Text: employeeName,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'VEmployees',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: employeeID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'fullName' }
            ]
        }
    );
    skillID @(
        title: 'Skill',
        Common.Text: skillName,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'VSkills',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: skillID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'canonicalName' }
            ]
        }
    );
    proficiencyLevelID @(
        title: 'Proficiency Level',
        Common.Text: proficiencyLevel,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'ProficiencyLevels',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: proficiencyLevelID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'label' }
            ]
        }
    );
};

annotate AdminService.SkillCategories with @(
    UI: {
        LineItem: [
            { Value: name, Label: 'Category Name' },
            { Value: description, Label: 'Description' },
            { Value: sortOrder, Label: 'Sort Order' },
            { Value: isActive, Label: 'Active' }
        ],
        SelectionFields: [ name, isActive ],
        HeaderInfo: {
            TypeName: 'Skill Category',
            TypeNamePlural: 'Skill Categories'
        }
    }
);

annotate AdminService.SkillCategories with {
    name @title: 'Category Name';
    description @title: 'Description';
    sortOrder @title: 'Sort Order';
    isActive @title: 'Active';
};

annotate AdminService.ProficiencyLevels with @(
    UI: {
        LineItem: [
            { Value: categoryID, Label: 'Category' },
            { Value: code, Label: 'Code' },
            { Value: label, Label: 'Level Name' },
            { Value: scaleType, Label: 'Scale Type' },
            { Value: rank, Label: 'Rank' },
            { Value: isActive, Label: 'Active' }
        ],
        SelectionFields: [ categoryID, scaleType ],
        HeaderInfo: {
            TypeName: 'Proficiency Level',
            TypeNamePlural: 'Proficiency Levels'
        }
    }
);

annotate AdminService.ProficiencyLevels with {
    code @title: 'Code';
    label @title: 'Level Name';
    rank @title: 'Rank';
    isActive @title: 'Active';
    categoryID @(
        title: 'Category',
        Common.Text: toCategory.name,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'SkillCategories',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: categoryID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' }
            ]
        }
    );
    scaleType @(
        title: 'Scale Type',
        Common.Text: toScaleType.text,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'VHProficiencyScaleTypes',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: scaleType, ValueListProperty: 'code' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'text' }
            ]
        }
    );
};

annotate AdminService.SkillRequests with @(
    UI: {
        LineItem: [
            { Value: requestedByID, Label: 'Requested By' },
            { Value: requestedText, Label: 'Requested Text' },
            { Value: requestType, Label: 'Request Type' },
            { Value: status, Label: 'Status' },
            { Value: decision, Label: 'Decision' },
            { Value: requestedAt, Label: 'Requested At' }
        ],
        SelectionFields: [ requestedByID, status, decision, requestType ],
        HeaderInfo: {
            TypeName: 'Skill Request',
            TypeNamePlural: 'Skill Requests'
        }
    }
);

annotate AdminService.SkillRequests with {
    requestedText @title: 'Requested Text';
    requestedAt @title: 'Requested At';
    adminComment @title: 'Admin Comment';
    
    requestedByID @(
        title: 'Requested By',
        Common.Text: toRequestedBy.email,
        Common.TextArrangement: #TextLast,
        Common.ValueList: {
            CollectionPath: 'VEmployees',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: requestedByID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'fullName' }
            ]
        }
    );
    resolvedSkillID @(
        title: 'Resolved Skill',
        Common.Text: toResolvedSkill.canonicalName,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'VSkills',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: resolvedSkillID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'canonicalName' }
            ]
        }
    );
    requestType @(
        title: 'Request Type',
        Common.Text: toRequestType.text,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'VHSkillRequestTypes',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: requestType, ValueListProperty: 'code' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'text' }
            ]
        }
    );
    status @(
        title: 'Status',
        Common.Text: toStatus.text,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'VHSkillRequestStatuses',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: status, ValueListProperty: 'code' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'text' }
            ]
        }
    );
    decision @(
        title: 'Decision',
        Common.Text: toDecision.text,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'VHSkillRequestDecisions',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: decision, ValueListProperty: 'code' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'text' }
            ]
        }
    );
};

annotate AdminService.Skills with {
    canonicalName @title: 'Skill Name';
    description @title: 'Description';
    status @title: 'Status';
    isActive @title: 'Active';
    
    categoryID @(
        title: 'Category',
        Common.Text: toCategory.name,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'SkillCategories',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: categoryID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' }
            ]
        }
    );
};

annotate AdminService.Employees with {
    firstName @title: 'First Name';
    lastName @title: 'Last Name';
    email @title: 'Email';
    jobTitle @title: 'Job Title';
    jobFamily @title: 'Job Family';
    location @title: 'Location';
    isActive @title: 'Active';

    departmentID @(
        title: 'Department',
        Common.Text: toDepartment.name,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'Departments',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: departmentID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' }
            ]
        }
    );
    managerID @(
        title: 'Manager',
        Common.Text: toManager.firstName,
        Common.TextArrangement: #TextFirst,
        Common.ValueList: {
            CollectionPath: 'VEmployees',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: managerID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'fullName' }
            ]
        }
    );
};

using { CatalogService, EmployeeProfileService } from '../srv/data-provider';

annotate CatalogService.VSkills with @(
    UI: {
        LineItem: [
            { Value: canonicalName, Label: 'Skill Name' },
            { Value: categoryName, Label: 'Category' },
            { Value: statusText, Label: 'Status' },
            { Value: description, Label: 'Description' },
            { Value: isActive, Label: 'Active' }
        ],
        SelectionFields: [ canonicalName, categoryID, statusText ],
        HeaderInfo: {
            TypeName: 'Skill',
            TypeNamePlural: 'Skills'
        }
    }
);

annotate CatalogService.VSkills with {
    canonicalName @title: 'Skill Name';
    categoryName @title: 'Category';
    statusText @title: 'Status';
    description @title: 'Description';
    isActive @title: 'Active';
    categoryID @(
        title: 'Category',
        Common.Text: categoryName,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'SkillCategories',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: categoryID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' }
            ]
        }
    );
};

annotate EmployeeProfileService.VEmployeeSkills with @(
    UI: {
        LineItem: [
            { Value: employeeName, Label: 'Employee' },
            { Value: skillName, Label: 'Skill' },
            { Value: proficiencyLevel, Label: 'Proficiency' },
            { Value: yearsExperience, Label: 'Years Exp' },
            { Value: validationStatusText, Label: 'Validation' },
            { Value: categoryName, Label: 'Category' }
        ],
        SelectionFields: [ skillID, proficiencyLevelID ],
        HeaderInfo: {
            TypeName: 'Employee Skill',
            TypeNamePlural: 'Employee Skills'
        }
    }
);

annotate EmployeeProfileService.VEmployeeSkills with {
    employeeName @title: 'Employee Name';
    skillName @title: 'Skill Name';
    proficiencyLevel @title: 'Proficiency Level';
    categoryName @title: 'Category Name';
    yearsExperience @title: 'Years of Experience';
    validationStatusText @title: 'Validation Status';
    
    skillID @(
        title: 'Skill',
        Common.Text: skillName,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'Skills',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: skillID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'canonicalName' }
            ]
        }
    );
    proficiencyLevelID @(
        title: 'Proficiency Level',
        Common.Text: proficiencyLevel,
        Common.TextArrangement: #TextOnly,
        Common.ValueList: {
            CollectionPath: 'ProficiencyLevels',
            Parameters: [
                { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: proficiencyLevelID, ValueListProperty: 'ID' },
                { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'label' }
            ]
        }
    );
};

using { CVService } from '../srv/data-provider';

annotate CVService.VUploadedCVs with @(
    UI: {
        LineItem: [
            { Value: employeeName, Label: 'Employee' },
            { Value: fileName, Label: 'File Name' },
            { Value: mimeType, Label: 'MIME Type' },
            { Value: uploadStatusText, Label: 'Upload Status' },
            { Value: uploadedAt, Label: 'Uploaded At' }
        ],
        SelectionFields: [ employeeName, uploadStatusText ],
        HeaderInfo: {
            TypeName: 'Uploaded CV',
            TypeNamePlural: 'Uploaded CVs'
        }
    }
);

annotate CVService.VUploadedCVs with {
    employeeName @title: 'Employee Name';
    fileName @title: 'File Name';
    mimeType @title: 'MIME Type';
    uploadStatusText @title: 'Upload Status';
    uploadedAt @title: 'Uploaded At';
};

annotate CVService.VGeneratedCVs with @(
    UI: {
        LineItem: [
            { Value: employeeName, Label: 'Employee' },
            { Value: templateName, Label: 'Template' },
            { Value: fileName, Label: 'File Name' },
            { Value: generationStatusText, Label: 'Generation Status' },
            { Value: generatedAt, Label: 'Generated At' }
        ],
        SelectionFields: [ employeeName, templateName, generationStatusText ],
        HeaderInfo: {
            TypeName: 'Generated CV',
            TypeNamePlural: 'Generated CVs'
        }
    }
);

annotate CVService.VGeneratedCVs with {
    employeeName @title: 'Employee Name';
    templateName @title: 'Template Name';
    fileName @title: 'File Name';
    generationStatusText @title: 'Generation Status';
    generatedAt @title: 'Generated At';
};
