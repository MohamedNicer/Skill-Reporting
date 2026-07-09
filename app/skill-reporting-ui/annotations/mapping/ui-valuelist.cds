using TechTeamReporting as service from '../../../../srv/cds-models/mappings';
using from '../../../../srv/cds-models/value-help-list';

annotate service.TemplateMappingHeaders with {
    templateType @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHTemplateTypes',
        SearchSupported,
        Parameters    : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: templateType,
            ValueListProperty: 'type'
        }]
    }};
};