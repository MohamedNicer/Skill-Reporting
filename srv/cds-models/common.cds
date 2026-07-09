using { AdminService } from '../data-provider';
using AuditEvents as DBAuditEvents from '../../db/cds-models/common';

extend service AdminService with {
    @readonly
    entity AuditEvents as projection on DBAuditEvents;
};
