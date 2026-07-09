import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IPage } from "../util/common/common.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import formatter from "com/ndbs/skillreportingui/model/formatter";
import PageCL from "com/ndbs/skillreportingui/util/common/PageCL";
import { Routes, UserRoles } from "../types/global.types";
import Table from "sap/m/Table";
import EntryCreateCL from "ui5/antares/entry/v2/EntryCreateCL";
import { IVSkills, IVSkillsKeys } from "../types/skill.types";
import MessageBox from "sap/m/MessageBox";
import ODataUpdateCL from "ui5/antares/odata/v2/ODataUpdateCL";
import EntryUpdateCL from "ui5/antares/entry/v2/EntryUpdateCL";
import Context from "sap/ui/model/Context";
import SmartTable from "sap/ui/comp/smarttable/SmartTable";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import Button from "sap/m/Button";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class Skills extends BaseController implements IPage {

    /* ======================================================================================================================= */
    /* Properties - Getters - Setters                                                                                          */
    /* ======================================================================================================================= */

    public formatter = formatter;
    private manualEntryCreate: EntryCreateCL<IVSkills>;
    private manualEntryUpdate: EntryUpdateCL<IVSkills>;
    private readonly skillPropOrder = [
        "canonicalName", "categoryID", "description", "status", "isActive"
    ];

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {
        const oModel = this.getOwnerComponent()?.getModel("catalog");
        if (oModel) {
            this.getView()?.setModel(oModel);
        }
        const page = new PageCL<Skills>(this, Routes.SKILLS);
        page.initialize();
    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public async onCreateSkill() {
        const entry = new EntryCreateCL<IVSkills>(this, "Skills");

        entry.setUseMetadataLabels(true);
        entry.setPropertyOrder(this.skillPropOrder);
        entry.setExcludedProperties(["createdAt", "createdBy", "modifiedAt", "modifiedBy", "ID", "normalizedName"]);
        entry.setDisableAutoClose(true);
        entry.setFormTitle(this.getResourceBundleText("createSkill"));
        
        entry.attachSubmitCompleted(async () => {
            (this.byId("stSkills") as SmartTable).rebindTable(true);
            entry.closeAndDestroyEntryDialog();
        });

        this.manualEntryCreate = entry;
        await this.manualEntryCreate.createNewEntry();
    }

    public async onUpdateSkill() {
        const table = this.byId("tblSkills") as Table;
        const selectedItem = table.getSelectedItem();

        if (!selectedItem) {
            return;
        }

        const context = selectedItem.getBindingContext() as Context;
        const entry = new EntryUpdateCL<IVSkills, IVSkillsKeys>(this, { entityPath: "Skills", initializer: context });

        entry.setUseMetadataLabels(true);
        entry.setPropertyOrder(this.skillPropOrder);
        entry.setExcludedProperties(["createdAt", "createdBy", "modifiedAt", "modifiedBy", "ID", "normalizedName"]);
        entry.setDisableAutoClose(true);
        entry.setFormTitle(this.getResourceBundleText("editSkill"));

        entry.attachSubmitCompleted(async () => {
            (this.byId("stSkills") as SmartTable).rebindTable(true);
            this.setSkillButtonsState(false);
            table.removeSelections(true);
            entry.closeAndDestroyEntryDialog();
        });

        this.manualEntryUpdate = entry;
        await this.manualEntryUpdate.updateEntry();
    }

    public onDeprecateSkill(): void {
        const table = this.byId("tblSkills") as Table;
        const selectedItem = table.getSelectedItem();

        if (!selectedItem) {
            return;
        }

        const context = selectedItem.getBindingContext() as Context;
        const skillID = context.getProperty("ID");

        MessageBox.confirm(this.getResourceBundleText("deprecateSkillConfirmMsg"), {
            onClose: async (action: string) => {
                if (action === MessageBox.Action.OK) {
                    const updateOperation = new ODataUpdateCL<IVSkills, IVSkillsKeys>(this, "Skills");
                    updateOperation.setData({ status: "deprecated" } as Partial<IVSkills> as IVSkills);
                    await updateOperation.update({ ID: skillID } as IVSkillsKeys);
                    (this.byId("stSkills") as SmartTable).rebindTable(true);
                    this.setSkillButtonsState(false);
                    table.removeSelections(true);
                }
            }
        });
    }

    public onSkillSelectionChange(event: ListItemBase$PressEvent): void {
        const table = event.getSource() as unknown as Table;
        const selectedItem = table.getSelectedItem();
        this.setSkillButtonsState(!!selectedItem);
    }

    /* ======================================================================================================================= */
    /* IPage Implementation                                                                                                     */
    /* ======================================================================================================================= */

    public onObjectMatched(): void {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
        
        // Show/hide admin buttons based on user role (assuming from global model or just hardcoded to true for MVP if admin)
        // MVP: Assuming all are admins or buttons are visible for demo
        (this.byId("btnCreateSkill") as Button).setVisible(true);
        (this.byId("btnUpdateSkill") as Button).setVisible(true);
        (this.byId("btnDeprecateSkill") as Button).setVisible(true);
    }

    public onODataRequestFail(event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    /* ======================================================================================================================= */
    /* Private Methods                                                                                                          */
    /* ======================================================================================================================= */

    private setSkillButtonsState(enabled: boolean): void {
        (this.byId("btnUpdateSkill") as Button).setEnabled(enabled);
        (this.byId("btnDeprecateSkill") as Button).setEnabled(enabled);
    }

}