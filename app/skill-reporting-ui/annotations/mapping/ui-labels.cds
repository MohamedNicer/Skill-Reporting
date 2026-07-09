using TechTeamReporting as service from '../../../../srv/cds-models/mappings';

annotate service.TemplateMappingHeaders with {
    templateType        @Common.Label: '{i18n>templateType}';
    isTemplatePerPerson @Common.Label: '{i18n>generatePerPerson}';
    splitHours          @Common.Label: '{i18n>splitHours}';
    dateFormat          @Common.Label: '{i18n>dateFormat}';
    concatSeperator     @Common.Label: '{i18n>concatSeperator}';
};

annotate service.TemplateMappingItems with {
    templateType  @Common.Label: '{i18n>templateType}';
    excelCell     @Common.Label: '{i18n>excelCell}';
    sourceColumn  @Common.Label: '{i18n>sourceColumn}';
    singleCell    @Common.Label: '{i18n>singleCell}';
    constantValue @Common.Label: '{i18n>constantValue}';
    editableUI    @Common.Label: '{i18n>editableUI}';
    action        @Common.Label: '{i18n>action}';
    dataType      @Common.Label: '{i18n>dataType}';
    constant      @Common.Label: '{i18n>constant}';
};

annotate service.BookingReportColumns with {
    COLUMN_NAME @Common.Label: '{i18n>columnName}';
    COLUMN_TEXT @Common.Label: '{i18n>columnText}';
    DATA_TYPE   @Common.Label: '{i18n>dataType}';
};
