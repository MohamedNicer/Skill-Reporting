using TechTeamReporting as service from '../../../../srv/cds-models/teams';

annotate service.Teams with {
    ID                     @Common.Label: '{i18n>teamID}';
    name                   @Common.Label: '{i18n>teamName}';
    headOfTeam             @Common.Label: '{i18n>headOfTeam}';
    lastCalculatedTeamRate @Common.Label: '{i18n>lastCalculatedTeamRate}';
    lastManualTeamRate     @Common.Label: '{i18n>lastManualTeamRate}';
};

annotate service.VTeams with {
    ID                     @Common.Label: '{i18n>teamID}';
    headOfTeam             @Common.Label: '{i18n>headOfTeam}';
    headOfTeamName         @Common.Label: '{i18n>headOfTeam}';
    name                   @Common.Label: '{i18n>teamName}';
    numberOfPersonnel      @Common.Label: '{i18n>numberOfPersonnel}';
    lastCalculatedTeamRate @Common.Label: '{i18n>lastCalculatedTeamRate}';
    lastManualTeamRate     @Common.Label: '{i18n>lastManualTeamRate}';
};

annotate service.TeamRates with {
    teamID         @Common.Label: '{i18n>teamID}';
    validFrom      @Common.Label: '{i18n>validFrom}';
    validTo        @Common.Label: '{i18n>validTo}';
    calculatedRate @Common.Label: '{i18n>calculatedRate}';
    manualRate     @Common.Label: '{i18n>manualRate}';
    lastRate       @Common.Label: '{i18n>lastRate}';
    rateID         @Common.Label: '{i18n>rateID}';
};

annotate service.VTeamRates with {
    teamID              @Common.Label: '{i18n>teamID}';
    validFrom           @Common.Label: '{i18n>validFrom}';
    validTo             @Common.Label: '{i18n>validTo}';
    calculatedRate      @Common.Label: '{i18n>calculatedRate}';
    manualRate          @Common.Label: '{i18n>manualRate}';
    lastRate            @Common.Label: '{i18n>lastRate}';
    rateID              @Common.Label: '{i18n>rateID}';
    lastRateCriticality @Common.Label: '{i18n>lastRateCriticality}';
};

annotate service.ForecastAuthBypass with {
    teamID      @Common.Label: '{i18n>teamID}';
    personnelID @Common.Label: '{i18n>personnelID}';
};
