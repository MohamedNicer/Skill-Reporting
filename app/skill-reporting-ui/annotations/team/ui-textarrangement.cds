using TechTeamReporting as service from '../../../../srv/cds-models/teams';

annotate service.VTeams with {
    headOfTeam @Common: {
        Text           : toTeamHeadVH.fullName,
        TextArrangement: #TextOnly
    }
};

annotate service.ForecastAuthBypass with {
    teamID      @Common: {
        Text           : toTeam.name,
        TextArrangement: #TextFirst
    };
    personnelID @Common: {
        Text           : toPersonnelVH.fullName,
        TextArrangement: #TextFirst
    }
};
