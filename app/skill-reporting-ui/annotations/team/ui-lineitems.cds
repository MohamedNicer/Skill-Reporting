using TechTeamReporting as service from '../../../../srv/cds-models/teams';

annotate service.VTeams @(UI: {
    SelectionFields: [
        ID,
        name,
        headOfTeam,
        numberOfPersonnel
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: name
        },
        {
            $Type: 'UI.DataField',
            Value: headOfTeamName
        },
        {
            $Type: 'UI.DataField',
            Value: numberOfPersonnel
        },
        {
            $Type: 'UI.DataField',
            Value: lastCalculatedTeamRate
        },
        {
            $Type: 'UI.DataField',
            Value: lastManualTeamRate
        }
    ]
});

annotate service.TeamRates @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: teamID
    },
    {
        $Type: 'UI.DataField',
        Value: calculatedRate
    },
    {
        $Type: 'UI.DataField',
        Value: manualRate
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
        $Type: 'UI.DataField',
        Value: lastRate
    }
]});

annotate service.VTeamRates @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: teamID
    },
    {
        $Type: 'UI.DataField',
        Value: calculatedRate
    },
    {
        $Type: 'UI.DataField',
        Value: manualRate
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
        Value                    : lastRate,
        Criticality              : lastRateCriticality,
        CriticalityRepresentation: #WithIcon
    }
]});

annotate service.ForecastAuthBypass @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: teamID
    },
    {
        $Type: 'UI.DataField',
        Value: personnelID
    }
]});
