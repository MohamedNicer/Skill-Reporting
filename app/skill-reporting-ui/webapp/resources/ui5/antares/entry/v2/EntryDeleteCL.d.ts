declare module "ui5/antares/entry/v2/EntryDeleteCL" {
    import UIComponent from "sap/ui/core/UIComponent";
    import Controller from "sap/ui/core/mvc/Controller";
    import EntryCL from "ui5/antares/entry/v2/EntryCL";
    import { IDeleteFailed, IDeleteSettings } from "ui5/antares/types/entry/delete";
    import ResponseCL from "ui5/antares/entry/v2/ResponseCL";
    /**
     * @namespace ui5.antares.entry.v2
     */
    export default class EntryDeleteCL<EntityT extends object = object, EntityKeysT extends object = object> extends EntryCL<EntityT, EntityKeysT> {
        private settings;
        private confirmationText;
        private confirmationTitle;
        private deleteCompleted?;
        private completedListener?;
        private deleteFailed?;
        private failedListener?;
        constructor(controller: Controller | UIComponent, settings: IDeleteSettings<EntityKeysT>, modelName?: string);
        setConfirmationText(text: string): void;
        getConfirmationText(): string;
        setConfirmationTitle(title: string): void;
        getConfirmationTitle(): string;
        attachDeleteCompleted(completed: (data: EntityT) => void, listener?: object): void;
        attachDeleteFailed(failed: (response: ResponseCL<IDeleteFailed>) => void, listener?: object): void;
        deleteEntry(previewBeforeDelete?: boolean): Promise<void>;
        private createDialog;
        private onDeleteTriggered;
        private onEntryCanceled;
        private onEscapePressed;
        private loadDialog;
        private deleteEntryContext;
        private createObjectPage;
        private registerEventForObjectPage;
        private objectPageEventHandler;
        private unsubscribeEvents;
    }
}
