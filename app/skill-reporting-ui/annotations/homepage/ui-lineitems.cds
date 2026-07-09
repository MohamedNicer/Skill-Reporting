using TechTeamReporting as service from '../../../../srv/data-provider';

annotate service.VOverview @(UI: {
    SelectionFields: [
        ID,
        name,
        teamID,
        teamName,
        state,
        country
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: country
        },
        {
            $Type: 'UI.DataField',
            Value: teamName
        }
    ]
});
