"use strict";

sap.ui.define(["sap/ui/base/Object", "ui5/antares/types/entry/enums"], function (BaseObject, __ui5_antares_types_entry_enums) {
  "use strict";

  const NamingStrategies = __ui5_antares_types_entry_enums["NamingStrategies"];
  /**
   * @namespace ui5.antares.util
   */
  const Util = BaseObject.extend("ui5.antares.util.Util", {});
  Util.getGeneratedLabel = function getGeneratedLabel(property, namingStrategy) {
    let label = property;
    switch (namingStrategy) {
      case NamingStrategies.CAMEL_CASE:
        label = this.getCamelCaseLabel(property);
        break;
      case NamingStrategies.CONSTANT_CASE:
        label = this.getConstantCaseLabel(property);
        break;
      case NamingStrategies.KEBAB_CASE:
        label = this.getKebabCaseLabel(property);
        break;
      case NamingStrategies.PASCAL_CASE:
        label = this.getPascalCaseLabel(property);
        break;
      case NamingStrategies.SNAKE_CASE:
        label = this.getSnakeCaseLabel(property);
        break;
    }
    return label;
  };
  Util.getCamelCaseLabel = function getCamelCaseLabel(name) {
    return name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, function (str) {
      return str.toUpperCase();
    });
  };
  Util.getPascalCaseLabel = function getPascalCaseLabel(name) {
    return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b(Id|Uid|Url)\b/g, function (match) {
      return match.toUpperCase();
    }).replace(/^./, function (str) {
      return str.toUpperCase();
    });
  };
  Util.getSnakeCaseLabel = function getSnakeCaseLabel(name) {
    return name.replace(/_/g, " ").replace(/\b\w/g, function (str) {
      return str.toUpperCase();
    });
  };
  Util.getConstantCaseLabel = function getConstantCaseLabel(name) {
    return name.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, function (str) {
      return str.toUpperCase();
    });
  };
  Util.getKebabCaseLabel = function getKebabCaseLabel(name) {
    return name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };
  return Util;
});
