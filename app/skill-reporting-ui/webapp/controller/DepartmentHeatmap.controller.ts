import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IPage } from "../util/common/common.types";
import PageCL from "com/ndbs/skillreportingui/util/common/PageCL";
import { Routes } from "../types/global.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class DepartmentHeatmap extends BaseController implements IPage {

    public onInit(): void {
        const page = new PageCL<DepartmentHeatmap>(this, Routes.DEPARTMENT_HEATMAP);
        page.initialize();
    }

    public onObjectMatched(): void {
        this.getComponentModel()?.attachRequestFailed({}, this.onODataRequestFail, this);
        this.loadHeatmapData();
    }

    private async loadHeatmapData(): Promise<void> {
        try {
            const response = await fetch("/odata/v2/analytics/departmentHeatmap()");
            if (response.ok) {
                const data = await response.json();
                const rows = data.d?.results || data.value || data || [];

                let totalEmps = 0;
                let totalSkills = 0;
                for (const row of rows) {
                    totalEmps += row.totalEmployees || 0;
                    totalSkills += row.totalSkills || 0;
                }

                const heatmapModel = new JSONModel({ rows });
                this.getView()?.setModel(heatmapModel, "heatmapModel");

                const summaryModel = new JSONModel({
                    totalDepartments: rows.length,
                    totalEmployees: totalEmps,
                    totalSkills: totalSkills
                });
                this.getView()?.setModel(summaryModel, "heatmapSummary");
            }
        } catch (error) {
            console.error("Failed to load department heatmap data", error);
        }
    }

    public onODataRequestFail(_event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }
}
