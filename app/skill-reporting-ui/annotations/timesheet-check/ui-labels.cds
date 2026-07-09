using TechTeamReporting as service from '../../../../srv/cds-models/timesheet-check';

annotate service.VTimesheetCheck with {
    personnelID   @Common.Label: '{i18n>personnelID}';
    workDay       @Common.Label: '{i18n>workDay}';
    fullName      @Common.Label: '{i18n>fullName}';
    teamID        @Common.Label: '{i18n>teamID}';
    teamName      @Common.Label: '{i18n>teamName}';
    expectedHours @Common.Label: '{i18n>expectedHours}';
    actualHours   @Common.Label: '{i18n>actualHours}';
    missingHours  @Common.Label: '{i18n>missingHours}';
    emailAddress  @Common.Label: '{i18n>email}';
    country       @Common.Label: '{i18n>country}';
};
