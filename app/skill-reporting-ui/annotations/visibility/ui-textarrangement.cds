using TechTeamReporting as service from '../../../../srv/cds-models/visibility';

annotate service.VApplicationVisibilities with {
    uiElement @Common: {
        Text           : toApplicationElement.description,
        TextArrangement: #TextFirst
    };
    group     @Common: {
        Text           : toApplicationGroup.description,
        TextArrangement: #TextOnly
    };
};

annotate service.VBackendAuthorizations with {
    group        @Common: {
        Text           : toApplicationGroup.description,
        TextArrangement: #TextOnly
    };
};