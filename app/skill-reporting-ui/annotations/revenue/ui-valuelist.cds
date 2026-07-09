using TechTeamReporting as service from '../../../../srv/cds-models/revenue';
using from '../../../../srv/cds-models/value-help-list';

annotate service.VBookingRevenue with {
    personnelID                @Common: {ValueList: {
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
    teamID                     @Common: {ValueList: {
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
    engagementID               @Common: {ValueList: {
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
    revenueCalculationStrategy @Common: {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHRevenueCalculationStrategy',
            SearchSupported,
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: revenueCalculationStrategy,
                ValueListProperty: 'strategy'
            }]
        }
    };
    billingStatus              @Common: {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHBillingStatus',
            SearchSupported,
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: billingStatus,
                ValueListProperty: 'status'
            }]
        }
    };
    country                    @Common: {ValueList: {
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

annotate service.VForecastRevenue with {
    personnelID                @Common: {ValueList: {
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
    teamID                     @Common: {ValueList: {
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
    engagementID               @Common: {ValueList: {
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
    revenueCalculationStrategy @Common: {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHRevenueCalculationStrategy',
            SearchSupported,
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: revenueCalculationStrategy,
                ValueListProperty: 'strategy'
            }]
        }
    };
    billingStatus              @Common: {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHBillingStatus',
            SearchSupported,
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: billingStatus,
                ValueListProperty: 'status'
            }]
        }
    };
    country                    @Common: {ValueList: {
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

annotate service.VBookingRevenueTable with {
    personnelID                @Common: {ValueList: {
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
    teamID                     @Common: {ValueList: {
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
    engagementID               @Common: {ValueList: {
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
    revenueCalculationStrategy @Common: {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHRevenueCalculationStrategy',
            SearchSupported,
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: revenueCalculationStrategy,
                ValueListProperty: 'strategy'
            }]
        }
    };
    billingStatus              @Common: {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHBillingStatus',
            SearchSupported,
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: billingStatus,
                ValueListProperty: 'status'
            }]
        }
    };
    country                    @Common: {ValueList: {
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

annotate service.VForecastRevenueTable with {
    personnelID                @Common: {ValueList: {
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
    teamID                     @Common: {ValueList: {
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
    engagementID               @Common: {ValueList: {
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
    revenueCalculationStrategy @Common: {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHRevenueCalculationStrategy',
            SearchSupported,
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: revenueCalculationStrategy,
                ValueListProperty: 'strategy'
            }]
        }
    };
    billingStatus              @Common: {
        ValueListWithFixedValues,
        ValueList: {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'VHBillingStatus',
            SearchSupported,
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: billingStatus,
                ValueListProperty: 'status'
            }]
        }
    };
    country                    @Common: {ValueList: {
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
