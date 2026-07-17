import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IPage } from "../util/common/common.types";
import PageCL from "com/ndbs/skillreportingui/util/common/PageCL";
import { Routes } from "../types/global.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import IconTabBar from "sap/m/IconTabBar";
import IconTabFilter from "sap/m/IconTabFilter";
import JSONModel from "sap/ui/model/json/JSONModel";

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

        // Sync ShellBar title with currently selected tab
        this.syncTabTitle();

        // Load dashboard KPIs
        this.loadDashboardData();
    }

    private async loadDashboardData(): Promise<void> {
        let dashboardModel = this.getView()?.getModel("dashboardModel") as JSONModel;
        if (!dashboardModel) {
            dashboardModel = new JSONModel({
                employees: 0,
                skills: 0,
                employeeSkills: 0,
                pendingRequests: 0
            });
            this.getView()?.setModel(dashboardModel, "dashboardModel");
        }

        try {
            const response = await fetch("/api/dashboard/kpi()");
            if (response.ok) {
                const data = await response.json();
                dashboardModel.setData(data.value || data);
            }
        } catch (error) {
            console.error("Failed to load dashboard KPI data", error);
        }
    }

    public onODataRequestFail(_event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    public onTabSelect(event: IconTabBar$SelectEvent): void {
        this.syncTabTitle();
    }

    private syncTabTitle(): void {
        const iconTabBar = this.byId("itbLaunchpad") as IconTabBar;
        if (!iconTabBar) return;
        
        const selectedKey = iconTabBar.getSelectedKey();
        const items = iconTabBar.getItems() as IconTabFilter[];
        const selectedItem = items.find(item => item.getKey() === selectedKey);
        
        if (selectedItem) {
            const globalModel = this.getOwnerComponent()?.getModel("globalJSONModel") as JSONModel;
            if (selectedKey === "overview") {
                globalModel.setProperty("/currentSection", this.getResourceBundleText("homepage"));
            } else {
                globalModel.setProperty("/currentSection", selectedItem.getText());
            }
        }
    }
}