using TechTeamReporting as service from '../../../../srv/cds-models/common';

annotate service.ApplicationAdmins @(UI: {LineItem: [
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
    }
]});
