declare module "ui5/antares/ui/ValidationLogicCL" {
    import BaseObject from "sap/ui/base/Object";
    import { IValidationSettings, ValidatorValueParameter } from "ui5/antares/types/ui/validation";
    import { PropertyType } from "ui5/antares/types/entity/type";
    /**
     * @namespace ui5.antares.ui
     */
    export default class ValidationLogicCL extends BaseObject {
        private propertyName;
        private validator?;
        private listener?;
        private value1?;
        private value2?;
        private message;
        private operator;
        private showMessageBox;
        private invalidValueMessage;
        private readonly stringMethods;
        private readonly numberTypes;
        constructor(settings: IValidationSettings);
        getPropertyName(): string;
        getValidationMessage(): string;
        getValidatorMethod(): ((value: ValidatorValueParameter) => boolean) | undefined;
        validate(value: ValidatorValueParameter, type: PropertyType | "UNKNOWN"): boolean;
        private valueControl;
        private valueCorrection;
        private numberCorrection;
        private numberPropertyCorrection;
        private numberValue1Correction;
        private numberValue2Correction;
        private dateCorrection;
        private datePropertyCorrection;
        private dateValue1Correction;
        private dateValue2Correction;
        private showErrorMessageBox;
    }
}
