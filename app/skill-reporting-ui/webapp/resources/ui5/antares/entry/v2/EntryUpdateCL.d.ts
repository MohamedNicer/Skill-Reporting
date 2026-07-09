declare module "ui5/antares/entry/v2/EntryUpdateCL" {
    import UIComponent from "sap/ui/core/UIComponent";
    import Controller from "sap/ui/core/mvc/Controller";
    import EntryCL from "ui5/antares/entry/v2/EntryCL";
    import { IUpdateSettings } from "ui5/antares/types/entry/update";
    /**
     * @namespace ui5.antares.entry.v2
     */
    export default class EntryUpdateCL<EntityT extends object = object, EntityKeysT extends object = object> extends EntryCL<EntityT, EntityKeysT> {
        private settings;
        private manualSubmitter?;
        private manualSubmitListener?;
        constructor(controller: Controller | UIComponent, settings: IUpdateSettings<EntityKeysT>, modelName?: string);
        updateEntry(): Promise<void>;
        private createDialog;
        private onUpdateTriggered;
        private completeSubmit;
        private onEntryCanceled;
        private onEscapePressed;
        private loadDialog;
        private createObjectPage;
        registerManualSubmit(submitter: (entry: EntryUpdateCL<EntityT>) => void, listener?: object): void;
        submitManually(): void;
    }
}
