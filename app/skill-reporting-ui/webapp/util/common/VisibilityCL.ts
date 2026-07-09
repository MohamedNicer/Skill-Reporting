import BaseObject from "sap/ui/base/Object";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";
import { IJSONVisibilities } from "../../types/visibility.types";
import UserAPI from "com/ndbs/skillreportingui/util/session/UserAPI";
import { UserRoles } from "../../types/global.types";
import Targets from "sap/ui/core/routing/Targets";
import MenuItem from "sap/m/MenuItem";
import Control from "sap/ui/core/Control";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import Controller from "sap/ui/core/mvc/Controller";
import Router from "sap/f/routing/Router";
import UIComponent from "com/ndbs/skillreportingui/Component";

/**
 * @namespace com.ndbs.skillreportingui.util.common
 */
export default class VisibilityCL extends BaseObject {
    private rootController: Controller;
    private sourceViews: View[];
    private rootView: View;
    private ownerComponent: UIComponent;
    private visibilities: IJSONVisibilities[];
    private userRole: UserRoles;
    private router: Router;

    constructor(rootController: Controller, sourceViews: View[]) {
        super();
        this.rootController = rootController;
        this.sourceViews = sourceViews;
        this.rootView = this.rootController.getView() as View;
        this.ownerComponent = this.rootController.getOwnerComponent() as UIComponent;
        this.router = this.ownerComponent.getRouter() as Router;
    }

    public async setAppVisibility(): Promise<void> {
        const currentUser = new UserAPI(this.rootController);

        this.visibilities = await this.getVisibilityModel();
        await currentUser.getCurrentUserRole();
        this.userRole = currentUser.userRole as UserRoles;
        const currentPageVisibility = this.getCurrentPageVisibility();

        if (!currentPageVisibility.authorized) {
            BusyIndicator.show(1);
            setTimeout(() => {
                BusyIndicator.hide();
                const currentUIState = this.ownerComponent.getFclSemanticHelper().getCurrentUIState();

                switch (currentUIState.layout) {
                    case "TwoColumnsMidExpanded":
                    case "TwoColumnsBeginExpanded":
                    case "MidColumnFullScreen":
                        (this.ownerComponent.getModel("fclModel") as JSONModel).setProperty("/layout", "OneColumn");
                        break;
                }

                (this.router.getTargets() as Targets).display("TargetNoAuthorization", {
                    fromTarget: currentPageVisibility.groupId
                });

                throw new Error("No authorization!");
            }, 500);
            return;
        }

        this.setPageVisibilities();
        this.setControlVisibilities();
    }

    private extractGroupId(view: View) {
        return view.getViewName().split("com.ndbs.skillreportingui.view.")[1];
    }

    private getVisibilityModel(): Promise<IJSONVisibilities[]> {
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
                const visibilityModel = this.ownerComponent.getModel("globalAppVisibilities");

                if (visibilityModel) {
                    clearInterval(checkInterval);
                    resolve((visibilityModel as JSONModel).getData());
                }
            }, 100);
        });
    }

    private getCurrentPageVisibility() {
        let groupId = "";
        let displayAuthorized = false;

        for (const view of this.sourceViews) {
            groupId = this.extractGroupId(view);
            const currentPage = this.visibilities.find(visibility => visibility.group === groupId && visibility.elementType === "Page");

            if (!currentPage) {
                displayAuthorized = false;
                break;
            }

            switch (this.userRole) {
                case UserRoles.ADMIN:
                    displayAuthorized = currentPage.adminCanSee;
                    break;
                case UserRoles.MANAGER:
                    displayAuthorized = currentPage.managerCanSee;
                    break;
                case UserRoles.USER:
                    displayAuthorized = currentPage.userCanSee;
                    break;
                default:
                    displayAuthorized = currentPage.noneCanSee;
                    break;
            }

            if (!displayAuthorized) {
                break;
            }
        }

        return {
            authorized: displayAuthorized,
            groupId: groupId
        };
    }

    private setPageVisibilities(): void {
        const visiblePages = this.visibilities.filter(visibility => visibility.elementType === "Page");
        const groupIDs = this.sourceViews.map(view => this.extractGroupId(view));

        for (const page of visiblePages) {
            const menuItem = this.rootView.byId(`mnit${page.uiElement}`);

            if (!menuItem) {
                continue;
            }

            if (groupIDs.includes(page.group)) {
                (menuItem as MenuItem).setVisible(false);
            } else {
                switch (this.userRole) {
                    case UserRoles.ADMIN:
                        (menuItem as MenuItem).setVisible(page.adminCanSee);
                        break;
                    case UserRoles.MANAGER:
                        (menuItem as MenuItem).setVisible(page.managerCanSee);
                        break;
                    case UserRoles.USER:
                        (menuItem as MenuItem).setVisible(page.userCanSee);
                        break;
                    default:
                        (menuItem as MenuItem).setVisible(page.noneCanSee);
                        break;
                }
            }
        }
    }

    private setControlVisibilities(): void {
        if (this.userRole === UserRoles.ADMIN) {
            (this.rootView.byId("mnitVisibility") as MenuItem).setVisible(true);
        }

        for (const view of this.sourceViews) {
            const groupId = this.extractGroupId(view);
            const controlVisibilities = this.visibilities.filter(visibility => visibility.group === groupId && visibility.elementType !== "Page");

            controlVisibilities.forEach((control) => {
                switch (this.userRole) {
                    case UserRoles.ADMIN:
                        (view.byId(control.uiElement) as Control).setVisible(control.adminCanSee);
                        break;
                    case UserRoles.MANAGER:
                        (view.byId(control.uiElement) as Control).setVisible(control.managerCanSee);
                        break;
                    case UserRoles.USER:
                        (view.byId(control.uiElement) as Control).setVisible(control.userCanSee);
                        break;
                    default:
                        (view.byId(control.uiElement) as Control).setVisible(control.noneCanSee);
                        break;
                }
            });
        }
    }

    public async setVisibilityPageAuth() {
        const currentUser = new UserAPI(this.rootController);
        await currentUser.getCurrentUserRole();
        this.userRole = currentUser.userRole as UserRoles;

        if (this.userRole !== "A") {
            BusyIndicator.show(1);
            setTimeout(() => {
                BusyIndicator.hide();
                (this.router.getTargets() as Targets).display("TargetNoAuthorization", {
                    fromTarget: "Visibility"
                });
            }, 500);
        } else {
            const visibleElementIDs = [
                "mnitHomepage",
                "mnitPersonnel",
                "mnitEngagements",
                "mnitAnalytics",
                "mnitUtilization",
                "mnitRevenue",
                "mnitTeams",
                "mnitGenerator",
                "mnitTimesheetCheck",
                "mnitUploader",
                "mnitForecast",
                "mnitAppLogs",
                "mnitMappings",
                "mnitPushNotification",
                "mnitConfigurations",
                "stApplicationVisibilities",
                "sfbApplicationVisibilities",
                "pnlBackendAuthorizations",
                "sfbBackendAuthorizations",
                "stBackendAuthorizations",
                "btnSave"
            ];

            (this.rootView.byId("mnitVisibility") as MenuItem).setVisible(false);

            visibleElementIDs.forEach((elementID) => {
                if (elementID.startsWith("mnit")) {
                    (this.rootView.byId(elementID) as Control).setVisible(true);
                } else {
                    (this.sourceViews[0].byId(elementID) as Control).setVisible(true);
                }
            });
        }
    }

    public async setRoleClaimPageAuth() {
        const currentUser = new UserAPI(this.rootController);
        await currentUser.getCurrentUserRole();
        this.userRole = currentUser.userRole as UserRoles;

        if (this.userRole !== "A") {
            BusyIndicator.show(1);
            setTimeout(() => {
                BusyIndicator.hide();
                (this.router.getTargets() as Targets).display("TargetNoAuthorization", {
                    fromTarget: "RoleClaim"
                });
            }, 500);
        } else {
            const visibleElementIDs = [
                "mnitHomepage",
                "mnitPersonnel",
                "mnitEngagements",
                "mnitAnalytics",
                "mnitUtilization",
                "mnitRevenue",
                "mnitTeams",
                "mnitGenerator",
                "mnitTimesheetCheck",
                "mnitUploader",
                "mnitForecast",
                "mnitAppLogs",
                "mnitMappings",
                "mnitPushNotification",
                "mnitVisibility",
                "mnitConfigurations",
                "sfPersonnelEntry",
                "btnApproveClaim",
                "btnRejectClaim"
            ];

            visibleElementIDs.forEach((elementID) => {
                if (elementID.startsWith("mnit")) {
                    (this.rootView.byId(elementID) as Control).setVisible(true);
                } else {
                    (this.sourceViews[0].byId(elementID) as Control).setVisible(true);
                }
            });
        }
    }
}