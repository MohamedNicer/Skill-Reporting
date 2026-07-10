import Controller from "sap/ui/core/mvc/Controller";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class ManagerWorkspace extends Controller {
    public onInit(): void {
        const oModel = this.getOwnerComponent()?.getModel("analytics");
        if (oModel) {
            this.getView()?.setModel(oModel);
        }
    }

    public onMessagePopoverPress(_event: any): void {
        // Implementation for message popover (optional for MVP)
    }
}
