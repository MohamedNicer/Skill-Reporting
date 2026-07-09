using TechTeamReporting as service from '../../../../srv/cds-models/common';

annotate service.ApplicationAdmins with {
    personnelID @Common.Label: '{i18n>personnelID}';
    firstName   @Common.Label: '{i18n>firstName}';
    lastName    @Common.Label: '{i18n>lastName}';
    email       @Common.Label: '{i18n>email}';
};