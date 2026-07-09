"use strict";

sap.ui.define([], function () {
  "use strict";

  var FormTypes = /*#__PURE__*/function (FormTypes) {
    FormTypes["SMART"] = "SMART";
    FormTypes["SIMPLE"] = "SIMPLE";
    return FormTypes;
  }(FormTypes || {});
  var NamingStrategies = /*#__PURE__*/function (NamingStrategies) {
    NamingStrategies["CAMEL_CASE"] = "CAMEL_CASE";
    NamingStrategies["PASCAL_CASE"] = "PASCAL_CASE";
    NamingStrategies["KEBAB_CASE"] = "KEBAB_CASE";
    NamingStrategies["SNAKE_CASE"] = "SNAKE_CASE";
    NamingStrategies["CONSTANT_CASE"] = "CONSTANT_CASE";
    return NamingStrategies;
  }(NamingStrategies || {});
  var DialogStrategies = /*#__PURE__*/function (DialogStrategies) {
    DialogStrategies["CREATE"] = "CREATE";
    DialogStrategies["LOAD"] = "LOAD";
    return DialogStrategies;
  }(DialogStrategies || {});
  var GuidStrategies = /*#__PURE__*/function (GuidStrategies) {
    GuidStrategies["ONLY_KEY"] = "ONLY_KEY";
    GuidStrategies["ONLY_NON_KEY"] = "ONLY_NON_KEY";
    GuidStrategies["ALL"] = "ALL";
    GuidStrategies["NONE"] = "NONE";
    return GuidStrategies;
  }(GuidStrategies || {});
  var __exports = {
    __esModule: true
  };
  __exports.FormTypes = FormTypes;
  __exports.NamingStrategies = NamingStrategies;
  __exports.DialogStrategies = DialogStrategies;
  __exports.GuidStrategies = GuidStrategies;
  return __exports;
});
