"use strict";

sap.ui.define(["sap/ui/base/Object", "sap/ui/core/mvc/Controller", "sap/ui/model/resource/ResourceModel"], function (BaseObject, Controller, ResourceModel) {
  "use strict";

  /**
   * @namespace ui5.antares.base.v2
   */
  const ModelCL = BaseObject.extend("ui5.antares.base.v2.ModelCL", {
    constructor: function _constructor(controller, modelName) {
      BaseObject.prototype.constructor.call(this);
      this.controller = controller;
      this.modelName = modelName;
      if (controller instanceof Controller) {
        this.sourceView = controller.getView();
        this.ownerComponent = controller.getOwnerComponent();
      } else {
        this.ownerComponent = controller;
      }
      const resourceModel = this.ownerComponent.getModel("i18n");
      if (resourceModel instanceof ResourceModel) {
        this.resourceBundle = resourceModel.getResourceBundle();
        this.resourceModel = resourceModel;
      }
      this.oDataModel = this.ownerComponent.getModel(this.modelName);
      this.bindingMode = this.oDataModel.getDefaultBindingMode();
      this.uiRouter = this.ownerComponent.getRouter();
      this.uiTargets = this.ownerComponent.getTargets();
      this.setMetadataUrl();
    },
    getSourceController: function _getSourceController() {
      return this.controller;
    },
    getSourceView: function _getSourceView() {
      return this.sourceView;
    },
    getSourceOwnerComponent: function _getSourceOwnerComponent() {
      return this.ownerComponent;
    },
    getODataModel: function _getODataModel() {
      return this.oDataModel;
    },
    getMetadataUrl: function _getMetadataUrl() {
      return this.metadataUrl;
    },
    getModelName: function _getModelName() {
      return this.modelName;
    },
    getServiceUrl: function _getServiceUrl() {
      return this.metadataUrl.split("$metadata")[0];
    },
    getResourceBundle: function _getResourceBundle() {
      return this.resourceBundle;
    },
    setOldBindingMode: function _setOldBindingMode() {
      this.oDataModel.setDefaultBindingMode(this.bindingMode);
    },
    getResourceModel: function _getResourceModel() {
      return this.resourceModel;
    },
    getUIRouter: function _getUIRouter() {
      return this.uiRouter;
    },
    getUITargets: function _getUITargets() {
      return this.uiTargets;
    },
    setMetadataUrl: function _setMetadataUrl() {
      const modelEntry = this.ownerComponent.getManifestEntry(`/sap.ui5/models/${this.modelName || ""}`);
      if (modelEntry) {
        const dataSource = this.ownerComponent.getManifestEntry(`/sap.app/dataSources/${modelEntry.dataSource}`);
        if (dataSource) {
          let manifestUrl = dataSource.uri;
          if (!manifestUrl.startsWith("/")) {
            manifestUrl = "/" + manifestUrl;
          }
          if (!manifestUrl.endsWith("/")) {
            manifestUrl = manifestUrl + "/";
          }
          this.metadataUrl = `${manifestUrl}$metadata`;
        }
      }
    }
  });
  return ModelCL;
});
