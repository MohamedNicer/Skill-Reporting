using TechTeamReporting as service from '../../../../srv/cds-models/utilization';
using from './ui-lineitems';

annotate service.VUtilizationTable with @(UI: {PresentationVariant #NoGroup: {
    $Type         : 'UI.PresentationVariantType',
    ID            : 'NoGroup',
    Text          : 'NoGroup',
    Total         : [
        billableHours,
        investmentHours,
        nonBillableHours,
        plannedHours,
        availableHours
    ],
    Visualizations: ['@UI.LineItem']
}});
