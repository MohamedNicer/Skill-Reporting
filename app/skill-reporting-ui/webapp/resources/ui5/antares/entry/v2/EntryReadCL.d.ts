declare module "ui5/antares/entry/v2/EntryReadCL" {
    import UIComponent from "sap/ui/core/UIComponent";
    import Controller from "sap/ui/core/mvc/Controller";
    import EntryCL from "ui5/antares/entry/v2/EntryCL";
    import { IReadSettings } from "ui5/antares/types/entry/read";
    /**
     * @namespace ui5.antares.entry.v2
     */
    export default class EntryReadCL<EntityT extends object = object, EntityKeysT extends object = object> extends EntryCL<EntityT, EntityKeysT> {
        private settings;
        constructor(controller: Controller | UIComponent, settings: IReadSettings<EntityKeysT>, modelName?: string);
        readEntry(): Promise<void>;
        private createDialog;
        private onEntryCanceled;
        private onEscapePressed;
        private loadDialog;
        private createObjectPage;
    }
}
