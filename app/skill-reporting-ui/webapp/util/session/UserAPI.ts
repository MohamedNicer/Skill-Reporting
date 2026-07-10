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
        await this.getLoggedOnUser();

        const odata = new ODataReadCL<IWhoami>(this.sourceController, "Whoami");
        odata.addFilter(new Filter("successFactorsID", FilterOperator.EQ, this.ID));

        const user = await odata.read();

        if (user.length) {
            return {
                personnelID: user[0].personnelID as string,
                successFactorsID: this.ID as string,
                firstName: user[0].firstName as string,
                lastName: user[0].lastName as string,
                team: user[0].team,
                country: user[0].country,
                role: user[0].role,
                roleDescription: user[0].roleDescription,
                createRequired: false,
                email: this.email as string
            };
        } else {
            return {
                personnelID: null,
                successFactorsID: this.ID as string,
                firstName: this.firstName as string,
                lastName: this.lastName as string,
                country: null,
                team: null,
                role: "N",
                roleDescription: "No Role",
                createRequired: true,
                email: this.email as string
            };
        }
    }
}