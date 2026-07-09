using TechTeamReporting as service from '../../../../srv/cds-models/visibility';
using from '../../../../srv/cds-models/value-help-list';

annotate service.ApplicationVisibilities with {
    uiElement @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHApplicationElements',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: uiElement,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'type'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'description'
            },
            {
                $Type            : 'Common.ValueListParameterOut',
                LocalDataProperty: group,
                ValueListProperty: 'group'
            }
        ]
    }};
    group     @Common: {ValueList: {
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

annotate service.VApplicationVisibilities with {
    uiElement @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'ApplicationElements',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: uiElement,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'type'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'description'
            },
            {
                $Type            : 'Common.ValueListParameterOut',
                LocalDataProperty: group,
                ValueListProperty: 'group'
            }
        ]
    }};
    group     @Common: {ValueList: {
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

annotate service.ApplicationElements with {
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

annotate service.BackendAuthorizations with {
    resourceName @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHApplicationResources',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: resourceName,
                ValueListProperty: 'resourceName'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'type'
            },
            {
                $Type            : 'Common.ValueListParameterOut',
                LocalDataProperty: group,
                ValueListProperty: 'group'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'description'
            },
            {
                $Type            : 'Common.ValueListParameterOut',
                LocalDataProperty: isCreatable,
                ValueListProperty: 'isCreatable'
            },
            {
                $Type            : 'Common.ValueListParameterOut',
                LocalDataProperty: isUpdatable,
                ValueListProperty: 'isUpdatable'
            },
            {
                $Type            : 'Common.ValueListParameterOut',
                LocalDataProperty: isDeletable,
                ValueListProperty: 'isDeletable'
            },
            {
                $Type            : 'Common.ValueListParameterOut',
                LocalDataProperty: isReadable,
                ValueListProperty: 'isReadable'
            }
        ]
    }};
    group        @Common: {ValueList: {
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

annotate service.VBackendAuthorizations with {
    resourceName @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'ApplicationResources',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: resourceName,
                ValueListProperty: 'resourceName'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'type'
            },
            {
                $Type            : 'Common.ValueListParameterOut',
                LocalDataProperty: group,
                ValueListProperty: 'group'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'description'
            }
        ]
    }};
    group        @Common: {ValueList: {
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