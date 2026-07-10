import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IPage } from "../util/common/common.types";
import PageCL from "com/ndbs/skillreportingui/util/common/PageCL";
import { ApplicationModels, Routes } from "../types/global.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class Homepage extends BaseController implements IPage {

    /* ======================================================================================================================= */
    /* Lifecycle Methods                                                                                                        */
    /* ======================================================================================================================= */

    public onInit(): void {
        const page = new PageCL<Homepage>(this, Routes.HOMEPAGE);
        page.initialize();
    }

    /* ======================================================================================================================= */
    /* IPage Implementation                                                                                                     */
    /* ======================================================================================================================= */

    public onObjectMatched(): void {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
        this.loadKPIs();
    }

    public onODataRequestFail(_event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    /* ======================================================================================================================= */
    /* Private Methods                                                                                                          */
    /* ======================================================================================================================= */

    private loadKPIs(): void {
        const oDataModel = this.getComponentModel() as ODataModel;
        const globalModel = (this.getOwnerComponent() as UIComponent).getModel(ApplicationModels.GLOBAL_JSON) as JSONModel;

        if (!globalModel) { return; }

        globalModel.setProperty("/kpi", {
            employees: "–",
            skills: "–",
            employeeSkills: "–",
            pendingRequests: "–"
        });

        // Total employees
        oDataModel.read("/VEmployees/$count", {
            success: (data: string) => globalModel.setProperty("/kpi/employees", data),
            error: () => globalModel.setProperty("/kpi/employees", "?")
        });

        // Active skills in catalog
        oDataModel.read("/VSkills/$count", {
            urlParameters: { "$filter": "isActive eq true" },
            success: (data: string) => globalModel.setProperty("/kpi/skills", data),
            error: () => globalModel.setProperty("/kpi/skills", "?")
        });

        // Total employee-skill assignments
        oDataModel.read("/VEmployeeSkills/$count", {
            success: (data: string) => globalModel.setProperty("/kpi/employeeSkills", data),
            error: () => globalModel.setProperty("/kpi/employeeSkills", "?")
        });

        // Pending skill requests
        oDataModel.read("/SkillRequests/$count", {
            filters: [new Filter("status", FilterOperator.EQ, "pendingReview")],
            success: (data: string) => globalModel.setProperty("/kpi/pendingRequests", data),
            error: () => globalModel.setProperty("/kpi/pendingRequests", "?")
        });
    }
}