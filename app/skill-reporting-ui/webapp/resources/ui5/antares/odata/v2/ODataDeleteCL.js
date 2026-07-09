"use strict";

sap.ui.define(["ui5/antares/odata/v2/ODataCL", "ui5/antares/types/odata/enums"], function (__ODataCL, __ui5_antares_types_odata_enums) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ODataCL = _interopRequireDefault(__ODataCL);
  const ODataMethods = __ui5_antares_types_odata_enums["ODataMethods"];
  /**
   * @namespace ui5.antares.odata.v2
   */
  const ODataDeleteCL = ODataCL.extend("ui5.antares.odata.v2.ODataDeleteCL", {
    constructor: function _constructor(controller, entityPath, modelName) {
      ODataCL.prototype.constructor.call(this, controller, entityPath, ODataMethods.DELETE, modelName);
      this.refreshAfterChange = true;
    },
    setUrlParameters: function _setUrlParameters(urlParameters) {
      this.urlParameters = urlParameters;
    },
    getUrlParameters: function _getUrlParameters() {
      return this.urlParameters;
    },
    setRefreshAfterChange: function _setRefreshAfterChange(refreshAfterChange) {
      this.refreshAfterChange = refreshAfterChange;
    },
    getRefreshAfterChange: function _getRefreshAfterChange() {
      return this.refreshAfterChange;
    },
    getResponse: function _getResponse() {
      return this.response;
    },
    delete: function _delete(keys) {
      const oDataModel = this.getODataModel();
      const path = oDataModel.createKey(this.getEntityPath(), keys);
      return new Promise((resolve, reject) => {
        oDataModel.remove(path, {
          urlParameters: this.urlParameters,
          refreshAfterChange: this.refreshAfterChange,
          success: (responseData, response) => {
            this.response = response;
            resolve(responseData);
          },
          error: error => {
            reject(error);
          }
        });
      });
    }
  });
  return ODataDeleteCL;
});
