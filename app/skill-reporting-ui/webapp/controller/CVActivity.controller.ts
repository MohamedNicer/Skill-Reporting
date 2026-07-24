import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IPage } from "../util/common/common.types";
import PageCL from "com/ndbs/skillreportingui/util/common/PageCL";
import { Routes } from "../types/global.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class CVActivity extends BaseController implements IPage {

    public onInit(): void {
        const page = new PageCL<CVActivity>(this, Routes.CV_ACTIVITY);
        page.initialize();
    }

    public onObjectMatched(): void {
        this.getComponentModel()?.attachRequestFailed({}, this.onODataRequestFail, this);
        this.loadActivityData();
    }

    private async loadActivityData(): Promise<void> {
        try {
            const response = await fetch("/odata/v2/analytics/skillActivityAnalytics()");
            if (response.ok) {
                const data = await response.json();
                const result = data.d?.skillActivityAnalytics || data.d || data.value || data;

                const activityModel = new JSONModel({
                    sources: result.sources || [],
                    requests: result.requests || [],
                    requestsDetail: result.requests || []
                });
                this.getView()?.setModel(activityModel, "activityModel");
            }
        } catch (error) {
            console.error("Failed to load skill activity analytics", error);
        }
    }

    public onODataRequestFail(_event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }
}
