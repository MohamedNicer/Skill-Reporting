using {
    AdminService,
    EmployeeProfileService
} from '../data-provider';

using {
    Departments as DBDepartments,
    Employees   as DBEmployees
} from '../../db/cds-models/personnel';

// -------------------------------------------------------------------------
// Admin Service (Full CRUD on personnel)
// -------------------------------------------------------------------------
extend service AdminService with {
    entity Departments as projection on DBDepartments;

    @cds.redirection.target: true
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
