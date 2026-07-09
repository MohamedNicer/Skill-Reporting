using TechTeamReporting as service from '../../../../srv/data-provider';
using from '../../../../srv/cds-models/value-help-list';

annotate service.VOverview with {
    ID      @Common          : {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHEngagements',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: ID,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'name'
            }
        ]
    }};
    country @Common          : {ValueList: {
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
    teamID  @Common          : {ValueList: {
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
    }};
    state   @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHEngagementStates',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: state,
                ValueListProperty: 'state'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'description'
            }
        ]
    };
};