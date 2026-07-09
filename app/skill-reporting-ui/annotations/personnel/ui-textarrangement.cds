using TechTeamReporting as service from '../../../../srv/cds-models/personnel';

annotate service.PersonnelUsers with {
    country @Common: {
        Text           : toCountryVH.name,
        TextArrangement: #TextFirst
    };
};

annotate service.VPersonnel with {
    teamID   @Common: {
        Text           : toTeamVH.name,
        TextArrangement: #TextOnly
    };
    country  @Common: {
        Text           : toCountryVH.name,
        TextArrangement: #TextOnly
    };
    position @Common: {
        Text           : toPositionVH.name,
        TextArrangement: #TextOnly
    };
    level    @Common: {
        Text           : toLevelVH.name,
        TextArrangement: #TextFirst
    };
};
