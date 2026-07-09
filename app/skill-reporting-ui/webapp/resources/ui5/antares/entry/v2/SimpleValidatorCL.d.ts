declare module "ui5/antares/entry/v2/SimpleValidatorCL" {
    import BaseObject from "sap/ui/base/Object";
    import UI5Element from "sap/ui/core/Element";
    import { IValueValidation } from "ui5/antares/types/entry/submit";
    import CustomControlCL from "ui5/antares/ui/CustomControlCL";
    import ValidationLogicCL from "ui5/antares/ui/ValidationLogicCL";
    /**
     * @namespace ui5.antares.entry.v2
     */
    export default class SimpleValidatorCL extends BaseObject {
        private simpleFormElements;
        private customControls;
        private validationLogics;
        private mandatoryErrorMessage;
        constructor(simpleFormElements: UI5Element[], customControls: CustomControlCL[], validationLogics: ValidationLogicCL[], mandatoryErrorMessage: string);
        validate(): IValueValidation;
        private customControlValidation;
        private getCustomControl;
        private standardControlValidation;
        private inputValidation;
        private datePickerValidation;
        private dateTimePickerValidation;
        private getValidationLogic;
    }
}
