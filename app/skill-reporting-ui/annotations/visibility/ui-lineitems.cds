using TechTeamReporting as service from '../../../../srv/cds-models/visibility';

annotate service.VApplicationVisibilities @(UI: {
    SelectionFields: [
        uiElement,
        group,
        adminCanSee,
        managerCanSee,
        userCanSee,
        noneCanSee
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: uiElement
        },
        {
            $Type: 'UI.DataField',
            Value: toApplicationElement.type
        },
        {
            $Type: 'UI.DataField',
            Value: group
        },
        {
            $Type: 'UI.DataField',
            Value: adminCanSee
        },
        {
            $Type: 'UI.DataField',
            Value: managerCanSee
        },
        {
            $Type: 'UI.DataField',
            Value: userCanSee
        },
        {
            $Type: 'UI.DataField',
            Value: noneCanSee
        }
    ]
});

annotate service.ApplicationElements @(UI: {LineItem: [
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
        Value: description
    },
    {
        $Type: 'UI.DataField',
        Value: group
    }
]});

annotate service.VBackendAuthorizations @(UI: {
    SelectionFields: [
        resourceName,
        group
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: resourceName
        },
        {
            $Type: 'UI.DataField',
            Value: group
        },
        {
            $Type: 'UI.DataField',
            Value: adminCanCreate
        },
        {
            $Type: 'UI.DataField',
            Value: adminCanUpdate
        },
        {
            $Type: 'UI.DataField',
            Value: adminCanDelete
        },
        {
            $Type: 'UI.DataField',
            Value: adminCanRead
        },
        {
            $Type: 'UI.DataField',
            Value: managerCanCreate
        },
        {
            $Type: 'UI.DataField',
            Value: managerCanUpdate
        },
        {
            $Type: 'UI.DataField',
            Value: managerCanDelete
        },
        {
            $Type: 'UI.DataField',
            Value: managerCanRead
        },
        {
            $Type: 'UI.DataField',
            Value: userCanCreate
        },
        {
            $Type: 'UI.DataField',
            Value: userCanUpdate
        },
        {
            $Type: 'UI.DataField',
            Value: userCanDelete
        },
        {
            $Type: 'UI.DataField',
            Value: userCanRead
        },
        {
            $Type: 'UI.DataField',
            Value: noneCanCreate
        },
        {
            $Type: 'UI.DataField',
            Value: noneCanUpdate
        },
        {
            $Type: 'UI.DataField',
            Value: noneCanDelete
        },
        {
            $Type: 'UI.DataField',
            Value: noneCanRead
        }
    ]
});

annotate service.ElementDependencies @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: ID
    },
    {
        $Type: 'UI.DataField',
        Value: dependency
    },
    {
        $Type: 'UI.DataField',
        Value: createAuth
    },
    {
        $Type: 'UI.DataField',
        Value: updateAuth
    },
    {
        $Type: 'UI.DataField',
        Value: deleteAuth
    },
    {
        $Type: 'UI.DataField',
        Value: readAuth
    }
]});