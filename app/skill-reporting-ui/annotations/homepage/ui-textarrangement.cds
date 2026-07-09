using TechTeamReporting as service from '../../../../srv/data-provider';

annotate service.VOverview with {
    ID      @Common: {
        Text           : toEngagementVH.name,
        TextArrangement: #TextFirst
    };
    teamID  @Common: {
        Text           : toTeamVH.name,
        TextArrangement: #TextFirst
    };
    country @Common: {
        Text           : toCountryVH.name,
        TextArrangement: #TextOnly
    };
    state   @Common: {
        Text           : toEngagementStateVH.description,
        TextArrangement: #TextFirst
    };
};
