"use strict";

sap.ui.define(["sap/ui/base/Object", "sap/ui/core/CustomData"], function (BaseObject, CustomData) {
  "use strict";

  /**
   * @namespace ui5.antares.ui
   */
  const CustomControlCL = BaseObject.extend("ui5.antares.ui.CustomControlCL", {
    constructor: function _constructor(control, propertyName, validator) {
      BaseObject.prototype.constructor.call(this);
      this.control = control;
      this.propertyName = propertyName;
      this.validator = validator;
      this.control.addCustomData(new CustomData({
        key: "UI5AntaresCustomControlName",
        value: propertyName
      }));
    },
    getControl: function _getControl() {
      return this.control;
    },
    getPropertyName: function _getPropertyName() {
      return this.propertyName;
    },
    getValidator: function _getValidator() {
      return this.validator;
    }
  });
  return CustomControlCL;
});
