using TechTeamReporting as service from '../../../../srv/data-provider';

annotate service.VOverview with {
    ID                 @Common.Label: '{i18n>engagementID}';
    name               @Common.Label: '{i18n>engagementName}';
    country            @Common.Label: '{i18n>country}';
    teamID             @Common.Label: '{i18n>teamID}';
    WBSPattern         @Common.Label: '{i18n>WBSPattern}';
    activityType       @Common.Label: '{i18n>activityType}';
    logoURL            @Common.Label: '{i18n>logoURL}';
    teamName           @Common.Label: '{i18n>teamName}';
    state              @Common.Label: '{i18n>state}';
    totalHours         @Common.Label: '{i18n>totalHours}';
    objectStatus       @Common.Label: '{i18n>objectStatus}';
    topThreshold       @Common.Label: '{i18n>topThreshold}';
    budget             @Common.Label: '{i18n>budget}';
};
