declare module "ui5/antares/ui/ContentCL" {
    import EntityCL from "ui5/antares/entity/v2/EntityCL";
    import SmartForm from "sap/ui/comp/smartform/SmartForm";
    import SimpleForm from "sap/ui/layout/form/SimpleForm";
    import EntryCL from "ui5/antares/entry/v2/EntryCL";
    import Controller from "sap/ui/core/mvc/Controller";
    import UIComponent from "sap/ui/core/UIComponent";
    import { ODataMethods } from "ui5/antares/types/odata/enums";
    /**
     * @namespace ui5.antares.ui
     */
    export default class ContentCL<EntryT extends EntryCL<EntityT>, EntityT extends object = object> extends EntityCL {
        private entry;
        private smartGroup;
        private method;
        private simpleFormElements;
        private readonly numberTypes;
        constructor(controller: Controller | UIComponent, entry: EntryT, method: ODataMethods, modelName?: string);
        getSmartForm(): Promise<SmartForm>;
        getSimpleForm(): Promise<SimpleForm>;
        private getSmartFormGroups;
        private getSimpleFormContent;
        private addDefaultGroupElements;
        private addKeyProperties;
        private addProperties;
        private addSmartField;
        private addSimpleFormField;
        private addCheckBox;
        private addDatePicker;
        private addDateTimePicker;
        private addInput;
        private addSmartCustomControl;
        private addSimpleCustomControl;
        addSmartSections(): Promise<void>;
        addSimpleSections(): Promise<void>;
        private createSmartForm;
        private createSimpleForm;
    }
}
