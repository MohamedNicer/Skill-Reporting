using TechTeamReporting as service from '../../../../srv/cds-models/mappings';

annotate service.TemplateMappingHeaders @(UI: {
    SelectionFields: [
        templateType,
        isTemplatePerPerson,
        createdBy,
        modifiedBy
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: templateType
        },
        {
            $Type: 'UI.DataField',
            Value: isTemplatePerPerson
        },
        {
            $Type: 'UI.DataField',
            Value: createdBy
        },
        {
            $Type: 'UI.DataField',
            Value: createdAt
        },
        {
            $Type: 'UI.DataField',
            Value: modifiedBy
        },
        {
            $Type: 'UI.DataField',
            Value: modifiedAt
        }
    ]
});

annotate service.TemplateMappingItems @(UI: {
    SelectionFields: [
        templateType,
        sourceColumn
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: templateType
        },
        {
            $Type: 'UI.DataField',
            Value: excelCell
        },
        {
            $Type: 'UI.DataField',
            Value: sourceColumn
        },
        {
            $Type: 'UI.DataField',
            Value: singleCell
        },
        {
            $Type: 'UI.DataField',
            Value: constant
        },
        {
            $Type: 'UI.DataField',
            Value: constantValue
        },
        {
            $Type: 'UI.DataField',
            Value: dataType
        },
        {
            $Type: 'UI.DataField',
            Value: action
        }
    ]
});
