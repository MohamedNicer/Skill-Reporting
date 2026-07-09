using TechTeamReporting as service from '../../../../srv/cds-models/utilization';

annotate service.VUtilizationReport @(UI: {SelectionFields: [
    personnelID,
    teamID,
    eventDate,
    reportType,
    approvalStatus,
    country,
    levelID,
    positionID
]});

annotate service.VUtilizationTable @(UI: {
    SelectionFields: [
        personnelID,
        teamID,
        eventDate,
        reportType,
        approvalStatus,
        country,
        levelID,
        positionID
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
            Value: eventDate
        },
        {
            $Type: 'UI.DataField',
            Value: billableHours
        },
        {
            $Type: 'UI.DataField',
            Value: investmentHours
        },
        {
            $Type: 'UI.DataField',
            Value: nonBillableHours
        },
        {
            $Type: 'UI.DataField',
            Value: plannedHours
        },
        {
            $Type: 'UI.DataField',
            Value: availableHours
        },
        {
            $Type: 'UI.DataField',
            Value: targetUtilization
        },
        {
            $Type: 'UI.DataField',
            Value: actualUtilization
        },
        {
            $Type: 'UI.DataField',
            Value: performanceRate
        },
        {
            $Type: 'UI.DataField',
            Value: eventWeek
        }
    ]
});
