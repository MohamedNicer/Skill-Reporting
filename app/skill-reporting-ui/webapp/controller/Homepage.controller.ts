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

        const setKpiParam = (key: string, value: string) => {
            const card = this.byId("cardKpi") as any;
            if (card && card.setParameters) {
                card.setParameters({ [key]: value });
            }
        };

        // Total employees
        oDataModel.read("/VEmployees/$count", {
            success: (data: string) => setKpiParam("employees", data),
            error: () => setKpiParam("employees", "?")
        });

        // Active approved skills in catalog
        oDataModel.read("/VSkills/$count", {
            urlParameters: { "$filter": "isActive eq true" },
            success: (data: string) => setKpiParam("skills", data),
            error: () => setKpiParam("skills", "?")
        });

        // Total employee-skill assignments
        oDataModel.read("/VEmployeeSkills/$count", {
            success: (data: string) => setKpiParam("employeeSkills", data),
            error: () => setKpiParam("employeeSkills", "?")
        });

        // Pending skill requests
        oDataModel.read("/SkillRequests/$count", {
            filters: [new Filter("status", FilterOperator.EQ, "pendingReview")],
            success: (data: string) => setKpiParam("pendingRequests", data),
            error: () => setKpiParam("pendingRequests", "?")
        });
    }
}