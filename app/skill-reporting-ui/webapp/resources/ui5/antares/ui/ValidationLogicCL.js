"use strict";

sap.ui.define(["sap/ui/base/Object", "ui5/antares/types/ui/enums", "sap/ui/core/Control", "sap/ui/core/format/NumberFormat", "sap/m/MessageBox", "sap/ui/core/date/UI5Date"], function (BaseObject, __ui5_antares_types_ui_enums, Control, NumberFormat, MessageBox, UI5Date) {
  "use strict";

  const ValidationOperator = __ui5_antares_types_ui_enums["ValidationOperator"];
  /**
   * @namespace ui5.antares.ui
   */
  const ValidationLogicCL = BaseObject.extend("ui5.antares.ui.ValidationLogicCL", {
    constructor: function _constructor(settings) {
      BaseObject.prototype.constructor.call(this);
      this.stringMethods = [ValidationOperator.Contains, ValidationOperator.EndsWith, ValidationOperator.NotContains, ValidationOperator.NotEndsWith, ValidationOperator.NotStartsWith, ValidationOperator.StartsWith];
      this.numberTypes = ["Edm.Decimal", "Edm.Double", "Edm.Int16", "Edm.Int32", "Edm.Int64"];
      this.propertyName = settings.propertyName;
      this.validator = settings.validator;
      this.listener = settings.listener;
      this.value1 = settings.value1;
      this.value2 = settings.value2;
      this.operator = settings.operator || ValidationOperator.EQ;
      this.message = settings.message || `Validation failed for ${this.propertyName}`;
      this.showMessageBox = settings.showMessageBox || true;
      this.invalidValueMessage = settings.invalidValueMessage || `Invalid value for ${this.propertyName}`;
    },
    getPropertyName: function _getPropertyName() {
      return this.propertyName;
    },
    getValidationMessage: function _getValidationMessage() {
      return this.message;
    },
    getValidatorMethod: function _getValidatorMethod() {
      return this.validator;
    },
    validate: function _validate(value, type) {
      if (this.validator) {
        return this.validator.call(this.listener || this, value);
      }
      if (value instanceof Control) {
        throw new Error("Validator method must be provided.");
      }
      this.valueControl(value);
      const correctedValues = this.valueCorrection(value, type);
      switch (this.operator) {
        case ValidationOperator.BT:
          return correctedValues.originalValue >= correctedValues.value1 && correctedValues.originalValue <= correctedValues.value2;
        case ValidationOperator.Contains:
          return correctedValues.originalValue.includes(correctedValues.value1);
        case ValidationOperator.EndsWith:
          return correctedValues.originalValue.endsWith(correctedValues.value1);
        case ValidationOperator.GE:
          return correctedValues.originalValue >= correctedValues.value1;
        case ValidationOperator.GT:
          return correctedValues.originalValue > correctedValues.value1;
        case ValidationOperator.LE:
          return correctedValues.originalValue <= correctedValues.value1;
        case ValidationOperator.LT:
          return correctedValues.originalValue < correctedValues.value1;
        case ValidationOperator.NB:
          return !(correctedValues.originalValue >= correctedValues.value1 && correctedValues.originalValue <= correctedValues.value2);
        case ValidationOperator.NE:
          return correctedValues.originalValue !== correctedValues.value1;
        case ValidationOperator.NotContains:
          return !correctedValues.originalValue.includes(correctedValues.value1);
        case ValidationOperator.NotEndsWith:
          return !correctedValues.originalValue.endsWith(correctedValues.value1);
        case ValidationOperator.NotStartsWith:
          return !correctedValues.originalValue.startsWith(correctedValues.value1);
        case ValidationOperator.StartsWith:
          return correctedValues.originalValue.startsWith(correctedValues.value1);
        default:
          return correctedValues.originalValue === correctedValues.value1;
      }
    },
    valueControl: function _valueControl(value) {
      if ((this.operator === ValidationOperator.BT || this.operator === ValidationOperator.NB) && (this.value1 == null || this.value2 == null)) {
        throw new Error("value1 and value2 must be set with ValidationOperator.BT and ValidationOperator.NB");
      }
      if (this.value1 == null) {
        throw new Error("value1 must be set.");
      }
      if (this.stringMethods.includes(this.operator) && (typeof this.value1 !== "string" || typeof value !== "string")) {
        throw new Error(`Following operators can only be used with a string type: ${this.stringMethods.join(", ")}`);
      }
    },
    valueCorrection: function _valueCorrection(value, type) {
      const correctedValues = {
        originalValue: value,
        value1: this.value1,
        value2: this.value2
      };
      if (type === "UNKNOWN") {
        return correctedValues;
      }
      if (this.numberTypes.includes(type)) {
        this.numberCorrection(correctedValues);
      } else if (type === "Edm.DateTime" || type === "Edm.DateTimeOffset") {
        this.dateCorrection(correctedValues);
      }
      return correctedValues;
    },
    numberCorrection: function _numberCorrection(correctedValues) {
      this.numberPropertyCorrection(correctedValues);
      this.numberValue1Correction(correctedValues);
      this.numberValue2Correction(correctedValues);
    },
    numberPropertyCorrection: function _numberPropertyCorrection(correctedValues) {
      if (!(typeof correctedValues.originalValue === "number")) {
        const float = NumberFormat.getFloatInstance();
        const parsedValue = float.parse(correctedValues.originalValue);
        if (typeof parsedValue === "number") {
          if (isNaN(parsedValue)) {
            this.showErrorMessageBox();
            throw new Error(`Invalid number for property: ${this.propertyName}`);
          }
          correctedValues.originalValue = parsedValue;
        } else {
          this.showErrorMessageBox();
          throw new Error(`Invalid number for property: ${this.propertyName}`);
        }
      }
    },
    numberValue1Correction: function _numberValue1Correction(correctedValues) {
      if (!(typeof correctedValues.value1 === "number")) {
        const float = NumberFormat.getFloatInstance();
        const parsedValue = float.parse(correctedValues.value1);
        if (typeof parsedValue === "number") {
          if (isNaN(parsedValue)) {
            throw new Error(`Invalid number for property: ${this.propertyName}`);
          }
          correctedValues.value1 = parsedValue;
        } else {
          throw new Error(`Invalid number for property: ${this.propertyName}`);
        }
      }
    },
    numberValue2Correction: function _numberValue2Correction(correctedValues) {
      if (!correctedValues.value2) {
        return correctedValues;
      }
      if (!(typeof correctedValues.value2 === "number")) {
        const float = NumberFormat.getFloatInstance();
        const parsedValue = float.parse(correctedValues.value2);
        if (typeof parsedValue === "number") {
          if (isNaN(parsedValue)) {
            throw new Error(`Invalid number for property: ${this.propertyName}`);
          }
          correctedValues.value2 = parsedValue;
        } else {
          throw new Error(`Invalid number for property: ${this.propertyName}`);
        }
      }
    },
    dateCorrection: function _dateCorrection(correctedValues) {
      this.datePropertyCorrection(correctedValues);
      this.dateValue1Correction(correctedValues);
      this.dateValue2Correction(correctedValues);
    },
    datePropertyCorrection: function _datePropertyCorrection(correctedValues) {
      if (correctedValues.originalValue instanceof UI5Date || correctedValues.originalValue instanceof Date) {
        return;
      }
      const correctedDate = new Date(correctedValues.originalValue);
      if (!isNaN(correctedDate.getTime())) {
        correctedValues.originalValue = correctedDate;
        return;
      }
      this.showErrorMessageBox();
      throw new Error(`Invalid date for property: ${this.propertyName}`);
    },
    dateValue1Correction: function _dateValue1Correction(correctedValues) {
      if (correctedValues.value1 instanceof UI5Date || correctedValues.value1 instanceof Date) {
        return;
      }
      throw new Error(`value1 must be an instance of Date or UI5Date for property ${this.propertyName}`);
    },
    dateValue2Correction: function _dateValue2Correction(correctedValues) {
      if (!correctedValues.value2) {
        return;
      }
      if (correctedValues.value2 instanceof UI5Date || correctedValues.value2 instanceof Date) {
        return;
      }
      throw new Error(`value1 must be an instance of Date or UI5Date for property ${this.propertyName}`);
    },
    showErrorMessageBox: function _showErrorMessageBox() {
      if (this.showMessageBox) {
        MessageBox.error(this.invalidValueMessage);
      }
    }
  });
  return ValidationLogicCL;
});
