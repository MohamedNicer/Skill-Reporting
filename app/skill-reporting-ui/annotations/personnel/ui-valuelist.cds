using TechTeamReporting as service from '../../../../srv/cds-models/personnel';
using from '../../../../srv/cds-models/value-help-list';

annotate service.VPersonnel {
    ID       @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHPersonnel',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: ID,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'fullName'
            }
        ]
    };
    country  @Common.ValueList: {
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
    };
    teamID   @Common.ValueList: {
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
    position @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHPositions',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: position,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'name'
            }
        ]
    };
    level    @Common          : {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHEmployeeLevels',
            SearchSupported,
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: level,
                    ValueListProperty: 'ID'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                }
            ]
        }
    };
};

annotate service.Personnel {
    country  @Common.ValueList: {
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
    };
    teamID   @Common.ValueList: {
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
    userRole @Common          : {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHUserRoles',
            SearchSupported,
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: userRole,
                    ValueListProperty: 'role'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'description'
                }
            ]
        }
    };
    position @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHPositions',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: position,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'name'
            }
        ]
    };
    level    @Common          : {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHEmployeeLevels',
            SearchSupported,
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: level,
                    ValueListProperty: 'ID'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                }
            ]
        }
    };
};

annotate service.PersonnelUsers {
    country @Common.ValueList: {
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
    };
};
