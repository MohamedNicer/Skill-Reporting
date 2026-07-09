using TechTeamReporting as service from '../../../../srv/cds-models/analytics';
using from './ui-lineitems';

annotate service.VAnalytics with @(sap.semantics: 'aggregate') {
    teamName           @sap.aggregation.role: 'dimension';
    fullName           @sap.aggregation.role: 'dimension';
    engagementTypeText @sap.aggregation.role: 'dimension';
    engagementName     @sap.aggregation.role: 'dimension';
    WBSElement         @sap.aggregation.role: 'dimension';
    bookingDate        @sap.aggregation.role: 'dimension';
    status             @sap.aggregation.role: 'dimension';
    bookingHour        @sap.aggregation.role: 'measure';
    nonApprovedHour    @sap.aggregation.role: 'measure';
};

annotate service.VAnalytics with @(UI: {PresentationVariant #Default: {
    $Type         : 'UI.PresentationVariantType',
    ID            : 'Default',
    Text          : 'Default',
    Total         : [
        bookingHour,
        nonApprovedHour
    ],
    Visualizations: ['@UI.LineItem'],
    GroupBy       : [
        teamName,
        fullName,
        engagementName
    ]
}});