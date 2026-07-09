using TechTeamReporting as service from '../../../../srv/cds-models/value-help-list';

annotate service.VHTeams with {
    ID @Common: {
        Text           : name,
        TextArrangement: #TextOnly
    };
};

annotate service.VHPersonnel with {
    ID @Common: {
        Text           : fullName,
        TextArrangement: #TextOnly
    };
};

annotate service.VHHeadOfTeams with {
    personnelID @Common: {
        Text           : fullName,
        TextArrangement: #TextOnly
    };
};

annotate service.VHEngagementTypes with {
    ID @Common: {
        Text           : type,
        TextArrangement: #TextOnly
    };
};

annotate service.VHEngagements with {
    ID @Common: {
        Text           : name,
        TextArrangement: #TextOnly
    };
};

annotate service.VHForecastEngagements with {
    ID @Common: {
        Text           : name,
        TextArrangement: #TextOnly
    };
};

annotate service.VHUserRoles with {
    role @Common: {
        Text           : description,
        TextArrangement: #TextOnly
    };
};

annotate service.VHEngagementStates with {
    state @Common: {
        Text           : description,
        TextArrangement: #TextOnly
    };
};

// annotate service.VHObjectStatuses with {
//     status @Common: {
//         Text           : description,
//         TextArrangement: #TextOnly
//     };
// };

annotate service.VHCountries with {
    code @Common: {
        Text           : name,
        TextArrangement: #TextOnly
    };
};

annotate service.VHEmployeeLevels with {
    ID @Common: {
        Text           : name,
        TextArrangement: #TextFirst
    };
};

annotate service.VHPositions with {
    ID @Common: {
        Text           : name,
        TextArrangement: #TextOnly
    };
};
