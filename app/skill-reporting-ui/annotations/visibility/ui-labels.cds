using TechTeamReporting as service from '../../../../srv/cds-models/visibility';

annotate service.ApplicationVisibilities with {
    ID            @Common.Label: '{i18n>visibilityID}';
    group         @Common.Label: '{i18n>group}';
    uiElement     @Common.Label: '{i18n>uiElement}';
    adminCanSee   @Common.Label: '{i18n>visibilityAdminRole}';
    managerCanSee @Common.Label: '{i18n>visibilityManagerRole}';
    userCanSee    @Common.Label: '{i18n>visibilityUserRole}';
    noneCanSee    @Common.Label: '{i18n>visibilityNoRole}';
};

annotate service.VApplicationVisibilities with {
    ID            @Common.Label: '{i18n>visibilityID}';
    group         @Common.Label: '{i18n>group}';
    uiElement     @Common.Label: '{i18n>uiElement}';
    adminCanSee   @Common.Label: '{i18n>visibilityAdminRole}';
    managerCanSee @Common.Label: '{i18n>visibilityManagerRole}';
    userCanSee    @Common.Label: '{i18n>visibilityUserRole}';
    noneCanSee    @Common.Label: '{i18n>visibilityNoRole}';
};

annotate service.ApplicationElements with {
    ID          @Common.Label: '{i18n>elementID}';
    group       @Common.Label: '{i18n>groupID}';
    type        @Common.Label: '{i18n>elementType}';
    description @Common.Label: '{i18n>description}';
};

annotate service.BackendAuthorizations with {
    ID               @Common.Label: '{i18n>authorizationID}';
    group            @Common.Label: '{i18n>group}';
    resourceName     @Common.Label: '{i18n>resourceName}';
    adminCanCreate   @Common.Label: '{i18n>adminCanCreate}';
    adminCanUpdate   @Common.Label: '{i18n>adminCanUpdate}';
    adminCanDelete   @Common.Label: '{i18n>adminCanDelete}';
    adminCanRead     @Common.Label: '{i18n>adminCanRead}';
    managerCanCreate @Common.Label: '{i18n>managerCanCreate}';
    managerCanUpdate @Common.Label: '{i18n>managerCanUpdate}';
    managerCanDelete @Common.Label: '{i18n>managerCanDelete}';
    managerCanRead   @Common.Label: '{i18n>managerCanRead}';
    userCanCreate    @Common.Label: '{i18n>userCanCreate}';
    userCanUpdate    @Common.Label: '{i18n>userCanUpdate}';
    userCanDelete    @Common.Label: '{i18n>userCanDelete}';
    userCanRead      @Common.Label: '{i18n>userCanRead}';
    noneCanCreate    @Common.Label: '{i18n>noneCanCreate}';
    noneCanUpdate    @Common.Label: '{i18n>noneCanUpdate}';
    noneCanDelete    @Common.Label: '{i18n>noneCanDelete}';
    noneCanRead      @Common.Label: '{i18n>noneCanRead}';
    isCreatable      @Common.Label: '{i18n>isCreatable}';
    isUpdatable      @Common.Label: '{i18n>isUpdatable}';
    isDeletable      @Common.Label: '{i18n>isDeletable}';
    isReadable       @Common.Label: '{i18n>isReadable}';
};

annotate service.VBackendAuthorizations with {
    ID               @Common.Label: '{i18n>authorizationID}';
    group            @Common.Label: '{i18n>group}';
    resourceName     @Common.Label: '{i18n>resourceName}';
    adminCanCreate   @Common.Label: '{i18n>adminCanCreate}';
    adminCanUpdate   @Common.Label: '{i18n>adminCanUpdate}';
    adminCanDelete   @Common.Label: '{i18n>adminCanDelete}';
    adminCanRead     @Common.Label: '{i18n>adminCanRead}';
    managerCanCreate @Common.Label: '{i18n>managerCanCreate}';
    managerCanUpdate @Common.Label: '{i18n>managerCanUpdate}';
    managerCanDelete @Common.Label: '{i18n>managerCanDelete}';
    managerCanRead   @Common.Label: '{i18n>managerCanRead}';
    userCanCreate    @Common.Label: '{i18n>userCanCreate}';
    userCanUpdate    @Common.Label: '{i18n>userCanUpdate}';
    userCanDelete    @Common.Label: '{i18n>userCanDelete}';
    userCanRead      @Common.Label: '{i18n>userCanRead}';
    noneCanCreate    @Common.Label: '{i18n>noneCanCreate}';
    noneCanUpdate    @Common.Label: '{i18n>noneCanUpdate}';
    noneCanDelete    @Common.Label: '{i18n>noneCanDelete}';
    noneCanRead      @Common.Label: '{i18n>noneCanRead}';
    isCreatable      @Common.Label: '{i18n>isCreatable}';
    isUpdatable      @Common.Label: '{i18n>isUpdatable}';
    isDeletable      @Common.Label: '{i18n>isDeletable}';
    isReadable       @Common.Label: '{i18n>isReadable}';
};

annotate service.ApplicationResources with {
    group        @Common.Label: '{i18n>group}';
    resourceName @Common.Label: '{i18n>resourceName}';
    description  @Common.Label: '{i18n>resourceDescription}';
    type         @Common.Label: '{i18n>resourceType}';
    isCreatable  @Common.Label: '{i18n>isCreatable}';
    isUpdatable  @Common.Label: '{i18n>isUpdatable}';
    isDeletable  @Common.Label: '{i18n>isDeletable}';
    isReadable   @Common.Label: '{i18n>isReadable}';
};

annotate service.ElementDependencies with {
    ID          @Common.Label: '{i18n>elementID}';
    dependency  @Common.Label: '{i18n>resourceName}';
    createAuth  @Common.Label: '{i18n>isCreateRequired}';
    updateAuth  @Common.Label: '{i18n>isUpdateRequired}';
    deleteAuth  @Common.Label: '{i18n>isDeleteRequired}';
    readAuth    @Common.Label: '{i18n>isReadRequired}';
    description @Common.Label: '{i18n>description}';
};