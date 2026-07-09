declare module "ui5/antares/types/ui/validation" {
    import Control from "sap/ui/core/Control";
    import UI5Date from "sap/ui/core/date/UI5Date";
    import { ValidationOperator } from "ui5/antares/types/ui/enums";
    type ValidatorValue = string | number | Date | UI5Date;
    type ValidatorValueParameter = ValidatorValue | Control;
    interface IValidationSettings {
        propertyName: string;
        validator?: (value: ValidatorValueParameter) => boolean;
        listener?: object;
        value1?: ValidatorValue;
        value2?: ValidatorValue;
        operator?: ValidationOperator;
        message?: string;
        showMessageBox?: boolean;
        invalidValueMessage?: string;
    }
    interface ICorrectedValues {
        originalValue: ValidatorValue;
        value1: ValidatorValue;
        value2?: ValidatorValue;
    }
}
