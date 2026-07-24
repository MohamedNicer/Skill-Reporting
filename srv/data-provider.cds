using from './cds-models/value-help-list';
using from './cds-models/personnel';
using from './cds-models/skills';
using from './cds-models/documents';
using from './cds-models/common';


@requires: 'authenticated-user'
service CatalogService {}

@requires: 'authenticated-user'
service EmployeeProfileService {}

@requires: 'authenticated-user'
service CVService {}

@requires: ['HRAdmin', 'SkillsAdmin', 'Auditor']
service AdminService {}

@requires: ['Manager', 'HRAdmin', 'SkillsAdmin', 'Auditor']
service AnalyticsService {}

@requires: 'system-user'
service IntegrationService {}

@requires: 'authenticated-user'
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

    type UserRole {
        id        : String;
        Employee  : Boolean;
        Manager   : Boolean;
        HRAdmin   : Boolean;
        SkillsAdmin : Boolean;
        Auditor   : Boolean;
    }

    function userInfo() returns UserRole;
}
