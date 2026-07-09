using TechTeamReporting as service from '../../../../srv/cds-models/value-help-list';

annotate service.VHPersonnel {
    ID       @Common.Label: '{i18n>personnelID}';
    fullName @Common.Label: '{i18n>fullName}';
};

annotate service.VHCountries {
    code @Common.Label: '{i18n>countryCode}';
    name @Common.Label: '{i18n>country}';
};

annotate service.VHTeams with {
    ID             @Common.Label: '{i18n>teamID}';
    name           @Common.Label: '{i18n>teamName}';
    headOfTeamName @Common.Label: '{i18n>headOfTeam}';
};

annotate service.VHEngagementTypes with {
    ID             @Common.Label: '{i18n>engagementTypeID}';
    type           @Common.Label: '{i18n>engagementType}';
    billingStatus  @Common.Label: '{i18n>billingStatus}';
    showOnOverview @Common.Label: '{i18n>showOnOverview}';
};

annotate service.VHActivityTypes with {
    activityType @Common.Label: '{i18n>activityType}';
};

annotate service.VHCurrencies with {
    code        @Common.Label: '{i18n>currency}';
    description @Common.Label: '{i18n>description}';
};

annotate service.VHHeadOfTeams with {
    personnelID @Common.Label: '{i18n>personnelID}';
    fullName    @Common.Label: '{i18n>fullName}';
    name        @Common.Label: '{i18n>teamName}';
};

annotate service.VHEngagements with {
    ID   @Common.Label: '{i18n>engagementID}';
    name @Common.Label: '{i18n>engagementName}';
};

annotate service.VHForecastEngagements with {
    ID       @Common.Label: '{i18n>engagementID}';
    name     @Common.Label: '{i18n>engagementName}';
    teamName @Common.Label: '{i18n>teamName}';
};

annotate service.VHTemplateTypes with {
    type @Common.Label: '{i18n>templateType}';
};

annotate service.VHTimesheetTemplates with {
    ID           @Common.Label: '{i18n>fileID}';
    fileName     @Common.Label: '{i18n>fileName}';
    templateType @Common.Label: '{i18n>templateType}';
};

annotate service.VHEngagementStates with {
    state        @Common.Label: '{i18n>state}';
    description  @Common.Label: '{i18n>description}';
    objectStatus @Common.Label: '{i18n>objectStatus}';
};

annotate service.VHObjectStatuses with {
    status      @Common.Label: '{i18n>objectStatus}';
    description @Common.Label: '{i18n>description}';
};

annotate service.VHApplicationGroups with {
    ID          @Common.Label: '{i18n>groupID}';
    description @Common.Label: '{i18n>description}';
};

annotate service.VHApplicationElements with {
    ID          @Common.Label: '{i18n>elementID}';
    group       @Common.Label: '{i18n>groupID}';
    type        @Common.Label: '{i18n>elementType}';
    description @Common.Label: '{i18n>description}';
};

annotate service.VHApplicationResources with {
    group        @Common.Label: '{i18n>group}';
    resourceName @Common.Label: '{i18n>resourceName}';
    description  @Common.Label: '{i18n>resourceDescription}';
    type         @Common.Label: '{i18n>resourceType}';
    isCreatable  @Common.Label: '{i18n>isCreatable}';
    isUpdatable  @Common.Label: '{i18n>isUpdatable}';
    isDeletable  @Common.Label: '{i18n>isDeletable}';
    isReadable   @Common.Label: '{i18n>isReadable}';
};

annotate service.VHTimezones with {
    timezone @Common.Label: '{i18n>timezone}';
};

annotate service.VHGeneratorEngagements with {
    ID              @Common.Label: '{i18n>engagementID}';
    engagementName  @Common.Label: '{i18n>engagementName}';
    engagementState @Common.Label: '{i18n>state}';
    engagementType  @Common.Label: '{i18n>engagementType}';
    teamName        @Common.Label: '{i18n>teamName}';
};

annotate service.VHUniqueRecipients with {
    email @Common.Label: '{i18n>email}';
};

annotate service.VHPositions with {
    ID   @Common.Label: '{i18n>positionID}';
    name @Common.Label: '{i18n>positionName}';
};
