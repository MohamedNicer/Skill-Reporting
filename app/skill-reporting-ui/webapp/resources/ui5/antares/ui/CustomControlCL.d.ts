declare module "ui5/antares/ui/CustomControlCL" {
    import BaseObject from "sap/ui/base/Object";
    import Control from "sap/ui/core/Control";
    import ValidationLogicCL from "ui5/antares/ui/ValidationLogicCL";
    /**
     * @namespace ui5.antares.ui
     */
    export default class CustomControlCL extends BaseObject {
        private control;
        private propertyName;
        private validator?;
        constructor(control: Control, propertyName: string, validator?: ValidationLogicCL);
        getControl(): Control;
        getPropertyName(): string;
        getValidator(): ValidationLogicCL | undefined;
    }
}
