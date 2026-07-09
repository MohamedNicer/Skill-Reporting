"use strict";

sap.ui.define(["sap/m/MessageBox", "sap/ui/core/mvc/Controller", "ui5/antares/types/odata/enums"], function (MessageBox, Controller, __ui5_antares_types_odata_enums) {
  "use strict";

  const ODataMethods = __ui5_antares_types_odata_enums["ODataMethods"];
  /**
   * @namespace ui5.antares.ui.view
   */
  const UI5AntaresObjectPage = Controller.extend("ui5.antares.ui.view.UI5AntaresObjectPage", {
    constructor: function constructor() {
      Controller.prototype.constructor.apply(this, arguments);
      this.completeTriggered = false;
    },
    onInit: function _onInit() {
      const view = this.getView();
      const viewData = view.getViewData();
      view.addEventDelegate({
        onAfterHide: () => {
          if (!this.completeTriggered) {
            if (viewData.method === ODataMethods.DELETE) {
              const eventBus = viewData.entry.getSourceOwnerComponent().getEventBus();
              eventBus.publish("UI5AntaresEntryDelete", "UnsubscribeEvents");
            }
            viewData.entry.reset();
          }
          view.destroy();
        }
      });
      if (view.byId("UI5AntaresObjectPageCompleteButton")) {
        view.byId("UI5AntaresObjectPageCompleteButton").attachPress({}, this.onComplete, this);
      }
      view.byId("UI5AntaresObjectPageCancelButton").attachPress({}, this.onCancel, this);
    },
    onComplete: function _onComplete() {
      this.completeTriggered = true;
      const view = this.getView();
      const viewData = view.getViewData();
      if (viewData.method === ODataMethods.DELETE) {
        const eventBus = viewData.entry.getSourceOwnerComponent().getEventBus();
        eventBus.publish("UI5AntaresEntryDelete", "Complete");
        eventBus.publish("UI5AntaresEntryDelete", "UnsubscribeEvents");
      } else {
        const validation = viewData.entry.valueValidation();
        if (!validation.validated) {
          MessageBox.error(validation.message);
          return;
        }
        viewData.entry.submit();
        viewData.router.getTargets().display(viewData.entry.getFromTarget());
      }
    },
    onCancel: function _onCancel() {
      const view = this.getView();
      const viewData = view.getViewData();
      viewData.router.getTargets().display(viewData.entry.getFromTarget());
    }
  });
  return UI5AntaresObjectPage;
});
//# sourceMappingURL=UI5AntaresObjectPage.controller.js.map