import Router from "sap/f/routing/Router";
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "com/ndbs/skillreportingui/Component";
import { Router$RouteMatchedEvent } from "sap/ui/core/routing/Router";
import JSONModel from "sap/ui/model/json/JSONModel";
import View from "sap/ui/core/mvc/View";
import ShellBar from "sap/f/ShellBar";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import { DefaultMessages } from "../types/global.types";
import { FlexibleColumnLayout$StateChangeEvent } from "sap/f/FlexibleColumnLayout";


/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class App extends Controller {
    private router: Router;
    private currentRoute: string;
    private currentEngagementID: string;

    public onInit(): void {
        this.router = this.getUIComponent().getRouter() as Router;
        this.router.attachRouteMatched(this.onRouteMatched, this);
    }

    public onNavToView(target: string): void {
        this.router.navTo(target);
    }



    public onFclStateChanged(event: FlexibleColumnLayout$StateChangeEvent) {
        const isNavigationArrow = event.getParameter("isNavigationArrow");
        const layout = event.getParameter("layout");

        this.updateButtonVisibilities();

        // Replace the URL with the new layout if a navigation arrow was used
        if (isNavigationArrow) {
            this.router.navTo(this.currentRoute, { layout: layout, engagementID: this.currentEngagementID }, true);
        }
    }

    private getUIComponent(): UIComponent {
        return this.getOwnerComponent() as UIComponent;
    }

    private onRouteMatched(event: Router$RouteMatchedEvent) {
        const routeName = event.getParameter("name") as string;
        const routingArgs = event.getParameter("arguments") as { engagementID?: string; layout?: string; };
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
        this.setAppVisibilities(event);
        this.changePageLabel(event);
        this.currentRoute = routeName;
        this.currentEngagementID = routingArgs.engagementID || "";
    }

    private setAppVisibilities(_event: Router$RouteMatchedEvent) {
        // visibility checks disabled for MVP
    }

    private changePageLabel(event: Router$RouteMatchedEvent) {
        const routeName = event.getParameter("name") as string;
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


}