declare module "ui5/antares/odata/v2/ODataUpdateCL" {
    import UIComponent from "sap/ui/core/UIComponent";
    import Controller from "sap/ui/core/mvc/Controller";
    import ODataCL from "ui5/antares/odata/v2/ODataCL";
    import { IUpdateResponse } from "ui5/antares/types/common";
    /**
     * @namespace ui5.antares.odata.v2
     */
    export default class ODataUpdateCL<EntityT extends object = object, EntityKeysT extends object = object> extends ODataCL {
        private payload;
        private urlParameters?;
        private refreshAfterChange;
        private response?;
        constructor(controller: Controller | UIComponent, entityPath: string, modelName?: string);
        setData(data: EntityT): void;
        getData(): EntityT | undefined;
        setUrlParameters(urlParameters: Record<string, string>): void;
        getUrlParameters(): Record<string, string> | undefined;
        setRefreshAfterChange(refreshAfterChange: boolean): void;
        getRefreshAfterChange(): boolean;
        getResponse(): IUpdateResponse<EntityT> | undefined;
        update(keys: EntityKeysT): Promise<EntityT>;
    }
}
