using TechTeamReporting as service from '../../../../srv/cds-models/forecast';
using from '../../../../srv/cds-models/value-help-list';

annotate service.PersonnelForecasts with {
    engagementID @Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VHForecastEngagements',
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
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'teamName'
            }
        ]
    }};
};