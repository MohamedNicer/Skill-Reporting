using TechTeamReporting as service from '../../../../srv/cds-models/revenue';

annotate service.VBookingRevenue @(UI: {SelectionFields: [
    personnelID,
    teamID,
    engagementID,
    isActivePersonnel,
    revenueCalculationStrategy,
    billingStatus,
    country
]});

annotate service.VForecastRevenue @(UI: {SelectionFields: [
    personnelID,
    teamID,
    engagementID,
    isActivePersonnel,
    revenueCalculationStrategy,
    billingStatus,
    country
]});

annotate service.VBookingRevenueTable @(UI: {
    SelectionFields: [
        personnelID,
        teamID,
        engagementID,
        isActivePersonnel,
        revenueCalculationStrategy,
        billingStatus,
        country
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: teamName
        },
        {
            $Type: 'UI.DataField',
            Value: fullName
        },
        {
            $Type: 'UI.DataField',
            Value: engagementName
        },
        {
            $Type: 'UI.DataField',
            Value: eventDate
        },
        {
            $Type: 'UI.DataField',
            Value: cost
        },
        {
            $Type: 'UI.DataField',
            Value: revenue
        },
        {
            $Type: 'UI.DataField',
            Value: profit
        },
        {
            $Type: 'UI.DataField',
            Value: profitRate
        },
        {
            $Type: 'UI.DataField',
            Value: revenueCalculationStrategy
        },
        {
            $Type: 'UI.DataField',
            Value: billingStatus
        }
    ]
});

annotate service.VForecastRevenueTable @(UI: {
    SelectionFields: [
        personnelID,
        teamID,
        engagementID,
        isActivePersonnel,
        revenueCalculationStrategy,
        billingStatus,
        country
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: teamName
        },
        {
            $Type: 'UI.DataField',
            Value: fullName
        },
        {
            $Type: 'UI.DataField',
            Value: engagementName
        },
        {
            $Type: 'UI.DataField',
            Value: eventDate
        },
        {
            $Type: 'UI.DataField',
            Value: cost
        },
        {
            $Type: 'UI.DataField',
            Value: revenue
        },
        {
            $Type: 'UI.DataField',
            Value: profit
        },
        {
            $Type: 'UI.DataField',
            Value: profitRate
        },
        {
            $Type: 'UI.DataField',
            Value: revenueCalculationStrategy
        },
        {
            $Type: 'UI.DataField',
            Value: billingStatus
        }
    ]
});
