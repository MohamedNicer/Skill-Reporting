declare module "ui5/antares/odata/v2/ODataCreateCL" {
    import Controller from "sap/ui/core/mvc/Controller";
    import ODataCL from "ui5/antares/odata/v2/ODataCL";
    import { ICreateResponse } from "ui5/antares/types/common";
    import Context from "sap/ui/model/Context";
    import UIComponent from "sap/ui/core/UIComponent";
    /**
     * @namespace ui5.antares.odata.v2
     */
    export default class ODataCreateCL<EntityT extends object = object> extends ODataCL {
        private payload?;
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
        getResponse(): ICreateResponse<EntityT> | undefined;
        createEntry(): Context;
        create(): Promise<EntityT>;
    }
}
