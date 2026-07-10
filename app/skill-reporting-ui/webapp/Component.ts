import UIComponent from "sap/ui/core/UIComponent";
import { createDeviceModel, createVisibilityModel } from "./model/models";
import { ApplicationModels } from "./types/global.types";
import Storage from "sap/ui/util/Storage";
import Theming from "sap/ui/core/Theming";
import IllustrationPool from "sap/m/IllustrationPool";
import JSONModel from "sap/ui/model/json/JSONModel";
import View from "sap/ui/core/mvc/View";
import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
import { LayoutType } from "sap/f/library";
import FlexibleColumnLayoutSemanticHelper from "sap/f/FlexibleColumnLayoutSemanticHelper";

/**
 * @namespace com.ndbs.skillreportingui
 */
export default class Component extends UIComponent {
    public static metadata = {
        manifest: "json"
    };

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
    public init(): void {
        super.init();

        // enable routing
        this.getRouter().initialize();

        // set the device model
        this.setModel(createDeviceModel(), "device");

        // Flexible Column Layout model
        this.setModel(new JSONModel(), "fclModel");

        // MVP: set empty visibility model (VHAppVisibilities not yet exposed in service)
        this.setModel(createVisibilityModel([]), ApplicationModels.VISIBILITY);

        // theme preference
        const themeStorage = new Storage(Storage.Type.local, "user_preference");
        const selectedTheme: string | null = themeStorage.get("theme");

        if (selectedTheme) {
            Theming.setTheme(selectedTheme);
        }

        // register tnt illustration set
        let tntSet = {
            setFamily: "tnt",
            setURI: sap.ui.require.toUrl("sap/tnt/themes/base/illustrations")
        };

        IllustrationPool.registerIllustrationSet(tntSet, false);

        // MVP: skip activity log insert (AppActivityLogs not yet exposed in service)
        // this.insertActivityLogs();
    }

    // MVP: getAppVisibilities disabled - VHAppVisibilities not yet in service

    public getFclSemanticHelper(): FlexibleColumnLayoutSemanticHelper {
        const flexibleColumnLayout = (this.getRootControl() as View).byId("fcl") as FlexibleColumnLayout;
        const settings = {
            defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
            maxColumnsCount: 2
        };

        return FlexibleColumnLayoutSemanticHelper.getInstanceFor(flexibleColumnLayout, settings);
    }
}