using TechTeamReporting as service from '../../../../srv/cds-models/engagements';

annotate service.CustomerEngagements with {
    ID                   @Common.Label: '{i18n>engagementID}';
    country              @Common.Label: '{i18n>country}';
    activityType         @Common.Label: '{i18n>activityType}';
    teamID               @Common.Label: '{i18n>teamID}';
    logoURL              @Common.Label: '{i18n>logoURL}';
    templateType         @Common.Label: '{i18n>templateType}';
    name                 @Common.Label: '{i18n>engagementName}';
    targetBillableWBS    @Common.Label: '{i18n>targetBillableWBS}';
    targetBillActType    @Common.Label: '{i18n>targetBillActType}';
    targetNonBillableWBS @Common.Label: '{i18n>targetNonBillableWBS}';
    targetNonBillActType @Common.Label: '{i18n>targetNonBillActType}';
    targetPOHeader       @Common.Label: '{i18n>targetPOHeader}';
    targetPOItem         @Common.Label: '{i18n>targetPOItem}';
    type                 @Common.Label: '{i18n>engagementType}';
    WBSPattern           @Common.Label: '{i18n>WBSPattern}';
    budget               @Common.Label: '{i18n>budget}';
    state                @Common.Label: '{i18n>state}';
    targetDummyUser      @Common.Label: '{i18n>targetDummyUser}';
    spoc                 @Common.Label: '{i18n>spoc}';
    note                 @Common.Label: '{i18n>note}';
    customerName         @Common.Label: '{i18n>customerName}';
    projectManager       @Common.Label: '{i18n>projectManager}';
};

annotate service.VCustomerEngagements with {
    ID                   @Common.Label: '{i18n>engagementID}';
    country              @Common.Label: '{i18n>country}';
    activityType         @Common.Label: '{i18n>activityType}';
    teamID               @Common.Label: '{i18n>teamID}';
    logoURL              @Common.Label: '{i18n>logoURL}';
    templateType         @Common.Label: '{i18n>templateType}';
    name                 @Common.Label: '{i18n>engagementName}';
    targetBillableWBS    @Common.Label: '{i18n>targetBillableWBS}';
    targetBillActType    @Common.Label: '{i18n>targetBillActType}';
    targetNonBillableWBS @Common.Label: '{i18n>targetNonBillableWBS}';
    targetNonBillActType @Common.Label: '{i18n>targetNonBillActType}';
    targetPOHeader       @Common.Label: '{i18n>targetPOHeader}';
    targetPOItem         @Common.Label: '{i18n>targetPOItem}';
    type                 @Common.Label: '{i18n>engagementType}';
    WBSPattern           @Common.Label: '{i18n>WBSPattern}';
    budget               @Common.Label: '{i18n>budget}';
    state                @Common.Label: '{i18n>state}';
    targetDummyUser      @Common.Label: '{i18n>targetDummyUser}';
    spoc                 @Common.Label: '{i18n>spoc}';
    note                 @Common.Label: '{i18n>note}';
    customerName         @Common.Label: '{i18n>customerName}';
    projectManager       @Common.Label: '{i18n>projectManager}';
};

annotate service.TimesheetRecipients with {
    engagementID @Common.Label: '{i18n>engagementID}';
    email        @Common.Label: '{i18n>email}';
    type         @Common.Label: '{i18n>emailType}';
};

annotate service.EngagementPersonnelRates with {
    engagementID @Common.Label: '{i18n>engagementID}';
    personnelID  @Common.Label: '{i18n>personnelID}';
    rate         @Common.Label: '{i18n>rate}';
    validFrom    @Common.Label: '{i18n>validFrom}';
    validTo      @Common.Label: '{i18n>validTo}';
    WBSPattern   @Common.Label: '{i18n>WBSPattern}';
    currentRate  @Common.Label: '{i18n>currentRate}';
    rateID       @Common.Label: '{i18n>rateID}';
};

annotate service.VEngagementPersonnelRates with {
    engagementID           @Common.Label: '{i18n>engagementID}';
    personnelID            @Common.Label: '{i18n>personnelID}';
    rate                   @Common.Label: '{i18n>rate}';
    validFrom              @Common.Label: '{i18n>validFrom}';
    validTo                @Common.Label: '{i18n>validTo}';
    WBSPattern             @Common.Label: '{i18n>WBSPattern}';
    currentRate            @Common.Label: '{i18n>currentRate}';
    rateID                 @Common.Label: '{i18n>rateID}';
    currentRateCriticality @Common.Label: '{i18n>currentRateCriticality}';

};

annotate service.EngagementRates with {
    engagementID @Common.Label: '{i18n>engagementID}';
    rate         @Common.Label: '{i18n>rate}';
    validFrom    @Common.Label: '{i18n>validFrom}';
    validTo      @Common.Label: '{i18n>validTo}';
    WBSPattern   @Common.Label: '{i18n>WBSPattern}';
    currentRate  @Common.Label: '{i18n>currentRate}';
    rateID       @Common.Label: '{i18n>rateID}';
};

annotate service.VEngagementRates with {
    engagementID           @Common.Label: '{i18n>engagementID}';
    rate                   @Common.Label: '{i18n>rate}';
    validFrom              @Common.Label: '{i18n>validFrom}';
    validTo                @Common.Label: '{i18n>validTo}';
    WBSPattern             @Common.Label: '{i18n>WBSPattern}';
    currentRate            @Common.Label: '{i18n>currentRate}';
    rateID                 @Common.Label: '{i18n>rateID}';
    currentRateCriticality @Common.Label: '{i18n>currentRateCriticality}';
};

annotate service.EngagementActivityTypes with {
    engagementID @Common.Label: '{i18n>engagementID}';
    personnelID  @Common.Label: '{i18n>personnelID}';
    isBillable   @Common.Label: '{i18n>isBillable}';
    activityType @Common.Label: '{i18n>activityType}';
};

annotate service.EngagementPurchaseOrder with {
    engagementID @Common.Label: '{i18n>engagementID}';
    personnelID  @Common.Label: '{i18n>personnelID}';
    poHeader     @Common.Label: '{i18n>poHeader}';
    poItem       @Common.Label: '{i18n>poItem}';
};

annotate service.ExcludedWBSElements with {
    engagementID @Common.Label: '{i18n>engagementID}';
    WBSElement   @Common.Label: '{i18n>WBSElement}';
    reason       @Common.Label: '{i18n>reason}';
};
