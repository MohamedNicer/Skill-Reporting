using TechTeamReporting as service from '../../../../srv/cds-models/app-logs';

annotate service.VTimesheetMailLogs with {
    sender    @Common: {
        Text           : toSenderVH.fullName,
        TextArrangement: #TextOnly
    };
    engagementID   @Common: {
        Text           : toEngagementVH.name,
        TextArrangement: #TextOnly
    };
};
