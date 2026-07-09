using TechTeamReporting as service from '../../../../srv/cds-models/app-logs';

annotate service.VAppActivityLogs @(UI: {
    SelectionFields: [
        ID,
        firstName,
        lastName
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: ID
        },
        {
            $Type: 'UI.DataField',
            Value: firstName
        },
        {
            $Type: 'UI.DataField',
            Value: lastName
        },
        {
            $Type: 'UI.DataField',
            Value: email
        },
        {
            $Type: 'UI.DataField',
            Value: lastLoginTime
        },
        {
            $Type: 'UI.DataField',
            Value: loginCount
        }
    ]
});

annotate service.VTimesheetMailLogs @(UI: {
    SelectionFields: [
        engagementID,
        mailType,
        sender,
        sentAt
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: engagementName
        },
        {
            $Type: 'UI.DataField',
            Value: beginDate
        },
        {
            $Type: 'UI.DataField',
            Value: endDate
        },
        {
            $Type: 'UI.DataField',
            Value: senderName
        },
        {
            $Type: 'UI.DataField',
            Value: mailType
        },
        {
            $Type: 'UI.DataField',
            Value: sentAt
        }
    ]
});