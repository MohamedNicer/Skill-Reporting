using TechTeamReporting as service from '../../../../srv/cds-models/analytics';

annotate service.VAnalytics @(UI: {
    SelectionFields: [
        personnelID,
        teamID,
        engagementID,
        engagementType,
        WBSElement,
        bookingDate,
        isActivePersonnel,
        country,
        shortText,
        levelID,
        positionID
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: engagementTypeText
        },
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
            Value: WBSElement
        },
        {
            $Type: 'UI.DataField',
            Value: bookingDate
        },
        {
            $Type: 'UI.DataField',
            Value: bookingHour
        },
        {
            $Type: 'UI.DataField',
            Value: nonApprovedHour
        },
        {
            $Type: 'UI.DataField',
            Value: shortText
        },
        {
            $Type: 'UI.DataField',
            Value: activityType
        },
        {
            $Type: 'UI.DataField',
            Value: weekOfYear
        },
        {
            $Type: 'UI.DataField',
            Value: status
        }
    ]
});
