declare module "ui5/antares/odata/v2/ODataDeleteCL" {
    import UIComponent from "sap/ui/core/UIComponent";
    import Controller from "sap/ui/core/mvc/Controller";
    import ODataCL from "ui5/antares/odata/v2/ODataCL";
    import { IDeleteResponse } from "ui5/antares/types/common";
    /**
     * @namespace ui5.antares.odata.v2
     */
    export default class ODataDeleteCL<EntityKeysT extends object = object> extends ODataCL {
        private urlParameters?;
        private refreshAfterChange;
        private response?;
        constructor(controller: Controller | UIComponent, entityPath: string, modelName?: string);
        setUrlParameters(urlParameters: Record<string, string>): void;
        getUrlParameters(): Record<string, string> | undefined;
        setRefreshAfterChange(refreshAfterChange: boolean): void;
        getRefreshAfterChange(): boolean;
        getResponse(): IDeleteResponse | undefined;
        delete(keys: EntityKeysT): Promise<EntityKeysT>;
    }
}
