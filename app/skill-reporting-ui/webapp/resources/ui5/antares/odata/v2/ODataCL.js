"use strict";

sap.ui.define(["ui5/antares/base/v2/ModelCL"], function (__ModelCL) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ModelCL = _interopRequireDefault(__ModelCL);
  /**
   * @namespace ui5.antares.odata.v2
   */
  const ODataCL = ModelCL.extend("ui5.antares.odata.v2.ODataCL", {
    constructor: function _constructor(controller, entityPath, method, modelName) {
      ModelCL.prototype.constructor.call(this, controller, modelName);
      this.method = method;
      this.entityPath = entityPath.startsWith("/") ? entityPath : `/${entityPath}`;
      this.entityName = this.entityPath.slice(1);
    },
    getEntityPath: function _getEntityPath() {
      return this.entityPath;
    },
    getEntityName: function _getEntityName() {
      return this.entityName;
    },
    checkData: function _checkData(data) {
      if (!data) {
        throw new Error(`No data was found! Use setData() method to execute ${this.method} operation.`);
      }
    }
  });
  return ODataCL;
});
