using TechTeamReporting as service from '../../../../srv/cds-models/engagements';

annotate service.VCustomerEngagements @(UI: {
    SelectionFields: [
        type,
        WBSPattern,
        activityType,
        country,
        teamID,
        name,
        state,
        targetBillableWBS,
        targetBillActType,
        targetNonBillableWBS,
        targetNonBillActType
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: name
        },
        {
            $Type: 'UI.DataField',
            Value: type
        },
        {
            $Type: 'UI.DataField',
            Value: WBSPattern
        },
        {
            $Type: 'UI.DataField',
            Value: state
        }
    ]
});

annotate service.TimesheetRecipients @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: toEngagement.name
    },
    {
        $Type: 'UI.DataField',
        Value: toEngagement.toTeam.name
    },
    {
        $Type: 'UI.DataField',
        Value: type
    },
    {
        $Type: 'UI.DataField',
        Value: email
    }
]});

annotate service.VEngagementPersonnelRates @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: WBSPattern
    },
    {
        $Type: 'UI.DataField',
        Value: personnelID
    },
    {
        $Type: 'UI.DataField',
        Value: toPersonnel.firstName
    },
    {
        $Type: 'UI.DataField',
        Value: toPersonnel.lastName
    },
    {
        $Type: 'UI.DataField',
        Value: rate
    },
    {
        $Type: 'UI.DataField',
        Value: validFrom
    },
    {
        $Type: 'UI.DataField',
        Value: validTo
    },
    {
        $Type                    : 'UI.DataField',
        Value                    : currentRate,
        Criticality              : currentRateCriticality,
        CriticalityRepresentation: #WithIcon
    }
]});

annotate service.VEngagementRates @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: WBSPattern
    },
    {
        $Type: 'UI.DataField',
        Value: rate
    },
    {
        $Type: 'UI.DataField',
        Value: validFrom
    },
    {
        $Type: 'UI.DataField',
        Value: validTo
    },
    {
        $Type                    : 'UI.DataField',
        Value                    : currentRate,
        Criticality              : currentRateCriticality,
        CriticalityRepresentation: #WithIcon
    }
]});

annotate service.EngagementActivityTypes @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: engagementID
    },
    {
        $Type: 'UI.DataField',
        Value: personnelID
    },
    {
        $Type: 'UI.DataField',
        Value: isBillable
    },
    {
        $Type: 'UI.DataField',
        Value: activityType
    }
]});

annotate service.EngagementPurchaseOrder @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: engagementID
    },
    {
        $Type: 'UI.DataField',
        Value: personnelID
    },
    {
        $Type: 'UI.DataField',
        Value: poHeader
    },
    {
        $Type: 'UI.DataField',
        Value: poItem
    }
]});

annotate service.ExcludedWBSElements @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: engagementID
    },
    {
        $Type: 'UI.DataField',
        Value: WBSElement
    },
    {
        $Type: 'UI.DataField',
        Value: reason
    }
]});
