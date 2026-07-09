using TechTeamReporting as service from '../../../../srv/cds-models/revenue';
using from './ui-lineitems';

annotate service.VBookingRevenueTable with @(UI: {PresentationVariant #NoGroup: {
    $Type         : 'UI.PresentationVariantType',
    ID            : 'NoGroup',
    Text          : 'NoGroup',
    Total         : [
        cost,
        revenue,
        profit
    ],
    Visualizations: ['@UI.LineItem']
}});

annotate service.VForecastRevenueTable with @(UI: {PresentationVariant #NoGroup: {
    $Type         : 'UI.PresentationVariantType',
    ID            : 'NoGroup',
    Text          : 'NoGroup',
    Total         : [
        cost,
        revenue,
        profit
    ],
    Visualizations: ['@UI.LineItem']
}});
