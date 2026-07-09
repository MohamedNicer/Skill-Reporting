using TechTeamReporting as service from '../../../../srv/cds-models/analytics';
using from './ui-lineitems';

annotate service.VAnalytics with @(UI: {PresentationVariant #Personnel: {
    $Type         : 'UI.PresentationVariantType',
    ID            : 'Personnel',
    Text          : 'Personnel',
    GroupBy       : [fullName],
    Total         : [
        bookingHour,
        nonApprovedHour
    ],
    Visualizations: ['@UI.LineItem']
}});

annotate service.VAnalytics with @(UI: {PresentationVariant #Engagement: {
    $Type         : 'UI.PresentationVariantType',
    ID            : 'Engagement',
    Text          : 'Engagement',
    GroupBy       : [engagementName],
    Total         : [
        bookingHour,
        nonApprovedHour
    ],
    Visualizations: ['@UI.LineItem']
}});

annotate service.VAnalytics with @(UI: {PresentationVariant #NoGroup: {
    $Type         : 'UI.PresentationVariantType',
    ID            : 'NoGroup',
    Text          : 'NoGroup',
    Total         : [
        bookingHour,
        nonApprovedHour
    ],
    Visualizations: ['@UI.LineItem']
}});