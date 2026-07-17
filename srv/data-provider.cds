using from './cds-models/value-help-list';
using from './cds-models/personnel';
using from './cds-models/skills';
using from './cds-models/documents';
using from './cds-models/common';


service CatalogService {}

service EmployeeProfileService {}

service CVService {}

service AdminService {}

service AnalyticsService {}

service IntegrationService {}

@path: '/api/dashboard'
service DashboardService {
    function kpi() returns {
        employees      : Integer;
        skills         : Integer;
        employeeSkills : Integer;
        pendingRequests: Integer;
    };

    type TopSkill {
        skillName : String;
        imageUrl : String;
        count : Integer;
    }

    function topSkills() returns array of TopSkill;

    type CategoryCount {
        categoryName : String;
        count : Integer;
    }

    function skillsByCategory() returns array of CategoryCount;

    type RequestStatusCount {
        status : String;
        count : Integer;
    }

    function requestsStatus() returns array of RequestStatusCount;
}
