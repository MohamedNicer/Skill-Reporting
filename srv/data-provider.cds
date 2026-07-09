using from './cds-models/value-help-list';
using from './cds-models/personnel';
using from './cds-models/skills';
using from './cds-models/documents';
using from './cds-models/common';


@(requires: 'authenticated-user')
service CatalogService {}

@(requires: 'authenticated-user')
service EmployeeProfileService {}

@(requires: 'authenticated-user')
service CVService {}

@(requires: 'authenticated-user')
service AdminService {}

@(requires: 'authenticated-user')
service AnalyticsService {}

@(requires: 'authenticated-user')
service IntegrationService {}
