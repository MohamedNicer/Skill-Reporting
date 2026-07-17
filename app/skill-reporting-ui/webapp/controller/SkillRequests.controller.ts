import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IPage } from "../util/common/common.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import formatter from "com/ndbs/skillreportingui/model/formatter";
import PageCL from "com/ndbs/skillreportingui/util/common/PageCL";
import { Routes } from "../types/global.types";
import Table from "sap/m/Table";
import SmartTable from "sap/ui/comp/smarttable/SmartTable";
import Context from "sap/ui/model/Context";
import Button from "sap/m/Button";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import MessageBox from "sap/m/MessageBox";
import Dialog from "sap/m/Dialog";
import TextArea from "sap/m/TextArea";
import { ButtonType } from "sap/m/library";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class SkillRequests extends BaseController implements IPage {

    public formatter = formatter;

    public onInit(): void {
        const page = new PageCL<SkillRequests>(this, Routes.SKILL_REQUESTS);
        page.initialize();
    }

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

    private setSkillRequestButtonsState(enabled: boolean): void {
        (this.byId("btnApproveRequest") as Button).setEnabled(enabled);
        (this.byId("btnRejectRequest") as Button).setEnabled(enabled);
    }
}
