using TechTeamReporting as service from '../../../../srv/cds-models/utilization';
using from './ui-lineitems';

annotate service.VUtilizationReport with @(sap.semantics: 'aggregate') {
    eventDate        @sap.aggregation.role: 'dimension';
    eventWeek        @sap.aggregation.role: 'dimension';
    eventMonth       @sap.aggregation.role: 'dimension';
    eventYear        @sap.aggregation.role: 'dimension';
    billableHours    @sap.aggregation.role: 'measure';
    investmentHours  @sap.aggregation.role: 'measure';
    nonBillableHours @sap.aggregation.role: 'measure';
    plannedHours     @sap.aggregation.role: 'measure';
    availableHours   @sap.aggregation.role: 'measure';
};

annotate service.VUtilizationReport with @(UI.Chart: {
    Title      : '{i18n>utilizationReport}',
    Description: '{i18n>utilizationReport}',
    ChartType  : #ColumnStacked,
    Measures   : [
        nonBillableHours,
        investmentHours,
        billableHours,
        availableHours,
        plannedHours
    ],
    Dimensions : [eventWeek]
});

annotate service.VUtilizationReport with {
    eventYear  @Common.IsCalendarYear;
    eventMonth @Common.IsCalendarYearMonth;
    eventWeek  @Common.IsCalendarYearWeek;
};

annotate service.VUtilizationTable with @(sap.semantics: 'aggregate') {
    teamName          @sap.aggregation.role: 'dimension';
    fullName          @sap.aggregation.role: 'dimension';
    eventWeek         @sap.aggregation.role: 'dimension';
    billableHours     @sap.aggregation.role: 'measure';
    investmentHours   @sap.aggregation.role: 'measure';
    nonBillableHours  @sap.aggregation.role: 'measure';
    plannedHours      @sap.aggregation.role: 'measure';
    availableHours    @sap.aggregation.role: 'measure';
    targetUtilization @sap.aggregation.role: 'measure';
    actualUtilization @sap.aggregation.role: 'measure';
    performanceRate   @sap.aggregation.role: 'measure';
};

annotate service.VUtilizationTable with @(
    Analytics.AggregatedProperty #avgTargetUtilization: {
        $Type               : 'Analytics.AggregatedPropertyType',
        Name                : 'avgTargetUtilization',
        AggregationMethod   : 'average',
        AggregatableProperty: targetUtilization
    },
    Analytics.AggregatedProperty #avgActualUtilization: {
        $Type               : 'Analytics.AggregatedPropertyType',
        Name                : 'avgActualUtilization',
        AggregationMethod   : 'average',
        AggregatableProperty: actualUtilization
    },
    Analytics.AggregatedProperty #avgPerformanceRate  : {
        $Type               : 'Analytics.AggregatedPropertyType',
        Name                : 'avgPerformanceRate',
        AggregationMethod   : 'average',
        AggregatableProperty: performanceRate
    }
);

annotate service.VUtilizationTable with @(UI: {PresentationVariant #Default: {
    $Type         : 'UI.PresentationVariantType',
    ID            : 'Default',
    Text          : 'Default',
    Total         : [
        billableHours,
        investmentHours,
        nonBillableHours,
        plannedHours,
        availableHours
    ],
    Visualizations: ['@UI.LineItem'],
    GroupBy       : [
        teamName,
        fullName
    ]
}});

annotate service.VUtilizationTable with {
    eventYear  @Common.IsCalendarYear;
    eventMonth @Common.IsCalendarYearMonth;
    eventWeek  @Common.IsCalendarYearWeek;
};
