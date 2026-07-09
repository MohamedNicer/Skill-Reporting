using TechTeamReporting as service from '../../../../srv/cds-models/revenue';
using from './ui-lineitems';

annotate service.VBookingRevenue with @(sap.semantics: 'aggregate') {
    eventDate  @sap.aggregation.role: 'dimension';
    eventWeek  @sap.aggregation.role: 'dimension';
    eventMonth @sap.aggregation.role: 'dimension';
    eventYear  @sap.aggregation.role: 'dimension';
    revenue    @sap.aggregation.role: 'measure';
    profit     @sap.aggregation.role: 'measure';
    cost       @sap.aggregation.role: 'measure';
};

annotate service.VBookingRevenue with @(UI.Chart: {
    Title      : '{i18n>actuals}',
    Description: '{i18n>actuals}',
    ChartType  : #Line,
    Measures   : [
        revenue,
        cost,
        profit
    ],
    Dimensions : [eventMonth]
});

annotate service.VBookingRevenue with {
    eventYear  @Common.IsCalendarYear;
    eventMonth @Common.IsCalendarYearMonth;
    eventWeek  @Common.IsCalendarYearWeek;
};

annotate service.VForecastRevenue with @(sap.semantics: 'aggregate') {
    eventDate  @sap.aggregation.role: 'dimension';
    eventWeek  @sap.aggregation.role: 'dimension';
    eventMonth @sap.aggregation.role: 'dimension';
    eventYear  @sap.aggregation.role: 'dimension';
    revenue    @sap.aggregation.role: 'measure';
    profit     @sap.aggregation.role: 'measure';
    cost       @sap.aggregation.role: 'measure';
};

annotate service.VForecastRevenue with @(UI.Chart: {
    Title      : '{i18n>forecast}',
    Description: '{i18n>forecast}',
    ChartType  : #Line,
    Measures   : [
        revenue,
        cost,
        profit
    ],
    Dimensions : [eventMonth]
});

annotate service.VForecastRevenue with {
    eventYear  @Common.IsCalendarYear;
    eventMonth @Common.IsCalendarYearMonth;
    eventWeek  @Common.IsCalendarYearWeek;
};

annotate service.VBookingRevenueTable with @(sap.semantics: 'aggregate') {
    teamName                   @sap.aggregation.role: 'dimension';
    fullName                   @sap.aggregation.role: 'dimension';
    engagementName             @sap.aggregation.role: 'dimension';
    revenueCalculationStrategy @sap.aggregation.role: 'dimension';
    billingStatus              @sap.aggregation.role: 'dimension';
    cost                       @sap.aggregation.role: 'measure';
    revenue                    @sap.aggregation.role: 'measure';
    profit                     @sap.aggregation.role: 'measure';
    profitRate                 @sap.aggregation.role: 'measure';
};

annotate service.VBookingRevenueTable with @(UI: {PresentationVariant #Default: {
    $Type         : 'UI.PresentationVariantType',
    ID            : 'Default',
    Text          : 'Default',
    Total         : [
        cost,
        revenue,
        profit
    ],
    Visualizations: ['@UI.LineItem'],
    GroupBy       : [
        teamName,
        fullName,
        engagementName
    ]
}});

annotate service.VBookingRevenueTable with {
    eventYear  @Common.IsCalendarYear;
    eventMonth @Common.IsCalendarYearMonth;
    eventWeek  @Common.IsCalendarYearWeek;
};

annotate service.VForecastRevenueTable with @(sap.semantics: 'aggregate') {
    teamName                   @sap.aggregation.role: 'dimension';
    fullName                   @sap.aggregation.role: 'dimension';
    engagementName             @sap.aggregation.role: 'dimension';
    revenueCalculationStrategy @sap.aggregation.role: 'dimension';
    billingStatus              @sap.aggregation.role: 'dimension';
    cost                       @sap.aggregation.role: 'measure';
    revenue                    @sap.aggregation.role: 'measure';
    profit                     @sap.aggregation.role: 'measure';
    profitRate                 @sap.aggregation.role: 'measure';
};

annotate service.VForecastRevenueTable with @(UI: {PresentationVariant #Default: {
    $Type         : 'UI.PresentationVariantType',
    ID            : 'Default',
    Text          : 'Default',
    Total         : [
        cost,
        revenue,
        profit
    ],
    Visualizations: ['@UI.LineItem'],
    GroupBy       : [
        teamName,
        fullName,
        engagementName
    ]
}});

annotate service.VForecastRevenueTable with {
    eventYear  @Common.IsCalendarYear;
    eventMonth @Common.IsCalendarYearMonth;
    eventWeek  @Common.IsCalendarYearWeek;
};
