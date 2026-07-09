using TechTeamReporting as service from '../../../../srv/cds-models/teams';

annotate service.VTeams with @Capabilities.FilterRestrictions: {NonFilterableProperties: [headOfTeamName]};