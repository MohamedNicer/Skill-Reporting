using TechTeamReporting as service from '../../../../srv/cds-models/visibility';

annotate service.VApplicationVisibilities with {
    ID                 @Common.FieldControl: #ReadOnly;
    uiElement          @Common.FieldControl: #ReadOnly;
    adminCanSee        @Common.FieldControl: #ReadOnly;
    @UI.Hidden: true
    visibilityEditible @Common.FieldControl: #ReadOnly;
    managerCanSee      @Common.FieldControl: visibilityEditible;
    userCanSee         @Common.FieldControl: visibilityEditible;
    noneCanSee         @Common.FieldControl: visibilityEditible;
    group              @Common.FieldControl: #ReadOnly;
};

annotate service.ApplicationVisibilities with {
    uiElement @Common.FieldControl: #Mandatory;
};

annotate service.ApplicationElements with {
    ID          @Common.FieldControl: #ReadOnly;
    type        @Common.FieldControl: #ReadOnly;
    description @Common.FieldControl: #ReadOnly;
    group       @Common.FieldControl: #ReadOnly;
};

annotate service.VApplicationVisibilities with @Capabilities.FilterRestrictions: {FilterExpressionRestrictions: [
    {
        $Type             : 'Capabilities.FilterExpressionRestrictionType',
        Property          : adminCanSee,
        AllowedExpressions: 'SingleValue'
    },
    {
        $Type             : 'Capabilities.FilterExpressionRestrictionType',
        Property          : managerCanSee,
        AllowedExpressions: 'SingleValue'
    },
    {
        $Type             : 'Capabilities.FilterExpressionRestrictionType',
        Property          : userCanSee,
        AllowedExpressions: 'SingleValue'
    },
    {
        $Type             : 'Capabilities.FilterExpressionRestrictionType',
        Property          : noneCanSee,
        AllowedExpressions: 'SingleValue'
    }
]};

annotate service.VBackendAuthorizations with {
    ID               @Common.FieldControl: #ReadOnly;
    group            @Common.FieldControl: #ReadOnly;
    resourceName     @Common.FieldControl: #ReadOnly;
    isCreatable      @Common.FieldControl: #ReadOnly;
    isUpdatable      @Common.FieldControl: #ReadOnly;
    isDeletable      @Common.FieldControl: #ReadOnly;
    isReadable       @Common.FieldControl: #ReadOnly;
    adminCanCreate   @Common.FieldControl: #ReadOnly;
    managerCanCreate @Common.FieldControl: createEditible;
    userCanCreate    @Common.FieldControl: createEditible;
    noneCanCreate    @Common.FieldControl: createEditible;
    adminCanUpdate   @Common.FieldControl: #ReadOnly;
    managerCanUpdate @Common.FieldControl: updateEditible;
    userCanUpdate    @Common.FieldControl: updateEditible;
    noneCanUpdate    @Common.FieldControl: updateEditible;
    adminCanDelete   @Common.FieldControl: #ReadOnly;
    managerCanDelete @Common.FieldControl: deleteEditible;
    userCanDelete    @Common.FieldControl: deleteEditible;
    noneCanDelete    @Common.FieldControl: deleteEditible;
    adminCanRead     @Common.FieldControl: #ReadOnly;
    managerCanRead   @Common.FieldControl: readEditible;
    userCanRead      @Common.FieldControl: readEditible;
    noneCanRead      @Common.FieldControl: readEditible;
    @UI.Hidden: true
    createEditible   @Common.FieldControl: #ReadOnly;
    @UI.Hidden: true
    updateEditible   @Common.FieldControl: #ReadOnly;
    @UI.Hidden: true
    deleteEditible   @Common.FieldControl: #ReadOnly;
    @UI.Hidden: true
    readEditible     @Common.FieldControl: #ReadOnly;
};

annotate service.BackendAuthorizations with {
    resourceName @Common.FieldControl: #Mandatory;
};