using TechTeamReporting as service from '../../../../srv/cds-models/personnel';

annotate service.VPersonnel @(UI: {
    SelectionFields: [
        ID,
        firstName,
        lastName,
        teamID,
        country,
        isActive,
        isDedicated,
        position,
        level
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
            Value: country
        },
        {
            $Type: 'UI.DataField',
            Value: workHours
        },
        {
            $Type: 'UI.DataField',
            Value: toTeam.name
        },
        {
            $Type: 'UI.DataField',
            Value: headOfTeam
        },
        {
            $Type                    : 'UI.DataField',
            Value                    : isActive,
            Criticality              : isActiveCriticality,
            CriticalityRepresentation: #WithIcon
        },
        {
            $Type                    : 'UI.DataField',
            Value                    : isDedicated,
            Criticality              : isDedicatedCriticality,
            CriticalityRepresentation: #WithIcon
        },
        {
            $Type: 'UI.DataField',
            Value: position
        },
        {
            $Type: 'UI.DataField',
            Value: level
        },
        {
            $Type: 'UI.DataField',
            Value: email
        }
    ]
});

annotate service.PersonnelUsers @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: personnelID
    },
    {
        $Type: 'UI.DataField',
        Value: userID
    },
    {
        $Type: 'UI.DataField',
        Value: isDefaultUser
    },
    {
        $Type: 'UI.DataField',
        Value: country
    }
]});
