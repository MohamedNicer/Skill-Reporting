using TechTeamReporting as service from '../../../../srv/cds-models/value-help-list';

annotate service.VHEmailTypes with @Capabilities.FilterRestrictions: {FilterExpressionRestrictions: [{
    $Type             : 'Capabilities.FilterExpressionRestrictionType',
    AllowedExpressions: 'SingleValue',
    Property          : type
}]};

annotate service.VHApplicationElements with {
    ID          @Common.FieldControl: #ReadOnly;
    type        @Common.FieldControl: #ReadOnly;
    description @Common.FieldControl: #ReadOnly;
    group       @Common.FieldControl: #ReadOnly;
};
