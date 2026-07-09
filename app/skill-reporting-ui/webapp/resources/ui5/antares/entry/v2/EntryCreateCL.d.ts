declare module "ui5/antares/entry/v2/EntryCreateCL" {
    import Controller from "sap/ui/core/mvc/Controller";
    import EntryCL from "ui5/antares/entry/v2/EntryCL";
    import UIComponent from "sap/ui/core/UIComponent";
    /**
     * @namespace ui5.antares.entry.v2
     */
    export default class EntryCreateCL<EntityT extends object = object> extends EntryCL<EntityT> {
        private manualSubmitter?;
        private manualSubmitListener?;
        constructor(controller: Controller | UIComponent, entityPath: string, modelName?: string);
        createNewEntry(data?: EntityT): Promise<void>;
        private createDialog;
        private onCreateTriggered;
        private completeSubmit;
        private onEntryCanceled;
        private onEscapePressed;
        private loadDialog;
        private createObjectPage;
        private generateGuid;
        registerManualSubmit(submitter: (entry: EntryCreateCL<EntityT>) => void, listener?: object): void;
        submitManually(): void;
    }
}
