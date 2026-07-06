using {Employees} from './personnel';

entity AuditEvents {
    key ID              : UUID;
        actorEmployeeID : Employees:ID;
        action          : String(80) not null;
        entityName      : String(120) not null;
        entityID        : UUID;
        correlationID   : String(120);
        occurredAt      : DateTime @cds.on.insert: $now;
        toActorEmployee : Association to one Employees
                              on toActorEmployee.ID = $self.actorEmployeeID;
};
