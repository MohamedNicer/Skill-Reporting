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
  const ODataReadCL = ODataCL.extend("ui5.antares.odata.v2.ODataReadCL", {
    constructor: function _constructor(controller, entityPath, modelName) {
      ODataCL.prototype.constructor.call(this, controller, entityPath, ODataMethods.READ, modelName);
      this.filters = [];
      this.sorters = [];
    },
    setFilters: function _setFilters(filters) {
      this.filters = filters;
    },
    addFilter: function _addFilter(filter) {
      this.filters.push(filter);
    },
    getFilters: function _getFilters() {
      return this.filters;
    },
    setSorters: function _setSorters(sorters) {
      this.sorters = sorters;
    },
    addSorter: function _addSorter(sorter) {
      this.sorters.push(sorter);
    },
    getSorters: function _getSorters() {
      return this.sorters;
    },
    setUrlParameters: function _setUrlParameters(urlParameters) {
      this.urlParameters = urlParameters;
    },
    getUrlParameters: function _getUrlParameters() {
      return this.urlParameters;
    },
    getResponse: function _getResponse() {
      return this.response;
    },
    read: function _read() {
      const oDataModel = this.getODataModel();
      return new Promise((resolve, reject) => {
        oDataModel.read(this.getEntityPath(), {
          filters: this.filters,
          sorters: this.sorters,
          urlParameters: this.urlParameters,
          success: (responseData, response) => {
            this.response = response;
            resolve(responseData.results);
          },
          error: error => {
            reject(error);
          }
        });
      });
    },
    readByKey: function _readByKey(keys) {
      const oDataModel = this.getODataModel();
      const path = oDataModel.createKey(this.getEntityPath(), keys);
      return new Promise((resolve, reject) => {
        oDataModel.read(path, {
          urlParameters: this.urlParameters,
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
  return ODataReadCL;
});
