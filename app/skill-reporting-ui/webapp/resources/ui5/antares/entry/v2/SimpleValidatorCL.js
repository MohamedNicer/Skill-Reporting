"use strict";

sap.ui.define(["sap/m/CheckBox", "sap/m/DatePicker", "sap/m/DateTimePicker", "sap/m/Input", "sap/m/Label", "sap/ui/base/Object", "sap/ui/core/Title"], function (CheckBox, DatePicker, DateTimePicker, Input, Label, BaseObject, Title) {
  "use strict";

  /**
   * @namespace ui5.antares.entry.v2
   */
  const SimpleValidatorCL = BaseObject.extend("ui5.antares.entry.v2.SimpleValidatorCL", {
    constructor: function _constructor(simpleFormElements, customControls, validationLogics, mandatoryErrorMessage) {
      BaseObject.prototype.constructor.call(this);
      this.simpleFormElements = simpleFormElements;
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
      for (const element of this.simpleFormElements) {
        const customControlData = element.getCustomData().find(data => data.getKey() === "UI5AntaresCustomControlName");
        if (customControlData) {
          this.customControlValidation(customControlData, validation);
        } else {
          this.standardControlValidation(element, validation);
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
      if (control instanceof CheckBox || control instanceof Label || control instanceof Title) {
        return;
      }
      const standardControlName = control.getCustomData().find(data => data.getKey() === "UI5AntaresStandardControlName");
      if (control instanceof Input) {
        this.inputValidation(control, validation, standardControlName);
      } else if (control instanceof DatePicker) {
        this.datePickerValidation(control, validation, standardControlName);
      } else if (control instanceof DateTimePicker) {
        this.dateTimePickerValidation(control, validation, standardControlName);
      }
    },
    inputValidation: function _inputValidation(input, validation, standardControlName) {
      if (input.getRequired() && !input.getValue()) {
        input.setValueState("Error");
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
      const standardControlType = input.getCustomData().find(data => data.getKey() === "UI5AntaresStandardControlType");
      if (!standardControlType) {
        return;
      }
      if (!validator.validate(input.getValue() || "", standardControlType.getValue())) {
        validation.validated = false;
        validation.type = "VALIDATION";
        validation.message = validator.getValidationMessage();
      }
    },
    datePickerValidation: function _datePickerValidation(datePicker, validation, standardControlName) {
      if (datePicker.getRequired() && !datePicker.getDateValue()) {
        datePicker.setValueState("Error");
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
      const standardControlType = datePicker.getCustomData().find(data => data.getKey() === "UI5AntaresStandardControlType");
      if (!standardControlType) {
        return;
      }
      if (!validator.validate(datePicker.getDateValue() || "", standardControlType.getValue())) {
        validation.validated = false;
        validation.type = "VALIDATION";
        validation.message = validator.getValidationMessage();
      }
    },
    dateTimePickerValidation: function _dateTimePickerValidation(dateTimePicker, validation, standardControlName) {
      if (dateTimePicker.getRequired() && !dateTimePicker.getDateValue()) {
        dateTimePicker.setValueState("Error");
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
      const standardControlType = dateTimePicker.getCustomData().find(data => data.getKey() === "UI5AntaresStandardControlType");
      if (!standardControlType) {
        return;
      }
      if (!validator.validate(dateTimePicker.getDateValue() || "", standardControlType.getValue())) {
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
  return SimpleValidatorCL;
});
