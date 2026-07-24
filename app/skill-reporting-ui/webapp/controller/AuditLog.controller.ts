import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IPage } from "../util/common/common.types";
import PageCL from "com/ndbs/skillreportingui/util/common/PageCL";
import { Routes } from "../types/global.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class AuditLog extends BaseController implements IPage {

    public onInit(): void {
        const page = new PageCL<AuditLog>(this, Routes.AUDIT_LOG);
        page.initialize();
    }

    public onObjectMatched(): void {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
    }

    public onODataRequestFail(_event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }
}
