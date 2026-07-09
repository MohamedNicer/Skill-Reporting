using TechTeamReporting as service from '../../../../srv/cds-models/timesheet-check';
using from '../../../../srv/cds-models/value-help-list';

annotate service.VTimesheetCheck with {
    personnelID @Common          : {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHPersonnel',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: personnelID,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'fullName'
            }
        ]
    }};
    teamID      @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHTeams',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: teamID,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'name'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'headOfTeamName'
            }
        ]
    };
    country     @Common          : {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHCountries',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: country,
                ValueListProperty: 'code'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'name'
            }
        ]
    }};
};
