using TechTeamReporting as service from '../../../../srv/cds-models/value-help-list';

annotate service.VHApplicationElements with {
    group @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHApplicationGroups',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: group,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'description'
            }
        ]
    }};
};

annotate service.VHApplicationResources with {
    group @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHApplicationGroups',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: group,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'description'
            }
        ]
    }};
};