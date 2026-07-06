using {managed} from '@sap/cds/common';

entity Departments : managed {
    key ID          : String(40);
        name        : String(120) not null;
        costCenter  : String(40);
        toEmployees : Association to many Employees
                          on toEmployees.departmentID = $self.ID;
};

@assert.unique: {employeeNumber: [employeeNumber], email: [email]}
entity Employees : managed {
    key ID              : String(255);
        employeeNumber  : String(40);
        firstName       : String(80) not null;
        lastName        : String(80) not null;
        email           : String(255) @Communication.IsEmailAddress;
        departmentID    : Departments:ID;
        managerID       : Employees:ID;
        jobTitle        : String(120);
        jobFamily       : String(120);
        location        : String(120);
        isActive        : Boolean default true;
        toDepartment    : Association to one Departments
                              on toDepartment.ID = $self.departmentID;
        toManager       : Association to one Employees
                              on toManager.ID = $self.managerID;
        toDirectReports : Association to many Employees
                              on toDirectReports.managerID = $self.ID;
};
