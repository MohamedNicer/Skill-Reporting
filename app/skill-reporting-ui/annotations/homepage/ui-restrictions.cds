using TechTeamReporting as service from '../../../../srv/data-provider';

annotate service.VOverview with @Capabilities.FilterRestrictions: {NonFilterableProperties: [logoURL]};