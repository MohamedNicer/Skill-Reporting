using TechTeamReporting as service from '../../../../srv/cds-models/timesheet-check';

annotate service.VTimesheetCheck @(UI: {
    SelectionFields: [
        personnelID,
        teamID,
        workDay,
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
            Value: workDay
        },
        {
            $Type: 'UI.DataField',
            Value: expectedHours
        },
        {
            $Type: 'UI.DataField',
            Value: actualHours
        },
        {
            $Type: 'UI.DataField',
            Value: missingHours
        },
        {
            $Type: 'UI.DataField',
            Value: country
        },
        {
            $Type: 'UI.DataField',
            Value: emailAddress
        }
    ]
});
