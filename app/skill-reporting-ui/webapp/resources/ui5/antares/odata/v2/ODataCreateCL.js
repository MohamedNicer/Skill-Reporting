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
  const ODataCreateCL = ODataCL.extend("ui5.antares.odata.v2.ODataCreateCL", {
    constructor: function _constructor(controller, entityPath, modelName) {
      ODataCL.prototype.constructor.call(this, controller, entityPath, ODataMethods.CREATE, modelName);
      this.refreshAfterChange = true;
    },
    setData: function _setData(data) {
      this.payload = data;
    },
    getData: function _getData() {
      return this.payload;
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
    createEntry: function _createEntry() {
      const oDataModel = this.getODataModel();
      const entry = oDataModel.createEntry(this.getEntityPath(), {
        properties: this.payload
      });
      return entry;
    },
    create: function _create() {
      this.checkData(this.payload);
      const oDataModel = this.getODataModel();
      return new Promise((resolve, reject) => {
        oDataModel.create(this.getEntityPath(), this.payload, {
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
  return ODataCreateCL;
});
