using TechTeamReporting as service from '../../../../srv/cds-models/configurations';

annotate service.EngagementTypes with {
    ID             @Common.Label: '{i18n>engagementTypeID}';
    type           @Common.Label: '{i18n>engagementType}';
    billingStatus  @Common.Label: '{i18n>billingStatus}';
    showOnOverview @Common.Label: '{i18n>showOnOverview}';
};

annotate service.Countries with {
    code     @Common.Label: '{i18n>countryCode}';
    name     @Common.Label: '{i18n>country}';
    timezone @Common.Label: '{i18n>timezone}';
};

annotate service.Currencies with {
    code        @Common.Label: '{i18n>currency}';
    description @Common.Label: '{i18n>description}';
};

annotate service.EngagementStates with {
    state            @Common.Label: '{i18n>state}';
    description      @Common.Label: '{i18n>description}';
    objectStatus     @Common.Label: '{i18n>objectStatus}';
    includeToReports @Common.Label: '{i18n>includeToReports}';
};

annotate service.TimesheetTemplates with {
    ID           @Common.Label: '{i18n>fileID}';
    mediaContent @Common.Label: '{i18n>mediaContent}';
    mediaType    @Common.Label: '{i18n>mediaType}';
    url          @Common.Label: '{i18n>url}';
    fileName     @Common.Label: '{i18n>fileName}';
    templateType @Common.Label: '{i18n>templateType}';
};

annotate service.Positions with {
    ID   @Common.Label: '{i18n>positionID}';
    name @Common.Label: '{i18n>positionName}';
};
