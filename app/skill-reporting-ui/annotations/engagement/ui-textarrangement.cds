using TechTeamReporting as service from '../../../../srv/cds-models/engagements';

annotate service.VCustomerEngagements with {
    note @UI.MultiLineText;
};

annotate service.CustomerEngagements with {
    note @UI.MultiLineText;
};

annotate service.VCustomerEngagements with {
    teamID  @Common: {
        Text           : toTeamVH.name,
        TextArrangement: #TextOnly
    };
    country @Common: {
        Text           : toCountryVH.name,
        TextArrangement: #TextOnly
    };
    state   @Common: {
        Text           : toEngagementStateVH.description,
        TextArrangement: #TextOnly
    };
    type    @Common: {
        Text           : toEngagementTypeVH.type,
        TextArrangement: #TextOnly
    };
};

annotate service.EngagementActivityTypes with {
    engagementID @Common: {
        Text           : toEngagement.name,
        TextArrangement: #TextFirst,
    };
    personnelID  @Common: {
        Text           : toPersonnelVH.fullName,
        TextArrangement: #TextFirst,
    };
};

annotate service.EngagementPurchaseOrder with {
    engagementID @Common: {
        Text           : toEngagement.name,
        TextArrangement: #TextFirst,
    };
    personnelID  @Common: {
        Text           : toPersonnelVH.fullName,
        TextArrangement: #TextFirst,
    };
};

annotate service.ExcludedWBSElements with {
    engagementID @Common: {
        Text           : toEngagement.name,
        TextArrangement: #TextFirst,
    };
};
