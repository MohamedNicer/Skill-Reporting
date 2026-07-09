"use strict";

sap.ui.define(["ui5/antares/base/v2/ModelCL", "ui5/antares/util/Util"], function (__ModelCL, __Util) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ModelCL = _interopRequireDefault(__ModelCL);
  const Util = _interopRequireDefault(__Util);
  /**
   * @namespace ui5.antares.entity.v2
   */
  const EntityCL = ModelCL.extend("ui5.antares.entity.v2.EntityCL", {
    constructor: function _constructor(controller, entityName, resourceBundlePrefix, namingStrategy, modelName) {
      ModelCL.prototype.constructor.call(this, controller, modelName);
      this.entityName = entityName;
      this.resourceBundlePrefix = resourceBundlePrefix;
      this.namingStrategy = namingStrategy;
      this.metaModel = this.getODataModel().getMetaModel();
    },
    getEntityName: function _getEntityName() {
      return this.entityName;
    },
    getMetaModel: function _getMetaModel() {
      return this.metaModel;
    },
    getEntityType: async function _getEntityType() {
      try {
        const entitySet = await this.getEntitySet();
        const entityType = this.metaModel.getODataEntityType(entitySet.entityType);
        if (!entityType) {
          throw new Error(`${entitySet.entityType} EntityType was not found in the OData metadata!`);
        }
        return entityType;
      } catch (error) {
        throw error;
      }
    },
    getEntitySet: function _getEntitySet() {
      return new Promise((resolve, reject) => {
        this.metaModel.loaded().then(() => {
          const entitySet = this.metaModel.getODataEntitySet(this.entityName);
          if (!entitySet) {
            reject(`${this.entityName} EntitySet was not found in the OData metadata!`);
          }
          resolve(entitySet);
        });
      });
    },
    getEntityTypeKeys: async function _getEntityTypeKeys() {
      const entityType = await this.getEntityType();
      const entityTypeProperties = await this.getEntityTypeProperties();
      return entityType.key.propertyRef.map(key => {
        const entityTypeProperty = entityTypeProperties.find(prop => prop.propertyName === key.name);
        const property = {
          propertyName: key.name,
          propertyType: entityTypeProperty.propertyType,
          nullable: entityTypeProperty.nullable,
          precision: entityTypeProperty.precision,
          scale: entityTypeProperty.scale,
          annotationLabel: entityTypeProperty.annotationLabel,
          displayFormat: entityTypeProperty.displayFormat
        };
        return property;
      });
    },
    getEntityTypeProperties: async function _getEntityTypeProperties() {
      const entityType = await this.getEntityType();
      if (!entityType.property) {
        throw new Error(`${entityType.name} EntityType has no property in the OData metadata!`);
      }
      return entityType.property.map(prop => {
        const property = {
          propertyName: prop.name,
          propertyType: prop.type,
          nullable: prop.nullable
        };
        if (prop.type === "Edm.Decimal") {
          property.precision = prop.precision;
          property.scale = prop.scale;
        }
        if (prop.extensions) {
          const label = prop.extensions.find(ext => ext.name === "label");
          const displayFormat = prop.extensions.find(ext => ext.name === "display-format");
          if (label) {
            property.annotationLabel = label.value;
          }
          if (displayFormat) {
            property.displayFormat = displayFormat.value;
          }
        } else {
          if (prop.hasOwnProperty("com.sap.vocabularies.Common.v1.Label")) {
            const label = prop["com.sap.vocabularies.Common.v1.Label"];
            property.annotationLabel = label["String"];
          }
        }
        return property;
      });
    },
    getEntityTypePropLabel: function _getEntityTypePropLabel(property) {
      const resourceBundle = this.getResourceBundle();
      if (resourceBundle) {
        if (resourceBundle.hasText(`${this.resourceBundlePrefix}${this.entityName}${property}`)) {
          return resourceBundle.getText(`${this.resourceBundlePrefix}${this.entityName}${property}`);
        } else {
          return Util.getGeneratedLabel(property, this.namingStrategy);
        }
      } else {
        return Util.getGeneratedLabel(property, this.namingStrategy);
      }
    }
  });
  return EntityCL;
});
