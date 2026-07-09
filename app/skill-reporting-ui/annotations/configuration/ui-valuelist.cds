using TechTeamReporting as service from '../../../../srv/cds-models/configurations';
using from '../../../../srv/cds-models/value-help-list';

annotate service.TimesheetTemplates with {
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

annotate service.EngagementStates with {
    objectStatus @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHObjectStatuses',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: objectStatus,
                ValueListProperty: 'status'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'description'
            }
        ]
    }};
};

annotate service.Countries with {
    timezone @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHTimezones',
        SearchSupported,
        Parameters    : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: timezone,
            ValueListProperty: 'timezone'
        }]
    }};
};