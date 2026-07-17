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
export default class ProficiencyLevels extends BaseController implements IPage {

    public formatter = formatter;
    private manualEntryCreateProf: EntryCreateCL<IProficiencyLevels>;
    private manualEntryUpdateProf: EntryUpdateCL<IProficiencyLevels>;
    
    private readonly profPropOrder = ["categoryID", "code", "label", "scaleType", "rank", "isActive"];

    public onInit(): void {
        const page = new PageCL<ProficiencyLevels>(this, Routes.PROFICIENCY_LEVELS);
        page.initialize();
    }

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

    /* IPage Implementation */
    public onObjectMatched(): void {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
    }

    public onODataRequestFail(_event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    private setProfButtonsState(enabled: boolean): void {
        (this.byId("btnUpdateProficiencyLevel") as Button).setEnabled(enabled);
        (this.byId("btnDeleteProficiencyLevel") as Button).setEnabled(enabled);
    }
}
