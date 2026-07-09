using TechTeamReporting as service from '../../../../srv/cds-models/app-logs';

annotate service.VTimesheetMailLogs with {
    ID             @Common.Label: '{i18n>logID}';
    beginDate      @Common.Label: '{i18n>beginDate}';
    endDate        @Common.Label: '{i18n>endDate}';
    engagementID   @Common.Label: '{i18n>engagementID}';
    engagementName @Common.Label: '{i18n>engagementName}';
    mailType       @Common.Label: '{i18n>mailType}';
    sender         @Common.Label: '{i18n>sender}';
    senderName     @Common.Label: '{i18n>senderName}';
    sentAt         @Common.Label: '{i18n>sentAt}';
};

annotate service.VAppActivityLogs with {
    ID            @Common.Label: '{i18n>userID}';
    email         @Common.Label: '{i18n>email}';
    firstName     @Common.Label: '{i18n>firstName}';
    lastLoginTime @Common.Label: '{i18n>lastLoginTime}';
    lastName      @Common.Label: '{i18n>lastName}';
    loginCount    @Common.Label: '{i18n>loginCount}';
};