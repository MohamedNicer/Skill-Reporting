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

// Assuming IPersonnel is updated or basic
interface IPersonnel {
    ID: string;
    firstName: string;
    lastName: string;
    email: string;
    departmentID: string;
    managerID: string;
}

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class Personnel extends BaseController implements IPage {

    public formatter = formatter;
    private manualEntryCreate: EntryCreateCL<IPersonnel>;
    private manualEntryUpdate: EntryUpdateCL<IPersonnel>;
    private readonly personnelPropOrder = [
        "firstName", "lastName", "email", "departmentID", "managerID"
    ];

    public onInit(): void {
        const page = new PageCL<Personnel>(this, Routes.PERSONNEL);
        page.initialize();
    }

    public async onCreateNewPersonnel() {
        const entry = new EntryCreateCL<IPersonnel>(this, "Personnel");
        entry.setUseMetadataLabels(true);
        entry.setPropertyOrder(this.personnelPropOrder);
        entry.setExcludedProperties(["createdAt", "createdBy", "modifiedAt", "modifiedBy", "ID"]);
        entry.setFormTitle(this.getResourceBundleText("createNewPersonnel"));
        
        entry.attachSubmitCompleted(async () => {
            (this.byId("stPersonnel") as SmartTable).rebindTable(true);
            entry.closeAndDestroyEntryDialog();
        });

        this.manualEntryCreate = entry;
        await this.manualEntryCreate.createNewEntry();
    }

    public async onUpdatePersonnel() {
        const table = this.byId("uiTblPersonnel") as Table;
        const selectedItem = table.getSelectedItem();
        if (!selectedItem) { return; }

        const context = selectedItem.getBindingContext() as Context;
        const entry = new EntryUpdateCL<IPersonnel>(this, { entityPath: "Personnel", initializer: context });

        entry.setUseMetadataLabels(true);
        entry.setPropertyOrder(this.personnelPropOrder);
        entry.setExcludedProperties(["createdAt", "createdBy", "modifiedAt", "modifiedBy", "ID"]);
        entry.setFormTitle(this.getResourceBundleText("updatePersonnel"));

        entry.attachSubmitCompleted(async () => {
            (this.byId("stPersonnel") as SmartTable).rebindTable(true);
            entry.closeAndDestroyEntryDialog();
            this.setPersonnelButtonsState(false);
            table.removeSelections(true);
        });

        this.manualEntryUpdate = entry;
        await this.manualEntryUpdate.updateEntry();
    }

    public onDeletePersonnel(): void {
        const table = this.byId("uiTblPersonnel") as Table;
        const selectedItem = table.getSelectedItem();
        if (!selectedItem) { return; }
        
        const context = selectedItem.getBindingContext() as Context;
        const entry = new EntryDeleteCL(this, { entityPath: "Personnel", initializer: context });
        
        entry.attachDeleteCompleted(() => {
            (this.byId("stPersonnel") as SmartTable).rebindTable(true);
            this.setPersonnelButtonsState(false);
            table.removeSelections(true);
        });

        entry.deleteEntry();
    }

    public onPersonnelInitialized(): void {
        const table = this.byId("uiTblPersonnel") as Table;
        table.attachSelectionChange((_event: any) => {
            this.setPersonnelButtonsState(!!table.getSelectedItem());
        });
    }

    public onObjectMatched(): void {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
        
        // MVP: Assuming all are admins for demo
        (this.byId("btnCreateNewPersonnel") as Button).setVisible(true);
        (this.byId("btnUpdatePersonnel") as Button).setVisible(true);
        (this.byId("btnDeletePersonnel") as Button).setVisible(true);
    }

    public onODataRequestFail(_event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    private setPersonnelButtonsState(enabled: boolean): void {
        (this.byId("btnUpdatePersonnel") as Button).setEnabled(enabled);
        (this.byId("btnDeletePersonnel") as Button).setEnabled(enabled);
    }
}