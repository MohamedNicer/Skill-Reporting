using TechTeamReporting as service from '../../../../srv/cds-models/timesheet-check';
using from './ui-lineitems';

annotate service.VTimesheetCheck with @(sap.semantics: 'aggregate') {
    teamName      @sap.aggregation.role: 'dimension';
    fullName      @sap.aggregation.role: 'dimension';
    emailAddress  @sap.aggregation.role: 'dimension';
    expectedHours @sap.aggregation.role: 'measure';
    actualHours   @sap.aggregation.role: 'measure';
    missingHours  @sap.aggregation.role: 'measure';
};

annotate service.VTimesheetCheck with @(UI: {PresentationVariant #Default: {
    $Type         : 'UI.PresentationVariantType',
    ID            : 'Default',
    Text          : 'Default',
    Total         : [
        expectedHours,
        actualHours,
        missingHours
    ],
    Visualizations: ['@UI.LineItem'],
    GroupBy       : [
        teamName,
        fullName
    ]
}});
