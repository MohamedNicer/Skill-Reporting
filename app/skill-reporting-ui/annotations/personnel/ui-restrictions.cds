using TechTeamReporting as service from '../../../../srv/cds-models/personnel';

@UI.PresentationVariant.RequestAtLeast: [
    ID,
    firstName,
    lastName,
    country,
    workHours,
    teamID,
    isActive,
    email,
    userRole,
    sfUser,
    isDedicated,
    cost,
    targetUtilization,
    fullTimeEquivalent,
    position,
    level,
    createdAt,
    createdBy,
    modifiedAt,
    modifiedBy
]
annotate service.VPersonnel with @Capabilities.FilterRestrictions: {
    NonFilterableProperties     : [
        headOfTeam,
        isActiveCriticality,
        isDedicatedCriticality,
        toTeam.ID,
        toTeam.headOfTeam,
        toTeam.name
    ],
    FilterExpressionRestrictions: [
        {
            $Type             : 'Capabilities.FilterExpressionRestrictionType',
            Property          : isActive,
            AllowedExpressions: 'SingleValue'
        },
        {
            $Type             : 'Capabilities.FilterExpressionRestrictionType',
            Property          : isDedicated,
            AllowedExpressions: 'SingleValue'
        }
    ]
};
