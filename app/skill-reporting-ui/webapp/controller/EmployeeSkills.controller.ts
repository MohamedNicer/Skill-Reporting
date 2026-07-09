import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IPage } from "../util/common/common.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import formatter from "com/ndbs/skillreportingui/model/formatter";
import PageCL from "com/ndbs/skillreportingui/util/common/PageCL";
import { Routes, ApplicationModels } from "../types/global.types";
import Table from "sap/m/Table";
import MessageBox from "sap/m/MessageBox";
import Context from "sap/ui/model/Context";
import SmartTable from "sap/ui/comp/smarttable/SmartTable";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import Button from "sap/m/Button";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class EmployeeSkills extends BaseController implements IPage {

    /* ======================================================================================================================= */
    /* Properties - Getters - Setters                                                                                          */
    /* ======================================================================================================================= */

    public formatter = formatter;

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {
        const oModel = this.getOwnerComponent()?.getModel("profile");
        if (oModel) {
            this.getView()?.setModel(oModel);
        }
        const page = new PageCL<EmployeeSkills>(this, Routes.EMPLOYEE_SKILLS);
        page.initialize();
    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public onRequestNewSkill(): void {
        // MVP: Show dialog to request a new skill
        MessageBox.information("This will open a dialog to request a new skill/alias to be approved by admins.");
    }

    public onAddSkill(): void {
        // MVP: Show dialog to select an existing skill from catalog and add it
        MessageBox.information("This will open a dialog to search the Skill Catalog and add a skill to your profile.");
    }

    public onUpdateSkillDetails(): void {
        const table = this.byId("tblEmployeeSkills") as Table;
        const selectedItem = table.getSelectedItem();

        if (!selectedItem) {
            return;
        }

        MessageBox.information("This will open a dialog to update your proficiency level or years of experience.");
        table.removeSelections(true);
        this.setEmployeeSkillButtonsState(false);
    }

    public onRemoveSkill(): void {
        const table = this.byId("tblEmployeeSkills") as Table;
        const selectedItem = table.getSelectedItem();

        if (!selectedItem) {
            return;
        }

        const context = selectedItem.getBindingContext() as Context;
        const employeeSkillID = context.getProperty("ID");

        MessageBox.confirm(this.getResourceBundleText("removeSkillConfirmMsg") || "Are you sure you want to remove this skill from your profile?", {
            onClose: (action: string) => {
                if (action === MessageBox.Action.OK) {
                    const oDataModel = this.getComponentModel() as ODataModel;
                    oDataModel.callFunction("/removeSkill", {
                        method: "POST",
                        urlParameters: { employeeSkillID },
                        success: () => {
                            (this.byId("stEmployeeSkills") as SmartTable).rebindTable(true);
                            this.setEmployeeSkillButtonsState(false);
                            table.removeSelections(true);
                        },
                        error: () => {
                            this.openMessagePopover();
                        }
                    });
                }
            }
        });
    }

    public onEmployeeSkillSelectionChange(event: ListItemBase$PressEvent): void {
        const table = event.getSource() as unknown as Table;
        const selectedItem = table.getSelectedItem();
        this.setEmployeeSkillButtonsState(!!selectedItem);
    }

    /* ======================================================================================================================= */
    /* IPage Implementation                                                                                                     */
    /* ======================================================================================================================= */

    public onObjectMatched(): void {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
    }

    public onODataRequestFail(event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    /* ======================================================================================================================= */
    /* Private Methods                                                                                                          */
    /* ======================================================================================================================= */

    private setEmployeeSkillButtonsState(enabled: boolean): void {
        (this.byId("btnUpdateSkillDetails") as Button).setEnabled(enabled);
        (this.byId("btnRemoveSkill") as Button).setEnabled(enabled);
    }

}