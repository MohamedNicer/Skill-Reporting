using TechTeamReporting as service from '../../../../srv/cds-models/analytics';

annotate service.VAnalytics with @Capabilities: {FilterRestrictions: {
    $Type                       : 'Capabilities.FilterRestrictionsType',
    RequiresFilter              : true,
    RequiredProperties          : [bookingDate],
    NonFilterableProperties     : [
        counter,
        engagementName,
        engagementTypeText,
        fullName,
        teamName
    ],
    FilterExpressionRestrictions: [{
        $Type             : 'Capabilities.FilterExpressionRestrictionType',
        Property          : isActivePersonnel,
        AllowedExpressions: 'SingleValue'
    }]
}};
