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

        // Load current user's personal profile stats
        this.loadMyProfileData();

        // Load user roles for UI visibility
        this.loadUserRoles();
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

    private async loadMyProfileData(): Promise<void> {
        let myProfileModel = this.getView()?.getModel("myProfileModel") as JSONModel;
        if (!myProfileModel) {
            myProfileModel = new JSONModel({ mySkills: 0, myPendingRequests: 0 });
            this.getView()?.setModel(myProfileModel, "myProfileModel");
        }
        try {
            const response = await fetch("/api/dashboard/myProfile()");
            if (response.ok) {
                const data = await response.json();
                myProfileModel.setData(data.value || data);
            }
        } catch (error) {
            console.error("Failed to load personal profile data", error);
        }
    }

    private async loadUserRoles(): Promise<void> {
        let rolesModel = this.getOwnerComponent()?.getModel("userRolesModel") as JSONModel;
        if (!rolesModel) {
            rolesModel = new JSONModel({
                Employee: false,
                Manager: false,
                HRAdmin: false,
                SkillsAdmin: false,
                Auditor: false,
                isAdmin: false,
                isManagerOrAbove: false
            });
            this.getOwnerComponent()?.setModel(rolesModel, "userRolesModel");
        }

        try {
            const response = await fetch("/api/dashboard/userInfo()");
            if (response.ok) {
                const data = await response.json();
                const roles = data.value || data;
                rolesModel.setData({
                    ...roles,
                    isAdmin: roles.HRAdmin || roles.SkillsAdmin,
                    isManagerOrAbove: roles.Manager || roles.HRAdmin || roles.SkillsAdmin || roles.Auditor
                });
            }
        } catch (error) {
            console.error("Failed to load user roles", error);
        }
    }

    public onODataRequestFail(_event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    /** Navigate to Employee Skills in PERSONAL mode (show only current user's own skills) */
    public onNavToMySkills(): void {
        const component = this.getOwnerComponent() as any;
        let navModel = component?.getModel("navStateModel") as JSONModel;
        if (!navModel) {
            navModel = new JSONModel({ personalMode: false, filterPendingOnly: false });
            component?.setModel(navModel, "navStateModel");
        }
        navModel.setProperty("/personalMode", true);
        navModel.setProperty("/filterPendingOnly", false);
        this.onNavToView("RouteEmployeeSkills");
    }

    /** Navigate to Skill Requests in PERSONAL mode - Pending Only */
    public onNavToMyPendingRequests(): void {
        const component = this.getOwnerComponent() as any;
        let navModel = component?.getModel("navStateModel") as JSONModel;
        if (!navModel) {
            navModel = new JSONModel({ personalMode: false, filterPendingOnly: false });
            component?.setModel(navModel, "navStateModel");
        }
        navModel.setProperty("/personalMode", true);
        navModel.setProperty("/filterPendingOnly", true);
        this.onNavToView("RouteSkillRequests");
    }

    /** Navigate to Skill Requests in PERSONAL mode - Full History */
    public onNavToMyRequestsHistory(): void {
        const component = this.getOwnerComponent() as any;
        let navModel = component?.getModel("navStateModel") as JSONModel;
        if (!navModel) {
            navModel = new JSONModel({ personalMode: false, filterPendingOnly: false });
            component?.setModel(navModel, "navStateModel");
        }
        navModel.setProperty("/personalMode", true);
        navModel.setProperty("/filterPendingOnly", false);
        this.onNavToView("RouteSkillRequests");
    }

    /** Navigate to Skill Requests in TEAM mode - Pending Only */
    public onNavToTeamPendingRequests(): void {
        const component = this.getOwnerComponent() as any;
        let navModel = component?.getModel("navStateModel") as JSONModel;
        if (!navModel) {
            navModel = new JSONModel({ personalMode: false, filterPendingOnly: false });
            component?.setModel(navModel, "navStateModel");
        }
        navModel.setProperty("/personalMode", false);
        navModel.setProperty("/filterPendingOnly", true);
        this.onNavToView("RouteSkillRequests");
    }

    public onTabSelect(event: IconTabBar$SelectEvent): void {
        this.syncTabTitle();
    }

    private syncTabTitle(): void {
        const iconTabBar = this.byId("itbLaunchpad") as IconTabBar;
        if (!iconTabBar) return;

        const selectedKey = iconTabBar.getSelectedKey();
        const globalModel = this.getOwnerComponent()?.getModel("globalJSONModel") as JSONModel;

        const tabTitles: Record<string, string> = {
            overview: this.getResourceBundleText("homepage"),
            my_workspace: "My Workspace",
            manager_workspace: "Manager Workspace",
            administration: this.getResourceBundleText("administration")
        };

        const title = tabTitles[selectedKey];
        if (title) {
            globalModel.setProperty("/currentSection", title);
        } else {
            const items = iconTabBar.getItems() as IconTabFilter[];
            const selectedItem = items.find(item => item.getKey() === selectedKey);
            if (selectedItem) {
                globalModel.setProperty("/currentSection", selectedItem.getText());
            }
        }
    }
}