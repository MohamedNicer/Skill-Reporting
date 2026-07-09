"use strict";

sap.ui.define(["sap/ui/core/mvc/View"], function (View) {
  "use strict";

  /**
   * @namespace ui5.antares.ui.view
   */
  const UI5AntaresObjectPageView = View.extend("ui5.antares.ui.view.UI5AntaresObjectPageView", {
    getControllerName: function _getControllerName() {
      return "ui5.antares.ui.view.UI5AntaresObjectPage";
    },
    createContent: function _createContent() {
      const viewData = this.getViewData();
      return viewData.entry.getObjectPageInstance().getObjectPageLayout();
    }
  });
  return UI5AntaresObjectPageView;
});
//# sourceMappingURL=UI5AntaresObjectPageView.js.map