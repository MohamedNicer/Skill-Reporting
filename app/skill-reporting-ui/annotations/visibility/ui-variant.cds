using TechTeamReporting as service from '../../../../srv/cds-models/value-help-list';
using from './ui-lineitems';

annotate service.ApplicationElements with @(UI: {PresentationVariant: {
    $Type         : 'UI.PresentationVariantType',
    SortOrder     : [{
        $Type   : 'Common.SortOrderType',
        Property: group
    }],
    Visualizations: ['@UI.LineItem']
}});