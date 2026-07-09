declare module "ui5/antares/odata/v2/ODataCL" {
    import Controller from "sap/ui/core/mvc/Controller";
    import { ODataMethods } from "ui5/antares/types/odata/enums";
    import ModelCL from "ui5/antares/base/v2/ModelCL";
    import UIComponent from "sap/ui/core/UIComponent";
    /**
     * @namespace ui5.antares.odata.v2
     */
    export default abstract class ODataCL extends ModelCL {
        private entityPath;
        private entityName;
        private method;
        constructor(controller: Controller | UIComponent, entityPath: string, method: ODataMethods, modelName?: string);
        abstract setUrlParameters(urlParameters: Record<string, string>): void;
        protected getEntityPath(): string;
        protected getEntityName(): string;
        protected checkData(data?: object): void;
    }
}
