import Router from "sap/f/routing/Router";
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "com/ndbs/skillreportingui/Component";
import { Router$RouteMatchedEvent } from "sap/ui/core/routing/Router";
import JSONModel from "sap/ui/model/json/JSONModel";
import View from "sap/ui/core/mvc/View";
import ShellBar, { ShellBar$NotificationsPressedEvent } from "sap/f/ShellBar";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import { DefaultMessages } from "../types/global.types";
import { Avatar$PressEvent } from "sap/m/Avatar";
import PersonalMenu from "com/ndbs/skillreportingui/util/common/PersonalMenu";
import { FlexibleColumnLayout$StateChangeEvent } from "sap/f/FlexibleColumnLayout";
import { URLHelper } from "sap/m/library";
import { IShellBarExtension } from "../types/notification.types";
import Fragment from "sap/ui/core/Fragment";
import ResponsivePopover from "sap/m/ResponsivePopover";
import Button from "sap/m/Button";
import Context from "sap/ui/model/odata/v2/Context";
import { NotificationListItem$CloseEvent } from "sap/ui/webc/fiori/NotificationListItem";
import ODataCreateCL from "ui5/antares/odata/v2/ODataCreateCL";


/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class App extends Controller {
    private router: Router;
    private personalMenu: PersonalMenu;
    private currentRoute: string;
    private currentEngagementID: string;
    private notificationsPopover?: ResponsivePopover;
    private notificationButton: Button;

    public onInit(): void {
        this.router = this.getUIComponent().getRouter() as Router;
        this.router.attachRouteMatched(this.onRouteMatched, this);
        // MVP: notifications disabled (Notifications entity not yet in service)
        // this.pullNotifications();
        // this.openNotificationSocket();
    }

    public onNavToView(target: string): void {
        this.router.navTo(target);
    }

    public onOpenPersonalMenu(_event: Avatar$PressEvent): void {
        const menu = new PersonalMenu(this, "com.ndbs.skillreportingui.fragments.common.PersonalMenu");
        menu.openPersonalMenu(_event.getSource());
    }

    public onOpenSettings(): void {
        this.personalMenu = new PersonalMenu(this, "com.ndbs.skillreportingui.fragments.common.Settings");
        this.personalMenu.openSettings();
    }

    public onSaveSettings(): void {
        this.personalMenu.saveSettings();
    }

    public onCloseSettingsDialog() {
        this.personalMenu.closeSettings();
    }

    public onOpenWhoami() {
        this.personalMenu = new PersonalMenu(this, "com.ndbs.skillreportingui.fragments.common.Whoami");
        this.personalMenu.openWhoami();
    }

    public onCloseWhoamiDialog() {
        this.personalMenu.closeWhoami();
    }

    public onOpenClaimRoleDialog() {
        this.personalMenu.closeWhoami();
        this.personalMenu = new PersonalMenu(this, "com.ndbs.skillreportingui.fragments.common.ClaimRole");
        this.personalMenu.openClaimRole();
    }

    public onCloseClaimRoleDialog() {
        this.personalMenu.closeClaimRole();
    }

    public onClaimRole() {
        this.personalMenu.claimRole();
    }

    public onOpenUserGuide() {
        URLHelper.redirect("https://itellicloud.sharepoint.com/:b:/t/MSTeams_GFC-GlobalOfferings/EW3RwzN72S5IkncHbG5Rmx0BeGjr62w9kuECUAAi80qVDQ?e=T9g07m", true);
    }

    public onFclStateChanged(_event: FlexibleColumnLayout$StateChangeEvent) {
        const isNavigationArrow = _event.getParameter("isNavigationArrow");
        const layout = _event.getParameter("layout");

        this.updateButtonVisibilities();

        // Replace the URL with the new layout if a navigation arrow was used
        if (isNavigationArrow) {
            this.router.navTo(this.currentRoute, { layout: layout, engagementID: this.currentEngagementID }, true);
        }
    }

    private getUIComponent(): UIComponent {
        return this.getOwnerComponent() as UIComponent;
    }

    private onRouteMatched(_event: Router$RouteMatchedEvent) {
        const routeName = _event.getParameter("name") as string;
        const routingArgs = _event.getParameter("arguments") as { engagementID?: string; layout?: string; };
        const fclModel = this.getUIComponent().getModel("fclModel") as JSONModel;
        let layout = routingArgs.layout;

        // If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
        if (!layout) {
            const nextUIState = this.getUIComponent().getFclSemanticHelper().getNextUIState(0);
            layout = nextUIState.layout;
        }

        // Update the layout of the FlexibleColumnLayout
        if (layout) {
            fclModel.setProperty("/layout", layout);
        }

        this.updateButtonVisibilities();
        this.setAppVisibilities(_event);
        this.changePageLabel(_event);
        this.currentRoute = routeName;
        this.currentEngagementID = routingArgs.engagementID || "";
    }

    private setAppVisibilities(_event: Router$RouteMatchedEvent) {
        // visibility checks disabled for MVP
    }

    private changePageLabel(_event: Router$RouteMatchedEvent) {
        const routeName = _event.getParameter("name") as string;
        const mappings = (this.getUIComponent().getModel("routeMappingsModel") as JSONModel).getData() as Array<{ route: string; pageLabelKey: string; }>;
        const routeMapping = mappings.find(map => map.route === routeName) as { route: string; pageLabelKey: string; };

        ((this.getView() as View).byId("sbApplication") as ShellBar).setSecondTitle(this.getResourceBundleText(routeMapping.pageLabelKey));
    }

    private getResourceBundle(): ResourceBundle {
        return ((this.getUIComponent().getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle);
    }

    private getResourceBundleText(key: string, parameters?: any[]): string {
        const resourceBundle = this.getResourceBundle();
        return resourceBundle.getText(key, parameters, true) || DefaultMessages.NO_I18N_TEXT;
    }

    private updateButtonVisibilities() {
        const fclModel = this.getUIComponent().getModel("fclModel") as JSONModel;
        const uiState = this.getUIComponent().getFclSemanticHelper().getCurrentUIState();
        fclModel.setData(uiState);
    }

    private getCurrentView() {
        return this.getView() as View;
    }

    // // private pullNotifications() {
    //     this.updateNofiticationNumber();
    // }

    private async updateNofiticationNumber() {
        const notificationNumber = await this.getNotificationNumber();
        (this.getCurrentView().byId("sbApplication") as unknown as IShellBarExtension).setNotificationsNumber(notificationNumber);
    }

    private getNotificationNumber(_unread = true): Promise<string> {
        return new Promise((resolve) => {
            // Bypass OData call for demo purposes to avoid UI5 MessageManager errors
            resolve("0");
        });
    }

    public async onOpenNotifications(_event: ShellBar$NotificationsPressedEvent) {
        (this.getCurrentView().byId("sbApplication") as ShellBar).setBusy(true);
        const allNotifications = await this.getNotificationNumber(false);
        const popover = await this.getNotificationsPopover();

        this.notificationButton = _event.getParameter("button") as Button;
        popover.openBy(this.notificationButton);
        (this.getCurrentView().byId("btnDeleteAllNotifications") as Button).setEnabled(allNotifications !== "0");
        this.markNotificationsAsRead();
    }

    private async getNotificationsPopover(): Promise<ResponsivePopover> {
        if (this.notificationsPopover) {
            this.notificationsPopover.destroy();
            this.notificationsPopover = undefined;
        }

        this.notificationsPopover = await (Fragment.load({
            id: this.getCurrentView().getId(),
            name: "com.ndbs.skillreportingui.fragments.common.Notifications",
            controller: this
        }) as Promise<ResponsivePopover>);

        this.getCurrentView().addDependent(this.notificationsPopover);
        return this.notificationsPopover;
    }

    public async onDeleteAllNotifications() {
        const odata = new ODataCreateCL(this, "deleteAllNotifications");

        odata.setData({ all: true });
        await odata.create();
        this.updateNofiticationNumber();
        (this.getCurrentView().byId("sbApplication") as ShellBar).fireNotificationsPressed({ button: this.notificationButton });
    }

    public async onDeleteNotification(_event: NotificationListItem$CloseEvent) {
        const notificationID = (_event.getSource().getBindingContext() as Context).getProperty("ID") as string;
        const odata = new ODataCreateCL(this, "deleteNotification");

        odata.setData({
            notificationID: notificationID
        });

        await odata.create();
        this.updateNofiticationNumber();
        (this.getCurrentView().byId("sbApplication") as ShellBar).fireNotificationsPressed({ button: this.notificationButton });
    }




    private async markNotificationsAsRead() {
        const odata = new ODataCreateCL(this, "markAllNotificationsAsRead");
        odata.setData({ all: true });
        
        try {
            const { markAllNotificationsAsRead } = await odata.create() as { markAllNotificationsAsRead: boolean; };
            if (markAllNotificationsAsRead) {
                this.updateNofiticationNumber();
                (this.getCurrentView().byId("sbApplication") as ShellBar).fireNotificationsPressed({ button: this.notificationButton });
            }
        } catch (error) {
            // Ignore error for missing endpoint
        } finally {
            (this.getCurrentView().byId("sbApplication") as ShellBar).setBusy(false);
        }
    }
}