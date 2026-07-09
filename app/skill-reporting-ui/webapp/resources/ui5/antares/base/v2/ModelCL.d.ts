declare module "ui5/antares/base/v2/ModelCL" {
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import BaseObject from "sap/ui/base/Object";
    import UIComponent from "sap/ui/core/UIComponent";
    import Controller from "sap/ui/core/mvc/Controller";
    import View from "sap/ui/core/mvc/View";
    import Router from "sap/ui/core/routing/Router";
    import Targets from "sap/ui/core/routing/Targets";
    import ODataModel from "sap/ui/model/odata/v2/ODataModel";
    import ResourceModel from "sap/ui/model/resource/ResourceModel";
    /**
     * @namespace ui5.antares.base.v2
     */
    export default abstract class ModelCL extends BaseObject {
        private controller;
        private sourceView?;
        private ownerComponent;
        private oDataModel;
        private metadataUrl;
        private modelName?;
        private resourceBundle?;
        private bindingMode;
        private resourceModel?;
        private uiRouter;
        private uiTargets;
        constructor(controller: Controller | UIComponent, modelName?: string);
        protected getSourceController(): Controller | UIComponent;
        protected getSourceView(): View | undefined;
        getSourceOwnerComponent(): UIComponent;
        protected getODataModel(): ODataModel;
        protected getMetadataUrl(): string;
        protected getModelName(): string | undefined;
        protected getServiceUrl(): string;
        protected getResourceBundle(): ResourceBundle | undefined;
        protected setOldBindingMode(): void;
        protected getResourceModel(): ResourceModel | undefined;
        protected getUIRouter(): Router;
        protected getUITargets(): Targets;
        private setMetadataUrl;
    }
}
