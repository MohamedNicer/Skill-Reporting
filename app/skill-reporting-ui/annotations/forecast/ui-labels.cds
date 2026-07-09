using TechTeamReporting as service from '../../../../srv/cds-models/forecast';

annotate service.PersonnelForecasts with {
    ID             @Common.Label: '{i18n>forecastID}';
    startDate      @Common.Label: '{i18n>startDate}';
    endDate        @Common.Label: '{i18n>endDate}';
    engagementID   @Common.Label: '{i18n>engagementID}';
    personnelID    @Common.Label: '{i18n>personnelID}';
    utilization    @Common.Label: '{i18n>utilization}';
    engagementName @Common.Label: '{i18n>engagementName}';
};