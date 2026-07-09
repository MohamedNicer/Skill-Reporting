using TechTeamReporting as service from '../../../../srv/cds-models/personnel';

annotate service.VPersonnel with {
    ID                     @Common.Label: '{i18n>personnelID}';
    firstName              @Common.Label: '{i18n>firstName}';
    lastName               @Common.Label: '{i18n>lastName}';
    country                @Common.Label: '{i18n>country}';
    teamID                 @Common.Label: '{i18n>teamID}';
    workHours              @Common.Label: '{i18n>workHours}';
    headOfTeam             @Common.Label: '{i18n>headOfTeam}';
    isActive               @Common.Label: '{i18n>isActive}';
    email                  @Common.Label: '{i18n>email}';
    userRole               @Common.Label: '{i18n>userRole}';
    sfUser                 @Common.Label: '{i18n>sfUser}';
    isDedicated            @Common.Label: '{i18n>isDedicated}';
    cost                   @Common.Label: '{i18n>cost}';
    targetUtilization      @Common.Label: '{i18n>targetUtilization}';
    fullTimeEquivalent     @Common.Label: '{i18n>fte}';
    position               @Common.Label: '{i18n>position}';
    level                  @Common.Label: '{i18n>employeeLevel}';
    isActiveCriticality    @Common.Label: '{i18n>isActiveCriticality}';
    isDedicatedCriticality @Common.Label: '{i18n>isDedicatedCriticality}';
};

annotate service.Personnel with {
    ID                 @Common.Label: '{i18n>personnelID}';
    firstName          @Common.Label: '{i18n>firstName}';
    lastName           @Common.Label: '{i18n>lastName}';
    country            @Common.Label: '{i18n>country}';
    teamID             @Common.Label: '{i18n>teamID}';
    workHours          @Common.Label: '{i18n>workHours}';
    isActive           @Common.Label: '{i18n>isActive}';
    email              @Common.Label: '{i18n>email}';
    userRole           @Common.Label: '{i18n>userRole}';
    sfUser             @Common.Label: '{i18n>sfUser}';
    isDedicated        @Common.Label: '{i18n>isDedicated}';
    cost               @Common.Label: '{i18n>cost}';
    targetUtilization  @Common.Label: '{i18n>targetUtilization}';
    fullTimeEquivalent @Common.Label: '{i18n>fte}';
    position           @Common.Label: '{i18n>position}';
    level              @Common.Label: '{i18n>employeeLevel}';
};

annotate service.PersonnelUsers with {
    personnelID   @Common.Label: '{i18n>personnelID}';
    userID        @Common.Label: '{i18n>userID}';
    isDefaultUser @Common.Label: '{i18n>isDefaultUser}';
    country       @Common.Label: '{i18n>country}';
};
