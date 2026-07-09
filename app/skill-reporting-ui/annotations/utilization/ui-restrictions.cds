using TechTeamReporting as service from '../../../../srv/cds-models/utilization';

annotate service.VUtilizationReport with @Capabilities: {FilterRestrictions: {
    $Type             : 'Capabilities.FilterRestrictionsType',
    RequiresFilter    : true,
    RequiredProperties: [approvalStatus]
}};

annotate service.VUtilizationTable with @Capabilities: {FilterRestrictions: {
    $Type             : 'Capabilities.FilterRestrictionsType',
    RequiresFilter    : true,
    RequiredProperties: [approvalStatus]
}};
