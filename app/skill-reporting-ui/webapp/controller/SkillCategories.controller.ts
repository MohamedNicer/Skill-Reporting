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
import { ISkillCategories } from "../types/skill.types";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class SkillCategories extends BaseController implements IPage {

    public formatter = formatter;
    private manualEntryCreateCat: EntryCreateCL<ISkillCategories>;
    private manualEntryUpdateCat: EntryUpdateCL<ISkillCategories>;
    
    private readonly categoryPropOrder = ["name", "description", "sortOrder", "isActive"];

    public onInit(): void {
        const page = new PageCL<SkillCategories>(this, Routes.SKILL_CATEGORIES);
        page.initialize();
    }

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
}
