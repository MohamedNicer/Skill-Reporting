using TechTeamReporting as service from '../../../../srv/cds-models/app-logs';
using from '../../../../srv/cds-models/value-help-list';

annotate service.VTimesheetMailLogs with {
    sender       @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHPersonnel',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: sender,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'fullName'
            }
        ]
    }};
    engagementID @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHEngagements',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: engagementID,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'name'
            }
        ]
    }};
    mailType     @Common: {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHTimesheetMailTypes',
            SearchSupported,
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: mailType,
                ValueListProperty: 'type'
            }]
        }
    };
};
