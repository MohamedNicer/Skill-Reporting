import FragmentCL from "ui5/antares/ui/FragmentCL";
import Avatar from "sap/m/Avatar";
import RadioButtonGroup from "sap/m/RadioButtonGroup";
import Storage from "sap/ui/util/Storage";
import { DefaultMessages, FioriThemeTexts, FioriThemes } from "../../types/global.types";
import Theming from "sap/ui/core/Theming";
import ActionSheet from "sap/m/ActionSheet";
import View from "sap/ui/core/mvc/View";
import Controller from "sap/ui/core/mvc/Controller";
import UserAPI from "com/ndbs/skillreportingui/util/session/UserAPI";
import JSONModel from "sap/ui/model/json/JSONModel";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import ComboBox from "sap/m/ComboBox";
import MessageBox from "sap/m/MessageBox";
import UIComponent from "sap/ui/core/UIComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Table from "sap/m/Table";
import ODataCreateCL from "ui5/antares/odata/v2/ODataCreateCL";
import { IWhoami } from "./common.types";
import Context from "sap/ui/model/odata/v2/Context";
import Item from "sap/ui/core/Item";
import TextArea from "sap/m/TextArea";

/**
 * @namespace com.ndbs.skillreportingui.util.common
 */
export default class PersonalMenu {
    private sourceController: Controller;
    private sourceView: View;
    private fragmentPath: string;
    private settingsDialog: FragmentCL;
    private whoamiDialog: FragmentCL;
    private claimRoleDialog: FragmentCL;

    constructor(sourceController: Controller, fragmentPath: string) {
        this.sourceController = sourceController;
        this.sourceView = sourceController.getView() as View;
        this.fragmentPath = fragmentPath;
    }

    public openPersonalMenu(avatar: Avatar): void {
        const fragment = new FragmentCL(this.sourceController, this.fragmentPath);

        fragment.load().then((control) => {
            if (control instanceof ActionSheet) {
                this.sourceView.addDependent(control);
                control.openBy(avatar);
            }
        });
    }

    public openSettings(): void {
        this.settingsDialog = new FragmentCL(this.sourceController, this.fragmentPath);
        this.settingsDialog.setAutoDestroyOnESC(true);
        this.settingsDialog.openAsync(true).then((control) => {
            this.setSelectedTheme();
        });
    }

    public saveSettings(): void {
        let selectedTheme: FioriThemes = (this.sourceController.byId("rbgTheme") as RadioButtonGroup).getSelectedIndex();
        this.saveTheme(selectedTheme);
        this.closeSettings();
    }

    public closeSettings(): void {
        this.settingsDialog.closeAndDestroy();
    }

    public async openWhoami() {
        BusyIndicator.show(1);
        await this.setWhoamiModel();
        this.whoamiDialog = new FragmentCL(this.sourceController, this.fragmentPath);
        this.whoamiDialog.setAutoDestroyOnESC(true);
        this.whoamiDialog.openAsync(true).then(() => {
            BusyIndicator.hide();
        });
    }

    public closeWhoami(): void {
        this.whoamiDialog.closeAndDestroy();
    }

    public openClaimRole() {
        this.claimRoleDialog = new FragmentCL(this.sourceController, this.fragmentPath);
        this.claimRoleDialog.setAutoDestroyOnESC(true);
        this.claimRoleDialog.openAsync(true);
    }

    public closeClaimRole() {
        this.claimRoleDialog.closeAndDestroy();
    }

    public async claimRole() {
        const claimedRole: string | null = (this.sourceView.byId("cbClaimedRole") as ComboBox).getSelectedKey();
        const reason = (this.sourceView.byId("txtReason") as TextArea).getValue();
        const selectedAdmins = (this.sourceView.byId("tblClaimRole") as Table).getSelectedItems();

        if (!claimedRole) {
            MessageBox.error(this.getResourceBundleText("selectClaimedRole"));
            return;
        }

        if (!reason) {
            MessageBox.error(this.getResourceBundleText("provideClaimReason"));
            return;
        }

        if (!selectedAdmins.length) {
            MessageBox.error(this.getResourceBundleText("selectAtLeastOneAdministrator"));
            return;
        }

        const adminEmails = selectedAdmins.map(admin => (admin.getBindingContext() as Context).getProperty("email") as string);
        const person = (this.sourceView.getModel("whoamiModel") as JSONModel).getData() as IWhoami;
        const claimedRoleText = ((this.sourceView.byId("cbClaimedRole") as ComboBox).getSelectedItem() as Item).getText();
        const odata = new ODataCreateCL(this.sourceController, "claimRole");

        odata.setData({
            config: {
                personnelID: person.personnelID,
                successFactorsID: person.successFactorsID,
                firstName: person.firstName,
                lastName: person.lastName,
                team: person.team,
                country: person.country,
                currentRole: person.role,
                currentRoleText: person.roleDescription,
                claimedRole: claimedRole,
                claimedRoleText: claimedRoleText,
                createRequired: person.createRequired,
                email: person.email,
                reason: reason,
                administrators: adminEmails
            }
        });

        try {
            BusyIndicator.show(1);
            await odata.create();
            BusyIndicator.hide();
            this.closeClaimRole();
            MessageBox.information(this.getResourceBundleText("claimWasSuccessful"));
        } catch (error) {
            BusyIndicator.hide();
            MessageBox.error(this.getResourceBundleText("unexpectedError"));
        }
    }

    private setSelectedTheme(): void {
        const rbgTheme = this.sourceController.byId("rbgTheme") as RadioButtonGroup;
        const selectedTheme = this.getSelectedTheme();
        rbgTheme.setSelectedIndex(selectedTheme);
    }

    private getSelectedTheme(): FioriThemes {
        const themeStorage = new Storage(Storage.Type.local, "user_preference");
        const selectedThemeText: string | undefined = themeStorage.get("theme");
        let selectedTheme: FioriThemes = FioriThemes.HORIZON;

        switch (selectedThemeText) {
            case FioriThemeTexts.HORIZON_HCW:
                selectedTheme = FioriThemes.HORIZON_HCW;
                break;
            case FioriThemeTexts.HORIZON_HCB:
                selectedTheme = FioriThemes.HORIZON_HCB;
                break;
            case FioriThemeTexts.HORIZON_DARK:
                selectedTheme = FioriThemes.HORIZON_DARK;
                break;
            case FioriThemeTexts.HORIZON:
                selectedTheme = FioriThemes.HORIZON;
                break;
            case FioriThemeTexts.FIORI_3_DARK:
                selectedTheme = FioriThemes.FIORI_3_DARK;
                break;
            case FioriThemeTexts.FIORI_3:
                selectedTheme = FioriThemes.FIORI_3;
                break;
            case FioriThemeTexts.HCB:
                selectedTheme = FioriThemes.HCB;
                break;
            case FioriThemeTexts.BELIZE_HCW:
                selectedTheme = FioriThemes.BELIZE_HCW;
                break;
            case FioriThemeTexts.BELIZE:
                selectedTheme = FioriThemes.BELIZE;
                break;
        }

        return selectedTheme;
    }

    private saveTheme(selectedTheme: FioriThemes) {
        let selectedThemeText = FioriThemeTexts.HORIZON;
        const themeStorage = new Storage(Storage.Type.local, "user_preference");

        switch (selectedTheme) {
            case FioriThemes.HORIZON_HCW:
                selectedThemeText = FioriThemeTexts.HORIZON_HCW;
                break;
            case FioriThemes.HORIZON_HCB:
                selectedThemeText = FioriThemeTexts.HORIZON_HCB;
                break;
            case FioriThemes.HORIZON_DARK:
                selectedThemeText = FioriThemeTexts.HORIZON_DARK;
                break;
            case FioriThemes.HORIZON:
                selectedThemeText = FioriThemeTexts.HORIZON;
                break;
            case FioriThemes.FIORI_3_DARK:
                selectedThemeText = FioriThemeTexts.FIORI_3_DARK;
                break;
            case FioriThemes.FIORI_3:
                selectedThemeText = FioriThemeTexts.FIORI_3;
                break;
            case FioriThemes.HCB:
                selectedThemeText = FioriThemeTexts.HCB;
                break;
            case FioriThemes.BELIZE_HCW:
                selectedThemeText = FioriThemeTexts.BELIZE_HCW;
                break;
            case FioriThemes.BELIZE:
                selectedThemeText = FioriThemeTexts.BELIZE;
                break;
        }

        themeStorage.put("theme", selectedThemeText);
        Theming.setTheme(selectedThemeText);
    }

    private async setWhoamiModel() {
        const currentUser = new UserAPI(this.sourceController);
        const whoami = await currentUser.whoami();
        this.sourceView.setModel(new JSONModel(whoami), "whoamiModel");
    }

    private getResourceBundle(): ResourceBundle {
        return (((this.sourceController.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle);
    }

    private getResourceBundleText(key: string, parameters?: any[]): string {
        const resourceBundle = this.getResourceBundle();
        return resourceBundle.getText(key, parameters, true) || DefaultMessages.NO_I18N_TEXT;
    }
}