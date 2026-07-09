"use strict";

sap.ui.define(["sap/ui/base/Object"], function (BaseObject) {
  "use strict";

  /**
   * @namespace ui5.antares.entry.v2
   */
  const SmartValidatorCL = BaseObject.extend("ui5.antares.entry.v2.SmartValidatorCL", {
    constructor: function _constructor(groupElements, customControls, validationLogics, mandatoryErrorMessage) {
      BaseObject.prototype.constructor.call(this);
      this.groupElements = groupElements;
      this.customControls = customControls;
      this.validationLogics = validationLogics;
      this.mandatoryErrorMessage = mandatoryErrorMessage;
    },
    validate: function _validate() {
      const validation = {
        validated: true,
        message: this.mandatoryErrorMessage,
        type: "MANDATORY"
      };
      for (const element of this.groupElements) {
        const control = element.getElements()[0];
        const customControlData = control.getCustomData().find(data => data.getKey() === "UI5AntaresCustomControlName");
        if (customControlData) {
          this.customControlValidation(customControlData, validation);
        } else {
          this.standardControlValidation(control, validation);
        }
        if (!validation.validated) {
          break;
        }
      }
      return validation;
    },
    customControlValidation: function _customControlValidation(customControlData, validation) {
      const customControl = this.getCustomControl(customControlData.getValue());
      if (!customControl) {
        return;
      }
      const validator = customControl.getValidator();
      if (!validator) {
        return;
      }
      if (!validator.getValidatorMethod()) {
        throw new Error("Validator method must be provided for custom controls!");
      }
      if (!validator.validate(customControl.getControl(), "UNKNOWN")) {
        validation.validated = false;
        validation.type = "VALIDATION";
        validation.message = validator.getValidationMessage();
      }
    },
    getCustomControl: function _getCustomControl(propertyName) {
      const customControl = this.customControls.find(control => control.getPropertyName() === propertyName);
      return customControl;
    },
    standardControlValidation: function _standardControlValidation(control, validation) {
      const standardControlName = control.getCustomData().find(data => data.getKey() === "UI5AntaresStandardControlName");
      const standardControlType = control.getCustomData().find(data => data.getKey() === "UI5AntaresStandardControlType");
      if (control.getMandatory() && !control.getValue()) {
        control.setValueState("Error");
        validation.validated = false;
        validation.type = "MANDATORY";
        validation.message = this.mandatoryErrorMessage;
      }
      if (!standardControlName) {
        return;
      }
      const validator = this.getValidationLogic(standardControlName.getValue());
      if (!validator) {
        return;
      }
      if (!standardControlType) {
        return;
      }
      if (!validator.validate(control.getValue() || "", standardControlType.getValue())) {
        validation.validated = false;
        validation.type = "VALIDATION";
        validation.message = validator.getValidationMessage();
      }
    },
    getValidationLogic: function _getValidationLogic(propertyName) {
      const validationLogic = this.validationLogics.find(logic => logic.getPropertyName() === propertyName);
      return validationLogic;
    }
  });
  return SmartValidatorCL;
});
