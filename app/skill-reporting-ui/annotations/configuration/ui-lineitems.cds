using TechTeamReporting as service from '../../../../srv/cds-models/configurations';

annotate service.Countries @(UI: {
    SelectionFields: [
        code,
        name,
        timezone
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: code
        },
        {
            $Type: 'UI.DataField',
            Value: name
        },
        {
            $Type: 'UI.DataField',
            Value: timezone
        }
    ]
});

annotate service.EngagementTypes @(UI: {
    SelectionFields: [
        ID,
        type
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: ID
        },
        {
            $Type: 'UI.DataField',
            Value: type
        },
        {
            $Type: 'UI.DataField',
            Value: billingStatus
        },
        {
            $Type: 'UI.DataField',
            Value: showOnOverview
        }
    ]
});

annotate service.Currencies @(UI: {
    SelectionFields: [
        code,
        description
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: code
        },
        {
            $Type: 'UI.DataField',
            Value: description
        }
    ]
});

annotate service.EngagementStates @(UI: {
    SelectionFields: [
        state,
        description,
        objectStatus,
        includeToReports
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: state
        },
        {
            $Type: 'UI.DataField',
            Value: description
        },
        {
            $Type: 'UI.DataField',
            Value: objectStatus
        },
        {
            $Type: 'UI.DataField',
            Value: includeToReports
        }
    ]
});

annotate service.TimesheetTemplates @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: fileName
    },
    {
        $Type: 'UI.DataField',
        Value: templateType
    }
]});

annotate service.Positions @(UI: {
    SelectionFields: [
        ID,
        name
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: ID
        },
        {
            $Type: 'UI.DataField',
            Value: name
        }
    ]
});
