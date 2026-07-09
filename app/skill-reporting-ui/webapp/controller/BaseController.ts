import ResourceBundle from "sap/base/i18n/ResourceBundle";
import UIComponent from "sap/ui/core/UIComponent";
import Controller from "sap/ui/core/mvc/Controller";
import Router from "sap/ui/core/routing/Router";
import Model from "sap/ui/model/Model";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { DefaultMessages } from "../types/global.types";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import View from "sap/ui/core/mvc/View";
import Button from "sap/m/Button";
import Messaging from "sap/ui/core/Messaging";
import { Button$PressEvent as ButtonPressEvent } from "sap/m/Button";
import FragmentCL from "ui5/antares/ui/FragmentCL";
import UI5Element from "sap/ui/core/Element";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class BaseController extends Controller {

    /* ======================================================================================================================= */
    /* Global Methods                                                                                                          */
    /* ======================================================================================================================= */

    public getODataModel(modelName?: string): ODataModel {
        return (this.getView() as View).getModel(modelName) as ODataModel;
    }

    public getComponentModel(modelName?: string): ODataModel {
        return (this.getOwnerComponent() as UIComponent).getModel(modelName) as ODataModel;
    }

    public getRouter(): Router {
        return (this.getOwnerComponent() as UIComponent).getRouter();
    }

    public getModel(modelName?: string): Model | undefined {
        return (this.getView() as View).getModel(modelName);
    }

    public setModel(oModel: Model, modelName?: string): void {
        (this.getView() as View).setModel(oModel, modelName);
    }

    public getResourceBundle(): ResourceBundle {
        return (((this.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle);
    }

    public getCurrentView(): View {
        return this.getView() as View;
    }

     public getById<T extends UI5Element = UI5Element>(id: string) {
        const element = this.getCurrentView().byId(id);

        if (!element) {
            throw new Error(`The UI5 Element with the following id was not found: ${id}`);
        }

        return element as T;
    }

    public getResourceBundleText(key: string, parameters?: any[]): string {
        const resourceBundle = this.getResourceBundle();
        return resourceBundle.getText(key, parameters, true) || DefaultMessages.NO_I18N_TEXT;
    }

    /* ======================================================================================================================= */
    /* Common Event Handlers through all the pages                                                                             */
    /* ======================================================================================================================= */

    public onNavToView(target: string): void {
        this.getRouter().navTo(target);
    }

    public openMessagePopover(): void {
        const view = this.getView() as View;
        (view.byId("btnMessages") as Button).firePress();
    }

    public onMessagePopoverPress(event: ButtonPressEvent): void {
        const fragment = new FragmentCL(this, "com.ndbs.skillreportingui.fragments.common.MessagePopover", event.getSource());
        fragment.openAsync(true);
    }

    public onClearMessages(): void {
        Messaging.removeAllMessages();
    }
} 