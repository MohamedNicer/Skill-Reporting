using TechTeamReporting as service from '../../../../srv/cds-models/engagements';
using from '../../../../srv/cds-models/value-help-list';

annotate service.VCustomerEngagements with {
    type                 @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHEngagementTypes',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: type,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'type'
            }
        ]
    };
    country              @Common.ValueList: {
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
    teamID               @Common.ValueList: {
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
    activityType         @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHActivityTypes',
        SearchSupported,
        Parameters    : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: activityType,
            ValueListProperty: 'activityType'
        }]
    };
    targetBillActType    @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHActivityTypes',
        SearchSupported,
        Parameters    : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: targetBillActType,
            ValueListProperty: 'activityType'
        }]
    };
    targetNonBillActType @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHActivityTypes',
        SearchSupported,
        Parameters    : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: targetNonBillActType,
            ValueListProperty: 'activityType'
        }]
    };
    templateType         @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHTimesheetTemplates',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: templateType,
                ValueListProperty: 'templateType'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'fileName'
            }
        ]
    };
    state                @Common.ValueList: {
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
    spoc                 @Common          : {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHPersonnel',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: spoc,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'fullName'
            }
        ]
    }};
};

annotate service.CustomerEngagements with {
    type                 @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHEngagementTypes',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: type,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'type'
            }
        ]
    };
    country              @Common.ValueList: {
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
    teamID               @Common.ValueList: {
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
    templateType         @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHTimesheetTemplates',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: templateType,
                ValueListProperty: 'templateType'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'fileName'
            }
        ]
    };
    state                @Common.ValueList: {
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
    spoc                 @Common          : {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHPersonnel',
        SearchSupported,
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: spoc,
                ValueListProperty: 'ID'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'fullName'
            }
        ]
    }};
    activityType         @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHActivityTypes',
        SearchSupported,
        Parameters    : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: activityType,
            ValueListProperty: 'activityType'
        }]
    };
    targetBillActType    @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHActivityTypes',
        SearchSupported,
        Parameters    : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: targetBillActType,
            ValueListProperty: 'activityType'
        }]
    };
    targetNonBillActType @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHActivityTypes',
        SearchSupported,
        Parameters    : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: targetNonBillActType,
            ValueListProperty: 'activityType'
        }]
    };
};

annotate service.TimesheetRecipients with {
    type @Common: {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHEmailTypes',
            SearchSupported,
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: type,
                ValueListProperty: 'type'
            }]
        }
    };
};

annotate service.EngagementPersonnelRates with {
    personnelID  @Common: {ValueList: {
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
};

annotate service.EngagementRates with {
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
};

annotate service.EngagementActivityTypes with {
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
    isBillable  @Common: {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHYesNo',
            SearchSupported,
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: isBillable,
                ValueListProperty: 'answer'
            }]
        }
    };
};

annotate service.EngagementPurchaseOrder with {
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
};
