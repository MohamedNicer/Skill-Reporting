import Controller from "sap/ui/core/mvc/Controller";
import { ICurrentUserInfo, IUserAPI, IUserRole, UserRoles } from "../../types/global.types";
import UIComponent from "sap/ui/core/UIComponent";
import ODataReadCL from "ui5/antares/odata/v2/ODataReadCL";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IWhoami } from "../common/common.types";

/**
 * @namespace com.ndbs.skillreportingui.util.session
 */
export default class UserAPI {
    private sourceController: Controller | UIComponent;
    public ID?: string | null;
    public firstName?: string | null;
    public lastName?: string | null;
    public email?: string | null;
    public nameAbbreviation?: string | null;
    public userRole?: UserRoles | null = UserRoles.NONE;
    public teamID?: string | null;
    public teamName?: string | null;

    constructor(controller: Controller | UIComponent) {
        this.sourceController = controller;
    }

    public async getLoggedOnUser(): Promise<void> {
        return new Promise((resolve, _reject) => {
            $.ajax({
                url: "/comndbsskillreportingui/user-api/currentUser",
                method: "GET",
                success: (data: string | IUserAPI) => {
                    const user = typeof data === "string" ? JSON.parse(data) as IUserAPI : data;
                    this.ID = user.name;
                    this.firstName = user.firstname;
                    this.lastName = user.lastname;
                    this.email = user.email;
                    this.nameAbbreviation = this.firstName.substring(0, 1) + this.lastName.substring(0, 1);
                    resolve();
                },
                error: () => {
                    this.ID = "demo_admin";
                    this.firstName = "Demo";
                    this.lastName = "User";
                    this.email = "demo.user@example.com";
                    this.nameAbbreviation = "DU";
                    resolve();
                }
            });
        });
    }

    public async getCurrentUserRole(): Promise<void> {
        await this.getLoggedOnUser();

        const odata = new ODataReadCL<IUserRole>(this.sourceController, "VHPersonnelInfo");
        odata.setUrlParameters({
            "$select": "ID,sfUser,userRole"
        });
        odata.addFilter(new Filter("sfUser", FilterOperator.EQ, this.ID));

        try {
            const user = await odata.read();
            this.userRole = user[0]?.userRole || UserRoles.NONE;
        } catch (error) {
            this.userRole = UserRoles.NONE;
        }
    }

    public async getCurrentUserInfo() {
        return new Promise((resolve, _reject) => {
            (this.sourceController as BaseController).getComponentModel().callFunction("/getCurrentUserInfo", {
                success: (data: { getCurrentUserInfo: ICurrentUserInfo }) => {
                    this.ID = data.getCurrentUserInfo.successFactorsID;
                    this.firstName = data.getCurrentUserInfo.firstName;
                    this.lastName = data.getCurrentUserInfo.lastName;
                    this.teamID = data.getCurrentUserInfo.teamID;
                    this.teamName = data.getCurrentUserInfo.teamName;
                    this.userRole = data.getCurrentUserInfo.userRole;
                    resolve(true);
                }
            });
        });
    }

    public async whoami(): Promise<IWhoami> {
        try {
            // Get user info + employee details from backend (single call)
            const userInfoResponse = await fetch("/api/dashboard/userInfo()");
            if (userInfoResponse.ok) {
                const userInfoData = await userInfoResponse.json();
                const info = userInfoData.value || userInfoData;

                // Build role description from role flags
                const roles: string[] = [];
                if (info.HRAdmin) roles.push("HR Admin");
                if (info.SkillsAdmin) roles.push("Skills Admin");
                if (info.Manager) roles.push("Manager");
                if (info.Employee) roles.push("Employee");
                if (info.Auditor) roles.push("Auditor");

                return {
                    personnelID: info.employeeNumber || null,
                    successFactorsID: info.id || "unknown",
                    firstName: info.firstName || info.id || "Unknown",
                    lastName: info.lastName || "",
                    country: info.location || null,
                    team: info.departmentName || null,
                    role: roles[0] || "Employee",
                    roleDescription: roles.length > 0 ? roles.join(", ") : "Employee",
                    createRequired: !info.employeeID,
                    email: info.email || `${info.id}@nttdata.com`
                };
            }
        } catch {
            // Fall through to fallback
        }

        // Ultimate fallback
        return {
            personnelID: null,
            successFactorsID: "unknown",
            firstName: "Unknown",
            lastName: "User",
            country: null,
            team: null,
            role: "Employee",
            roleDescription: "Employee",
            createRequired: true,
            email: "unknown@nttdata.com"
        };
    }
}