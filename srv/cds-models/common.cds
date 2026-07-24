using { AdminService } from '../data-provider';
using AuditEvents as DBAuditEvents from '../../db/cds-models/common';

extend service AdminService with {
    @readonly
    @restrict: [{ grant: 'READ', to: ['HRAdmin', 'SkillsAdmin', 'Auditor'] }]
    entity AuditEvents as projection on DBAuditEvents;
};
