"use strict";

sap.ui.define(["sap/ui/base/Object"], function (BaseObject) {
  "use strict";

  /**
   * @namespace ui5.antares.entry.v2
   */
  const ResponseCL = BaseObject.extend("ui5.antares.entry.v2.ResponseCL", {
    constructor: function _constructor(response, statusCode) {
      BaseObject.prototype.constructor.call(this);
      this.statusCode = statusCode;
      this.response = response;
    },
    getStatusCode: function _getStatusCode() {
      return this.statusCode;
    },
    getResponse: function _getResponse() {
      return this.response;
    }
  });
  return ResponseCL;
});
