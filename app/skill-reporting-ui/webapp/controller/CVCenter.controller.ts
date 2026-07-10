import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class CVCenter extends Controller {
    public onInit(): void {
        const oModel = this.getOwnerComponent()?.getModel("cv");
        if (oModel) {
            this.getView()?.setModel(oModel);
        }
    }

    public onUploadCV(): void {
        MessageToast.show("CV Upload logic will be implemented in Phase 2 with BTP integration.");
    }

    public onGenerateCV(): void {
        MessageToast.show("CV Generation logic will be implemented in Phase 2 with BTP integration.");
    }

    public onMessagePopoverPress(_event: any): void {
        // Implementation for message popover (optional for MVP)
    }
}
