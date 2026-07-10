import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IPage } from "../util/common/common.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import formatter from "com/ndbs/skillreportingui/model/formatter";
import PageCL from "com/ndbs/skillreportingui/util/common/PageCL";
import { Routes } from "../types/global.types";
import Table from "sap/m/Table";
import EntryCreateCL from "ui5/antares/entry/v2/EntryCreateCL";
import SmartTable from "sap/ui/comp/smarttable/SmartTable";
import EntryUpdateCL from "ui5/antares/entry/v2/EntryUpdateCL";
import Context from "sap/ui/model/Context";
import EntryDeleteCL from "ui5/antares/entry/v2/EntryDeleteCL";
import Button from "sap/m/Button";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import MessageBox from "sap/m/MessageBox";
import Dialog from "sap/m/Dialog";
import TextArea from "sap/m/TextArea";
import { ButtonType } from "sap/m/library";
import { ISkillCategories } from "../types/skill.types";

interface IProficiencyLevels {
    ID: string;
    categoryID: string;
    code: string;
    label: string;
    scaleType: string;
    rank: number;
    isActive: boolean;
}

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class Configurations extends BaseController implements IPage {

    public formatter = formatter;
    private manualEntryCreateCat: EntryCreateCL<ISkillCategories>;
    private manualEntryUpdateCat: EntryUpdateCL<ISkillCategories>;
    private manualEntryCreateProf: EntryCreateCL<IProficiencyLevels>;
    private manualEntryUpdateProf: EntryUpdateCL<IProficiencyLevels>;
    
    private readonly categoryPropOrder = ["name", "description", "sortOrder", "isActive"];
    private readonly profPropOrder = ["categoryID", "code", "label", "scaleType", "rank", "isActive"];

    public onInit(): void {
        const page = new PageCL<Configurations>(this, Routes.CONFIGURATIONS);
        page.initialize();
    }

    public onPageLoaded(_event?: any): void {
        // Handle tab specific logic if needed
    }

    /* Category CRUD */
    public async onCreateCategory() {
        const entry = new EntryCreateCL<ISkillCategories>(this, "SkillCategories");
        entry.setUseMetadataLabels(true);
        entry.setPropertyOrder(this.categoryPropOrder);
        entry.setExcludedProperties(["ID", "createdAt", "createdBy", "modifiedAt", "modifiedBy"]);
        entry.setFormTitle(this.getResourceBundleText("createCategory"));
        
        entry.attachSubmitCompleted(async () => {
            (this.byId("stCategories") as SmartTable).rebindTable(true);
            entry.closeAndDestroyEntryDialog();
        });

        this.manualEntryCreateCat = entry;
        await this.manualEntryCreateCat.createNewEntry();
    }

    public async onUpdateCategory() {
        const table = this.byId("tblCategories") as Table;
        const selectedItem = table.getSelectedItem();
        if (!selectedItem) { return; }

        const context = selectedItem.getBindingContext() as Context;
        const entry = new EntryUpdateCL<ISkillCategories>(this, { entityPath: "SkillCategories", initializer: context });

        entry.setUseMetadataLabels(true);
        entry.setPropertyOrder(this.categoryPropOrder);
        entry.setExcludedProperties(["ID", "createdAt", "createdBy", "modifiedAt", "modifiedBy"]);
        entry.setFormTitle(this.getResourceBundleText("updateCategory"));

        entry.attachSubmitCompleted(async () => {
            (this.byId("stCategories") as SmartTable).rebindTable(true);
            entry.closeAndDestroyEntryDialog();
            this.setCategoryButtonsState(false);
            table.removeSelections(true);
        });

        this.manualEntryUpdateCat = entry;
        await this.manualEntryUpdateCat.updateEntry();
    }

    public onDeleteCategory(): void {
        const table = this.byId("tblCategories") as Table;
        const selectedItem = table.getSelectedItem();
        if (!selectedItem) { return; }
        
        const context = selectedItem.getBindingContext() as Context;
        const entry = new EntryDeleteCL(this, { entityPath: "SkillCategories", initializer: context });
        
        entry.attachDeleteCompleted(() => {
            (this.byId("stCategories") as SmartTable).rebindTable(true);
            this.setCategoryButtonsState(false);
            table.removeSelections(true);
        });

        entry.deleteEntry();
    }

    public onCategorySelectionChange(event: ListItemBase$PressEvent): void {
        const table = event.getSource() as unknown as Table;
        this.setCategoryButtonsState(!!table.getSelectedItem());
    }

    /* Proficiency Levels CRUD */
    public async onCreateProficiencyLevel() {
        const entry = new EntryCreateCL<IProficiencyLevels>(this, "ProficiencyLevels");
        entry.setUseMetadataLabels(true);
        entry.setPropertyOrder(this.profPropOrder);
        entry.setExcludedProperties(["ID", "createdAt", "createdBy", "modifiedAt", "modifiedBy"]);
        entry.setFormTitle(this.getResourceBundleText("createProficiencyLevel"));
        
        entry.attachSubmitCompleted(async () => {
            (this.byId("stProficiencyLevels") as SmartTable).rebindTable(true);
            entry.closeAndDestroyEntryDialog();
        });

        this.manualEntryCreateProf = entry;
        await this.manualEntryCreateProf.createNewEntry();
    }

    public async onUpdateProficiencyLevel() {
        const table = this.byId("tblProficiencyLevels") as Table;
        const selectedItem = table.getSelectedItem();
        if (!selectedItem) { return; }

        const context = selectedItem.getBindingContext() as Context;
        const entry = new EntryUpdateCL<IProficiencyLevels>(this, { entityPath: "ProficiencyLevels", initializer: context });

        entry.setUseMetadataLabels(true);
        entry.setPropertyOrder(this.profPropOrder);
        entry.setExcludedProperties(["ID", "createdAt", "createdBy", "modifiedAt", "modifiedBy"]);
        entry.setFormTitle(this.getResourceBundleText("updateProficiencyLevel"));

        entry.attachSubmitCompleted(async () => {
            (this.byId("stProficiencyLevels") as SmartTable).rebindTable(true);
            entry.closeAndDestroyEntryDialog();
            this.setProfButtonsState(false);
            table.removeSelections(true);
        });

        this.manualEntryUpdateProf = entry;
        await this.manualEntryUpdateProf.updateEntry();
    }

    public onDeleteProficiencyLevel(): void {
        const table = this.byId("tblProficiencyLevels") as Table;
        const selectedItem = table.getSelectedItem();
        if (!selectedItem) { return; }
        
        const context = selectedItem.getBindingContext() as Context;
        const entry = new EntryDeleteCL(this, { entityPath: "ProficiencyLevels", initializer: context });
        
        entry.attachDeleteCompleted(() => {
            (this.byId("stProficiencyLevels") as SmartTable).rebindTable(true);
            this.setProfButtonsState(false);
            table.removeSelections(true);
        });

        entry.deleteEntry();
    }

    public onProficiencyLevelSelectionChange(event: ListItemBase$PressEvent): void {
        const table = event.getSource() as unknown as Table;
        this.setProfButtonsState(!!table.getSelectedItem());
    }

    /* Skill Requests MVP Logic */
    public onSkillRequestSelectionChange(event: ListItemBase$PressEvent): void {
        const table = event.getSource() as unknown as Table;
        this.setSkillRequestButtonsState(!!table.getSelectedItem());
    }

    public onApproveRequest(): void {
        const table = this.byId("tblSkillRequests") as Table;
        const selectedItem = table.getSelectedItem();
        if (!selectedItem) { return; }
        
        const context = selectedItem.getBindingContext() as Context;
        const requestID = context.getProperty("ID");
        const oDataModel = this.getComponentModel() as any;

        oDataModel.callFunction("/approveSkillRequest", {
            method: "POST",
            urlParameters: { requestID },
            success: () => {
                MessageBox.success(this.getResourceBundleText("approveRequestSuccess") || "Skill request approved.");
                (this.byId("stSkillRequests") as SmartTable).rebindTable(true);
                this.setSkillRequestButtonsState(false);
                table.removeSelections(true);
            },
            error: () => this.openMessagePopover()
        });
    }

    public onRejectRequest(): void {
        const table = this.byId("tblSkillRequests") as Table;
        const selectedItem = table.getSelectedItem();
        if (!selectedItem) { return; }
        
        const context = selectedItem.getBindingContext() as Context;
        const requestID = context.getProperty("ID");
        const oDataModel = this.getComponentModel() as any;

        const textArea = new TextArea({ width: "100%", placeholder: "Rejection Reason", required: true });

        const dialog: Dialog = new Dialog({
            title: "Reject Skill Request",
            content: [textArea],
            beginButton: new Button({
                type: ButtonType.Reject,
                text: "Reject",
                press: () => {
                    const reason = textArea.getValue();
                    if (!reason) {
                        textArea.setValueState("Error");
                        return;
                    }
                    dialog.setBusy(true);
                    oDataModel.callFunction("/rejectSkillRequest", {
                        method: "POST",
                        urlParameters: { requestID, reason },
                        success: () => {
                            dialog.setBusy(false);
                            dialog.close();
                            MessageBox.success("Skill request rejected.");
                            (this.byId("stSkillRequests") as SmartTable).rebindTable(true);
                            this.setSkillRequestButtonsState(false);
                            table.removeSelections(true);
                        },
                        error: () => {
                            dialog.setBusy(false);
                            dialog.close();
                            this.openMessagePopover();
                        }
                    });
                }
            }),
            endButton: new Button({
                text: "Cancel",
                press: () => dialog.close()
            }),
            afterClose: () => dialog.destroy()
        });

        dialog.open();
    }

    /* IPage Implementation */
    public onObjectMatched(): void {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
    }

    public onODataRequestFail(_event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    private setCategoryButtonsState(enabled: boolean): void {
        (this.byId("btnUpdateCategory") as Button).setEnabled(enabled);
        (this.byId("btnDeleteCategory") as Button).setEnabled(enabled);
    }

    private setProfButtonsState(enabled: boolean): void {
        (this.byId("btnUpdateProficiencyLevel") as Button).setEnabled(enabled);
        (this.byId("btnDeleteProficiencyLevel") as Button).setEnabled(enabled);
    }

    private setSkillRequestButtonsState(enabled: boolean): void {
        (this.byId("btnApproveRequest") as Button).setEnabled(enabled);
        (this.byId("btnRejectRequest") as Button).setEnabled(enabled);
    }
}