using TechTeamReporting as service from '../../../../srv/cds-models/value-help-list';

annotate service.VHObjectStatuses @(UI: {
    SelectionFields: [
        status,
        description
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: status
        },
        {
            $Type: 'UI.DataField',
            Value: description
        }

    ]
});

annotate service.VHApplicationElements @(UI: {LineItem: [
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

annotate service.VHApplicationResources @(UI: {LineItem: [
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
        Value: type
    },
    {
        $Type: 'UI.DataField',
        Value: description
    },
    {
        $Type: 'UI.DataField',
        Value: isCreatable
    },
    {
        $Type: 'UI.DataField',
        Value: isUpdatable
    },
    {
        $Type: 'UI.DataField',
        Value: isDeletable
    },
    {
        $Type: 'UI.DataField',
        Value: isReadable
    }
]});

annotate service.VHTimezones @(UI: {LineItem: [{
    $Type: 'UI.DataField',
    Value: timezone
}]});