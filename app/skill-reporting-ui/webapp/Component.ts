import UIComponent from "sap/ui/core/UIComponent";
import { createDeviceModel, createVisibilityModel } from "./model/models";
import { IAppVisibilities } from "./types/visibility.types";
import MessageBox from "sap/m/MessageBox";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { ApplicationModels, DefaultMessages, IAppActivityLogs, IAppActivityLogsKeys } from "./types/global.types";
import Storage from "sap/ui/util/Storage";
import Theming from "sap/ui/core/Theming";
import IllustrationPool from "sap/m/IllustrationPool";
import JSONModel from "sap/ui/model/json/JSONModel";
import UserAPI from "com/ndbs/skillreportingui/util/session/UserAPI";
import ODataReadCL from "ui5/antares/odata/v2/ODataReadCL";
import ODataUpdateCL from "ui5/antares/odata/v2/ODataUpdateCL";
import ODataCreateCL from "ui5/antares/odata/v2/ODataCreateCL";
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

    private async insertActivityLogs(): Promise<void> {
        const currentUser = new UserAPI(this);
        await currentUser.getLoggedOnUser();

        (this.getModel(ApplicationModels.GLOBAL_JSON) as JSONModel).setProperty("/user", currentUser.nameAbbreviation);

        const reader = new ODataReadCL<IAppActivityLogs, IAppActivityLogsKeys>(this, "AppActivityLogs");
        let createNewEntry = true;

        try {
            const appActivityLogs = await reader.readByKey({ ID: currentUser.ID as string });
            createNewEntry = false;

            const updater = new ODataUpdateCL<IAppActivityLogs, IAppActivityLogsKeys>(this, "AppActivityLogs");
            appActivityLogs.loginCount++;
            updater.setData(appActivityLogs);
            updater.update({ ID: currentUser.ID as string });
        } catch (error) {
            if (createNewEntry) {
                const newAppActivity: IAppActivityLogs = {
                    ID: currentUser.ID as string,
                    firstName: currentUser.firstName as string,
                    lastName: currentUser.lastName as string,
                    email: currentUser.email as string,
                    loginCount: 1
                };
                const creator = new ODataCreateCL<IAppActivityLogs>(this, "AppActivityLogs");

                creator.setData(newAppActivity);
                creator.create();
            }
        }
    }

    public getFclSemanticHelper(): FlexibleColumnLayoutSemanticHelper {
        const flexibleColumnLayout = (this.getRootControl() as View).byId("fcl") as FlexibleColumnLayout;
        const settings = {
            defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
            maxColumnsCount: 2
        };

        return FlexibleColumnLayoutSemanticHelper.getInstanceFor(flexibleColumnLayout, settings);
    }
}