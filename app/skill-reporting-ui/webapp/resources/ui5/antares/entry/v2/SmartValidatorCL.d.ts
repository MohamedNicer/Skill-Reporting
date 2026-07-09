declare module "ui5/antares/entry/v2/SmartValidatorCL" {
    import BaseObject from "sap/ui/base/Object";
    import GroupElement from "sap/ui/comp/smartform/GroupElement";
    import { IValueValidation } from "ui5/antares/types/entry/submit";
    import CustomControlCL from "ui5/antares/ui/CustomControlCL";
    import ValidationLogicCL from "ui5/antares/ui/ValidationLogicCL";
    /**
     * @namespace ui5.antares.entry.v2
     */
    export default class SmartValidatorCL extends BaseObject {
        private groupElements;
        private customControls;
        private validationLogics;
        private mandatoryErrorMessage;
        constructor(groupElements: GroupElement[], customControls: CustomControlCL[], validationLogics: ValidationLogicCL[], mandatoryErrorMessage: string);
        validate(): IValueValidation;
        private customControlValidation;
        private getCustomControl;
        private standardControlValidation;
        private getValidationLogic;
    }
}
