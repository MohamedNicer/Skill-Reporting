using TechTeamReporting as service from '../../../../srv/cds-models/revenue';

annotate service.VBookingRevenue with @Capabilities: {FilterRestrictions: {
    $Type                       : 'Capabilities.FilterRestrictionsType',
    FilterExpressionRestrictions: [{
        $Type             : 'Capabilities.FilterExpressionRestrictionType',
        Property          : isActivePersonnel,
        AllowedExpressions: 'SingleValue'
    }]
}};

annotate service.VBookingRevenueTable with @Capabilities: {FilterRestrictions: {
    $Type                       : 'Capabilities.FilterRestrictionsType',
    FilterExpressionRestrictions: [{
        $Type             : 'Capabilities.FilterExpressionRestrictionType',
        Property          : isActivePersonnel,
        AllowedExpressions: 'SingleValue'
    }]
}};

annotate service.VForecastRevenue with @Capabilities: {FilterRestrictions: {
    $Type                       : 'Capabilities.FilterRestrictionsType',
    FilterExpressionRestrictions: [{
        $Type             : 'Capabilities.FilterExpressionRestrictionType',
        Property          : isActivePersonnel,
        AllowedExpressions: 'SingleValue'
    }]
}};

annotate service.VForecastRevenueTable with @Capabilities: {FilterRestrictions: {
    $Type                       : 'Capabilities.FilterRestrictionsType',
    FilterExpressionRestrictions: [{
        $Type             : 'Capabilities.FilterExpressionRestrictionType',
        Property          : isActivePersonnel,
        AllowedExpressions: 'SingleValue'
    }]
}};
