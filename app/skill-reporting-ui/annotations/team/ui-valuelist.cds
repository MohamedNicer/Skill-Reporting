using TechTeamReporting as service from '../../../../srv/cds-models/teams';
using from '../../../../srv/cds-models/value-help-list';

annotate service.VTeams with {
    ID         @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHTeams',
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
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'headOfTeamName'
            }
        ]
    }};
    headOfTeam @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHHeadOfTeams',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: headOfTeam,
                ValueListProperty: 'personnelID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'fullName'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'name'
            }
        ]
    }};
};

annotate service.Teams with {
    headOfTeam @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHPersonnel',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: headOfTeam,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'fullName'
            }
        ]
    }};
};

annotate service.TeamRates with {
    teamID @Common: {ValueList: {
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
            }
        ]
    }};
};

annotate service.ForecastAuthBypass with {
    personnelID @Common: {ValueList: {
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
}
