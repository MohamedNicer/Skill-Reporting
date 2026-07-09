using TechTeamReporting as service from '../../../../srv/cds-models/mappings';

@UI.PresentationVariant.RequestAtLeast: [
    dateFormat,
    isTemplatePerPerson,
    splitHours,
    templateType,
    concatSeperator
]
annotate service.TemplateMappingHeaders with @Capabilities.FilterRestrictions: {FilterExpressionRestrictions: [{
    $Type             : 'Capabilities.FilterExpressionRestrictionType',
    Property          : isTemplatePerPerson,
    AllowedExpressions: 'SingleValue'
}]};
