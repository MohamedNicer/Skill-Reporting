using EmployeeSkillsCV from '../data-provider';
using AuditEvents as DBAuditEvents from '../../db/cds-models/common';

extend service EmployeeSkillsCV with {
    @readonly
    entity AuditEvents as projection on DBAuditEvents;
};
