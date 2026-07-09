declare module "ui5/antares/odata/v2/ODataReadCL" {
    import Controller from "sap/ui/core/mvc/Controller";
    import ODataCL from "ui5/antares/odata/v2/ODataCL";
    import { IReadResponse } from "ui5/antares/types/common";
    import Filter from "sap/ui/model/Filter";
    import Sorter from "sap/ui/model/Sorter";
    import UIComponent from "sap/ui/core/UIComponent";
    /**
     * @namespace ui5.antares.odata.v2
     */
    export default class ODataReadCL<EntityT extends object = object, EntityKeysT extends object = object> extends ODataCL {
        private filters;
        private sorters;
        private urlParameters?;
        private response?;
        constructor(controller: Controller | UIComponent, entityPath: string, modelName?: string);
        setFilters(filters: Filter[]): void;
        addFilter(filter: Filter): void;
        getFilters(): Filter[];
        setSorters(sorters: Sorter[]): void;
        addSorter(sorter: Sorter): void;
        getSorters(): Sorter[];
        setUrlParameters(urlParameters: Record<string, string>): void;
        getUrlParameters(): Record<string, string> | undefined;
        getResponse(): IReadResponse<EntityT> | undefined;
        read(): Promise<EntityT[]>;
        readByKey(keys: EntityKeysT): Promise<EntityT>;
    }
}
