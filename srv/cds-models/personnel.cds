using {
    AdminService,
    CatalogService,
    EmployeeProfileService,
    AnalyticsService
} from '../data-provider';

using {
    Departments as DBDepartments,
    Employees   as DBEmployees
} from '../../db/cds-models/personnel';

// -------------------------------------------------------------------------
// Catalog Service (Read-only employee directory for all authenticated users)
// -------------------------------------------------------------------------
extend service CatalogService with {
    @readonly
    @cds.search: {fullName, email, employeeNumber}
    @restrict: [{ grant: 'READ', to: 'authenticated-user' }]
    entity VEmployees  as
        select from DBEmployees {
            key ID,
                employeeNumber,
                firstName,
                lastName,
                firstName || ' ' || lastName as fullName : String(161),
                email,
                departmentID,
                toDepartment.name            as departmentName : String(120),
                managerID,
                toManager.firstName || ' ' || toManager.lastName as managerName : String(161),
                jobTitle,
                jobFamily,
                location,
                isActive
        };
}

// -------------------------------------------------------------------------
// Admin Service (Full CRUD on personnel — HRAdmin only for writes)
// -------------------------------------------------------------------------
extend service AdminService with {
    @restrict: [{ grant: '*', to: 'HRAdmin' }, { grant: 'READ', to: ['SkillsAdmin', 'Auditor'] }]
    entity Departments as projection on DBDepartments;

    @cds.redirection.target: true
    @restrict: [{ grant: '*', to: 'HRAdmin' }, { grant: 'READ', to: ['SkillsAdmin', 'Auditor'] }]
    entity Employees   as projection on DBEmployees;

    @readonly
    @cds.search: {fullName, email, employeeNumber}
    entity VEmployees  as
        select from DBEmployees {
            key ID,
                employeeNumber,
                firstName,
                lastName,
                firstName || ' ' || lastName as fullName : String(161),
                email,
                departmentID,
                toDepartment.name            as departmentName : String(120),
                managerID,
                toManager.firstName || ' ' || toManager.lastName as managerName : String(161),
                jobTitle,
                jobFamily,
                location,
                isActive
        };
}

// -------------------------------------------------------------------------
// Employee Profile Service (Read own info)
// -------------------------------------------------------------------------
extend service EmployeeProfileService with {
    @readonly
    @cds.redirection.target: true
    entity Employees as projection on DBEmployees;
}

// -------------------------------------------------------------------------
// Analytics Service (Manager reads team, Admin/Auditor reads all)
// -------------------------------------------------------------------------
extend service AnalyticsService with {
    @readonly
    entity VEmployees as
        select from DBEmployees {
            key ID,
                employeeNumber,
                firstName,
                lastName,
                firstName || ' ' || lastName as fullName : String(161),
                email,
                departmentID,
                toDepartment.name            as departmentName : String(120),
                managerID,
                toManager.firstName || ' ' || toManager.lastName as managerName : String(161),
                jobTitle,
                isActive
        };

    @readonly
    entity VDepartments as
        select from DBDepartments {
            key ID,
                name,
                costCenter
        };
}
