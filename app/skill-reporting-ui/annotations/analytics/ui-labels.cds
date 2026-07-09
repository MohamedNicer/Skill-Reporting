using TechTeamReporting as service from '../../../../srv/cds-models/analytics';

annotate service.VAnalytics with {
    personnelID        @Common.Label: '{i18n>personnelID}';
    fullName           @Common.Label: '{i18n>fullName}';
    activityType       @Common.Label: '{i18n>bookingActType}';
    bookingHour        @Common.Label: '{i18n>bookingHour}';
    nonApprovedHour    @Common.Label: '{i18n>nonApprovedHour}';
    bookingDate        @Common.Label: '{i18n>bookingDate}';
    counter            @Common.Label: '{i18n>counter}';
    engagementID       @Common.Label: '{i18n>engagementID}';
    engagementName     @Common.Label: '{i18n>engagementName}';
    engagementType     @Common.Label: '{i18n>engagementTypeID}';
    engagementTypeText @Common.Label: '{i18n>engagementType}';
    teamID             @Common.Label: '{i18n>teamID}';
    teamName           @Common.Label: '{i18n>teamName}';
    WBSElement         @Common.Label: '{i18n>bookingWBSElement}';
    weekOfYear         @Common.Label: '{i18n>weekOfYear}';
    status             @Common.Label: '{i18n>status}';
    isActivePersonnel  @Common.Label: '{i18n>isActivePersonnel}';
    shortText          @Common.Label: '{i18n>shortText}';
    levelID            @Common.Label: '{i18n>employeeLevelID}';
    levelName          @Common.Label: '{i18n>employeeLevelName}';
    positionID         @Common.Label: '{i18n>positionID}';
    positionName       @Common.Label: '{i18n>positionName}';
    country            @Common.Label: '{i18n>country}';
};
