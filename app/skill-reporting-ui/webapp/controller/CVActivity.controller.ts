import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IPage } from "../util/common/common.types";
import PageCL from "com/ndbs/skillreportingui/util/common/PageCL";
import { Routes } from "../types/global.types";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class CVActivity extends BaseController implements IPage {
    public onInit(): void {
        const page = new PageCL<CVActivity>(this, Routes.CV_ACTIVITY);
        page.initialize();

        const oModel = this.getOwnerComponent()?.getModel("analytics");
        if (oModel) {
            this.getView()?.setModel(oModel);
        }
    }

    /* IPage Implementation */
    public onObjectMatched(): void {
        // Implementation
    }

    public onODataRequestFail(_event: any): void {
        this.openMessagePopover();
    }

    public onMessagePopoverPress(_event: any): void {
        // Implementation for message popover (optional for MVP)
    }
}
