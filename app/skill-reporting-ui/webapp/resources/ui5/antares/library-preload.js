//@ui5-bundle ui5/antares/library-preload.js
sap.ui.require.preload({
	"ui5/antares/base/v2/ModelCL.js":function(){
"use strict";

sap.ui.define(["sap/ui/base/Object", "sap/ui/core/mvc/Controller", "sap/ui/model/resource/ResourceModel"], function (BaseObject, Controller, ResourceModel) {
  "use strict";

  /**
   * @namespace ui5.antares.base.v2
   */
  const ModelCL = BaseObject.extend("ui5.antares.base.v2.ModelCL", {
    constructor: function _constructor(controller, modelName) {
      BaseObject.prototype.constructor.call(this);
      this.controller = controller;
      this.modelName = modelName;
      if (controller instanceof Controller) {
        this.sourceView = controller.getView();
        this.ownerComponent = controller.getOwnerComponent();
      } else {
        this.ownerComponent = controller;
      }
      const resourceModel = this.ownerComponent.getModel("i18n");
      if (resourceModel instanceof ResourceModel) {
        this.resourceBundle = resourceModel.getResourceBundle();
        this.resourceModel = resourceModel;
      }
      this.oDataModel = this.ownerComponent.getModel(this.modelName);
      this.bindingMode = this.oDataModel.getDefaultBindingMode();
      this.uiRouter = this.ownerComponent.getRouter();
      this.uiTargets = this.ownerComponent.getTargets();
      this.setMetadataUrl();
    },
    getSourceController: function _getSourceController() {
      return this.controller;
    },
    getSourceView: function _getSourceView() {
      return this.sourceView;
    },
    getSourceOwnerComponent: function _getSourceOwnerComponent() {
      return this.ownerComponent;
    },
    getODataModel: function _getODataModel() {
      return this.oDataModel;
    },
    getMetadataUrl: function _getMetadataUrl() {
      return this.metadataUrl;
    },
    getModelName: function _getModelName() {
      return this.modelName;
    },
    getServiceUrl: function _getServiceUrl() {
      return this.metadataUrl.split("$metadata")[0];
    },
    getResourceBundle: function _getResourceBundle() {
      return this.resourceBundle;
    },
    setOldBindingMode: function _setOldBindingMode() {
      this.oDataModel.setDefaultBindingMode(this.bindingMode);
    },
    getResourceModel: function _getResourceModel() {
      return this.resourceModel;
    },
    getUIRouter: function _getUIRouter() {
      return this.uiRouter;
    },
    getUITargets: function _getUITargets() {
      return this.uiTargets;
    },
    setMetadataUrl: function _setMetadataUrl() {
      const modelEntry = this.ownerComponent.getManifestEntry(`/sap.ui5/models/${this.modelName || ""}`);
      if (modelEntry) {
        const dataSource = this.ownerComponent.getManifestEntry(`/sap.app/dataSources/${modelEntry.dataSource}`);
        if (dataSource) {
          let manifestUrl = dataSource.uri;
          if (!manifestUrl.startsWith("/")) {
            manifestUrl = "/" + manifestUrl;
          }
          if (!manifestUrl.endsWith("/")) {
            manifestUrl = manifestUrl + "/";
          }
          this.metadataUrl = `${manifestUrl}$metadata`;
        }
      }
    }
  });
  return ModelCL;
});
},
	"ui5/antares/entity/v2/EntityCL.js":function(){
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
},
	"ui5/antares/entry/v2/EntryCL.js":function(){
"use strict";

sap.ui.define(["sap/m/library", "sap/ui/comp/smartform/SmartForm", "sap/ui/core/BusyIndicator", "sap/ui/layout/form/SimpleForm", "sap/ui/model/Context", "ui5/antares/base/v2/ModelCL", "ui5/antares/odata/v2/ODataCreateCL", "ui5/antares/types/entry/enums", "ui5/antares/types/odata/enums", "ui5/antares/ui/CustomControlCL", "ui5/antares/ui/DialogCL", "ui5/antares/entry/v2/ResponseCL", "ui5/antares/ui/FragmentCL", "ui5/antares/entity/v2/EntityCL", "sap/m/MessageBox", "sap/m/Table", "sap/ui/comp/smarttable/SmartTable", "sap/ui/core/mvc/View", "sap/ui/table/Table", "sap/ui/table/TreeTable", "sap/ui/table/AnalyticalTable", "ui5/antares/ui/ValidationLogicCL", "ui5/antares/entry/v2/SmartValidatorCL", "ui5/antares/entry/v2/SimpleValidatorCL", "ui5/antares/ui/ObjectPageLayoutCL"], function (sap_m_library, SmartForm, BusyIndicator, SimpleForm, Context, __ModelCL, __ODataCreateCL, __ui5_antares_types_entry_enums, __ui5_antares_types_odata_enums, __CustomControlCL, __DialogCL, __ResponseCL, __FragmentCL, __EntityCL, MessageBox, Table, SmartTable, View, UITable, TreeTable, AnalyticalTable, __ValidationLogicCL, __SmartValidatorCL, __SimpleValidatorCL, __ObjectPageLayoutCL) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ButtonType = sap_m_library["ButtonType"];
  const ModelCL = _interopRequireDefault(__ModelCL);
  const ODataCreateCL = _interopRequireDefault(__ODataCreateCL);
  const DialogStrategies = __ui5_antares_types_entry_enums["DialogStrategies"];
  const FormTypes = __ui5_antares_types_entry_enums["FormTypes"];
  const GuidStrategies = __ui5_antares_types_entry_enums["GuidStrategies"];
  const NamingStrategies = __ui5_antares_types_entry_enums["NamingStrategies"];
  const ODataMethods = __ui5_antares_types_odata_enums["ODataMethods"];
  const CustomControlCL = _interopRequireDefault(__CustomControlCL);
  const DialogCL = _interopRequireDefault(__DialogCL);
  const ResponseCL = _interopRequireDefault(__ResponseCL);
  const FragmentCL = _interopRequireDefault(__FragmentCL);
  const EntityCL = _interopRequireDefault(__EntityCL);
  const ValidationLogicCL = _interopRequireDefault(__ValidationLogicCL);
  const SmartValidatorCL = _interopRequireDefault(__SmartValidatorCL);
  const SimpleValidatorCL = _interopRequireDefault(__SimpleValidatorCL);
  const ObjectPageLayoutCL = _interopRequireDefault(__ObjectPageLayoutCL);
  /**
   * @namespace ui5.antares.entry.v2
   */
  const EntryCL = ModelCL.extend("ui5.antares.entry.v2.EntryCL", {
    constructor: function _constructor(controller, entityPath, method, modelName) {
      ModelCL.prototype.constructor.call(this, controller, modelName);
      this.formType = FormTypes.SMART;
      this.namingStrategy = NamingStrategies.CAMEL_CASE;
      this.endButtonText = "Close";
      this.beginButtonType = ButtonType.Success;
      this.endButtonType = ButtonType.Negative;
      this.propertyOrder = [];
      this.useAllProperties = true;
      this.includeAllProperties = true;
      this.excludedProperties = [];
      this.mandatoryProperties = [];
      this.readonlyProperties = [];
      this.resourceBundlePrefix = "antares";
      this.useMetadataLabels = false;
      this.mandatoryErrorMessage = "Please fill in all required fields.";
      this.selectRowMessage = "Please select a row from the table.";
      this.customControls = [];
      this.customContents = [];
      this.valueHelps = [];
      this.dialogStrategy = DialogStrategies.CREATE;
      this.containsSmartForm = false;
      this.autoMandatoryCheck = true;
      this.tableModes = ["SingleSelect", "SingleSelectLeft", "SingleSelectMaster"];
      this.uiTableModes = ["Single"];
      this.supportedTableTypes = ["sap.m.Table", "sap.ui.table.Table", "sap.ui.comp.smarttable.SmartTable", "sap.ui.table.TreeTable", "sap.ui.table.AnalyticalTable"];
      this.validationLogics = [];
      this.displayGuidProperties = GuidStrategies.ONLY_NON_KEY;
      this.generateRandomGuid = GuidStrategies.ONLY_KEY;
      this.formGroups = [];
      this.unknownGroupTitle = "Unknown Group";
      this.displayObjectPage = false;
      this.customContentSectionTitle = "Custom Contents";
      this.disableAutoClose = false;
      this.fieldCustomData = [];
      this.textInEditModeSource = [];
      this.entityPath = entityPath.startsWith("/") ? entityPath : `/${entityPath}`;
      this.entityName = this.entityPath.slice(1);
      this.entryMethod = method;
      switch (method) {
        case ODataMethods.CREATE:
          this.beginButtonText = "Create";
          this.formTitle = `Create New ${this.entityName}`;
          this.objectPageAvatarSrc = "sap-icon://add";
          this.objectPageHeaderLabel = `You can create a new ${this.entityName} on this page.`;
          break;
        case ODataMethods.UPDATE:
          this.beginButtonText = "Update";
          this.formTitle = `Update ${this.entityName}`;
          this.objectPageAvatarSrc = "sap-icon://edit";
          this.objectPageHeaderLabel = `You can update ${this.entityName} on this page.`;
          break;
        case ODataMethods.DELETE:
          this.beginButtonText = "Delete";
          this.formTitle = `Delete ${this.entityName}`;
          this.objectPageAvatarSrc = "sap-icon://delete";
          this.objectPageHeaderLabel = `You can delete ${this.entityName} on this page.`;
          break;
        case ODataMethods.READ:
          this.beginButtonText = "Read";
          this.formTitle = `Read ${this.entityName}`;
          this.objectPageAvatarSrc = "sap-icon://display";
          this.objectPageHeaderLabel = `You can display ${this.entityName} on this page.`;
          break;
      }
    },
    getEntityPath: function _getEntityPath() {
      return this.entityPath;
    },
    getEntityName: function _getEntityName() {
      return this.entityName;
    },
    getFragmentPath: function _getFragmentPath() {
      return this.fragmentPath;
    },
    setFragmentPath: function _setFragmentPath(fragmentPath) {
      let containsSmartForm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.fragmentPath = fragmentPath;
      this.containsSmartForm = containsSmartForm;
      this.setDialogStrategy(DialogStrategies.LOAD);
    },
    getFormType: function _getFormType() {
      return this.formType;
    },
    setFormType: function _setFormType(formType) {
      this.formType = formType;
    },
    getNamingStrategy: function _getNamingStrategy() {
      return this.namingStrategy;
    },
    setNamingStrategy: function _setNamingStrategy(strategy) {
      this.namingStrategy = strategy;
    },
    getFormTitle: function _getFormTitle() {
      return this.formTitle;
    },
    setFormTitle: function _setFormTitle(title) {
      this.formTitle = title;
    },
    getBeginButtonText: function _getBeginButtonText() {
      return this.beginButtonText;
    },
    setBeginButtonText: function _setBeginButtonText(text) {
      this.beginButtonText = text;
    },
    getEndButtonText: function _getEndButtonText() {
      return this.endButtonText;
    },
    setEndButtonText: function _setEndButtonText(text) {
      this.endButtonText = text;
    },
    getBeginButtonType: function _getBeginButtonType() {
      return this.beginButtonType;
    },
    setBeginButtonType: function _setBeginButtonType(type) {
      this.beginButtonType = type;
    },
    getEndButtonType: function _getEndButtonType() {
      return this.endButtonType;
    },
    setEndButtonType: function _setEndButtonType(type) {
      this.endButtonType = type;
    },
    getPropertyOrder: function _getPropertyOrder() {
      return this.propertyOrder;
    },
    getUseAllProperties: function _getUseAllProperties() {
      return this.useAllProperties;
    },
    setPropertyOrder: function _setPropertyOrder(order) {
      let useAllProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this.propertyOrder = order;
      this.useAllProperties = useAllProperties;
    },
    getExcludedProperties: function _getExcludedProperties() {
      return this.excludedProperties;
    },
    setExcludedProperties: function _setExcludedProperties(properties) {
      this.excludedProperties = properties;
    },
    getMandatoryProperties: function _getMandatoryProperties() {
      return this.mandatoryProperties;
    },
    setMandatoryProperties: function _setMandatoryProperties(properties) {
      this.mandatoryProperties = properties;
    },
    getResourceBundlePrefix: function _getResourceBundlePrefix() {
      return this.resourceBundlePrefix;
    },
    setResourceBundlePrefix: function _setResourceBundlePrefix(prefix) {
      this.resourceBundlePrefix = prefix;
    },
    getUseMetadataLabels: function _getUseMetadataLabels() {
      return this.useMetadataLabels;
    },
    setUseMetadataLabels: function _setUseMetadataLabels(useMetadataLabels) {
      this.useMetadataLabels = useMetadataLabels;
    },
    getMandatoryErrorMessage: function _getMandatoryErrorMessage() {
      return this.mandatoryErrorMessage;
    },
    setMandatoryErrorMessage: function _setMandatoryErrorMessage(message) {
      this.mandatoryErrorMessage = message;
    },
    addCustomControl: function _addCustomControl(control) {
      this.customControls.push(control);
    },
    getCustomControls: function _getCustomControls() {
      return this.customControls;
    },
    getCustomControl: function _getCustomControl(propertyName) {
      const customControl = this.customControls.find(control => control.getPropertyName() === propertyName);
      return customControl;
    },
    addCustomContent: function _addCustomContent(content) {
      this.customContents.push(content);
    },
    getCustomContents: function _getCustomContents() {
      return this.customContents;
    },
    addValueHelp: function _addValueHelp(valueHelp) {
      this.valueHelps.push(valueHelp);
    },
    getValueHelps: function _getValueHelps() {
      return this.valueHelps;
    },
    getValueHelp: function _getValueHelp(propertyName) {
      const valueHelp = this.valueHelps.find(vh => vh.getPropertyName() === propertyName);
      return valueHelp;
    },
    setDialogStrategy: function _setDialogStrategy(strategy) {
      this.dialogStrategy = strategy;
    },
    getDialogStrategy: function _getDialogStrategy() {
      return this.dialogStrategy;
    },
    getContainsSmartForm: function _getContainsSmartForm() {
      return this.containsSmartForm;
    },
    setAutoMandatoryCheck: function _setAutoMandatoryCheck(autoMandatoryCheck) {
      this.autoMandatoryCheck = autoMandatoryCheck;
    },
    getAutoMandatoryCheck: function _getAutoMandatoryCheck() {
      return this.autoMandatoryCheck;
    },
    setSelectRowMessage: function _setSelectRowMessage(message) {
      this.selectRowMessage = message;
    },
    getSelectRowMessage: function _getSelectRowMessage() {
      return this.selectRowMessage;
    },
    addValidationLogic: function _addValidationLogic(logic) {
      this.validationLogics.push(logic);
    },
    getValidationLogics: function _getValidationLogics() {
      return this.validationLogics;
    },
    getValidationLogic: function _getValidationLogic(propertyName) {
      const logic = this.validationLogics.find(logic => logic.getPropertyName() === propertyName);
      return logic;
    },
    setDisplayGuidProperties: function _setDisplayGuidProperties(strategy) {
      this.displayGuidProperties = strategy;
    },
    getDisplayGuidProperties: function _getDisplayGuidProperties() {
      return this.displayGuidProperties;
    },
    setGenerateRandomGuid: function _setGenerateRandomGuid(strategy) {
      this.generateRandomGuid = strategy;
    },
    getGenerateRandomGuid: function _getGenerateRandomGuid() {
      return this.generateRandomGuid;
    },
    setReadonlyProperties: function _setReadonlyProperties(properties) {
      this.readonlyProperties = properties;
    },
    getReadonlyProperties: function _getReadonlyProperties() {
      return this.readonlyProperties;
    },
    setFormGroups: function _setFormGroups(groups) {
      let includeAllProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this.formGroups = groups;
      this.includeAllProperties = includeAllProperties;
    },
    getFormGroups: function _getFormGroups() {
      return this.formGroups;
    },
    getIncludeAllProperties: function _getIncludeAllProperties() {
      return this.includeAllProperties;
    },
    setDefaultGroupTitle: function _setDefaultGroupTitle(title) {
      this.defaultGroupTitle = title;
    },
    getDefaultGroupTitle: function _getDefaultGroupTitle() {
      return this.defaultGroupTitle;
    },
    setUnknownGroupTitle: function _setUnknownGroupTitle(title) {
      this.unknownGroupTitle = title;
    },
    getUnknownGroupTitle: function _getUnknownGroupTitle() {
      return this.unknownGroupTitle;
    },
    setDisplayObjectPage: function _setDisplayObjectPage(display, fromTarget) {
      this.displayObjectPage = display;
      this.fromTarget = fromTarget;
    },
    getDisplayObjectPage: function _getDisplayObjectPage() {
      return this.displayObjectPage;
    },
    setObjectPageAvatarSrc: function _setObjectPageAvatarSrc(src) {
      this.objectPageAvatarSrc = src;
    },
    getObjectPageAvatarSrc: function _getObjectPageAvatarSrc() {
      return this.objectPageAvatarSrc;
    },
    setObjectPageHeaderLabel: function _setObjectPageHeaderLabel(label) {
      this.objectPageHeaderLabel = label;
    },
    getObjectPageHeaderLabel: function _getObjectPageHeaderLabel() {
      return this.objectPageHeaderLabel;
    },
    getFromTarget: function _getFromTarget() {
      return this.fromTarget;
    },
    getCreatedTarget: function _getCreatedTarget() {
      return this.createdTarget;
    },
    setCustomContentSectionTitle: function _setCustomContentSectionTitle(title) {
      this.customContentSectionTitle = title;
    },
    getCustomContentSectionTitle: function _getCustomContentSectionTitle() {
      return this.customContentSectionTitle;
    },
    getEntryMethod: function _getEntryMethod() {
      return this.entryMethod;
    },
    setDisableAutoClose: function _setDisableAutoClose(disable) {
      this.disableAutoClose = disable;
    },
    getDisableAutoClose: function _getDisableAutoClose() {
      return this.disableAutoClose;
    },
    setFieldCustomData: function _setFieldCustomData(customData) {
      this.fieldCustomData = customData;
    },
    getFieldCustomData: function _getFieldCustomData() {
      return this.fieldCustomData;
    },
    setTextInEditModeSource: function _setTextInEditModeSource(textInEditModeSource) {
      this.textInEditModeSource = textInEditModeSource;
    },
    getTextInEditModeSource: function _getTextInEditModeSource() {
      return this.textInEditModeSource;
    },
    addControlFromFragment: async function _addControlFromFragment(fragment) {
      await fragment.load();
      const content = fragment.getFragmentContent();
      if (Array.isArray(content)) {
        for (const control of content) {
          const customControlData = control.getCustomData().find(data => data.getKey() === "UI5AntaresEntityPropertyName");
          const controlName = control.getMetadata().getName();
          if (!customControlData) {
            throw new Error(`Custom Data with key UI5AntaresEntityPropertyName is missing in the control: ${controlName}`);
          }
          const propertyName = customControlData.getValue();
          const validationMessage = this.getValidationLogicMessage(control);
          const validationLogic = this.getValidationLogicMethod(control, propertyName, validationMessage);
          const customControl = new CustomControlCL(control, propertyName, validationLogic);
          this.customControls.push(customControl);
        }
      } else {
        const customControlData = content.getCustomData().find(data => data.getKey() === "UI5AntaresEntityPropertyName");
        const controlName = content.getMetadata().getName();
        if (!customControlData) {
          throw new Error(`Custom Data with key UI5AntaresEntityPropertyName is missing in the control: ${controlName}`);
        }
        const propertyName = customControlData.getValue();
        const validationMessage = this.getValidationLogicMessage(content);
        const validationLogic = this.getValidationLogicMethod(content, propertyName, validationMessage);
        const customControl = new CustomControlCL(content, propertyName, validationLogic);
        this.customControls.push(customControl);
      }
    },
    addContentFromFragment: async function _addContentFromFragment(fragment) {
      await fragment.load();
      const content = fragment.getFragmentContent();
      if (Array.isArray(content)) {
        content.forEach(control => this.customContents.push(control));
      } else {
        this.customContents.push(content);
      }
    },
    addNonNullableProperties: async function _addNonNullableProperties() {
      const entity = new EntityCL(this.getSourceController(), this.entityName, this.getResourceBundlePrefix(), this.namingStrategy, this.getModelName());
      const entityTypeProperties = await entity.getEntityTypeProperties();
      for (const property of entityTypeProperties) {
        if (this.mandatoryProperties.includes(property.propertyName)) {
          continue;
        }
        if (property.nullable === "false") {
          this.mandatoryProperties.push(property.propertyName);
        }
      }
    },
    attachSubmitCompleted: function _attachSubmitCompleted(submitCompleted, listener) {
      this.submitCompleted = submitCompleted;
      if (listener) {
        this.submitCompletedListener = listener;
      } else {
        this.submitCompletedListener = this.getSourceController();
      }
    },
    attachSubmitFailed: function _attachSubmitFailed(submitFailed, listener) {
      this.submitFailed = submitFailed;
      if (listener) {
        this.submitFailedListener = listener;
      } else {
        this.submitFailedListener = this.getSourceController();
      }
    },
    createEntryContext: function _createEntryContext(data) {
      const entry = new ODataCreateCL(this.getSourceController(), this.entityPath, this.getModelName());
      if (data) {
        entry.setData(data);
      }
      this.entryContext = entry.createEntry();
    },
    getEntryContext: function _getEntryContext() {
      return this.entryContext;
    },
    createEntryDialog: function _createEntryDialog(dialogId) {
      if (dialogId) {
        this.entryDialog = new DialogCL(dialogId);
      } else {
        this.entryDialog = new FragmentCL(this.getSourceController(), this.fragmentPath);
      }
    },
    getEntryDialog: function _getEntryDialog() {
      return this.entryDialog;
    },
    getGeneratedDialog: function _getGeneratedDialog() {
      if (this.entryDialog instanceof DialogCL) {
        return this.entryDialog.getDialog();
      } else {
        return this.entryDialog.getFragmentContent();
      }
    },
    closeEntryDialog: function _closeEntryDialog() {
      if (this.entryDialog instanceof DialogCL) {
        this.entryDialog.getDialog().close();
      } else {
        this.entryDialog.close();
      }
    },
    destroyEntryDialog: function _destroyEntryDialog() {
      if (this.entryDialog instanceof DialogCL) {
        this.entryDialog.getDialog().destroy();
      } else {
        this.entryDialog.destroyFragmentContent();
      }
    },
    closeAndDestroyEntryDialog: function _closeAndDestroyEntryDialog() {
      this.closeEntryDialog();
      this.destroyEntryDialog();
    },
    valueValidation: function _valueValidation() {
      if (this.formType === FormTypes.SMART) {
        return this.validateSmartValues();
      } else {
        return this.validateSimpleValues();
      }
    },
    validateSmartValues: function _validateSmartValues() {
      let smartGroupElements = [];
      if (this.displayObjectPage) {
        const objectPageLayout = this.objectPageLayout.getObjectPageLayout();
        const sections = objectPageLayout.getSections();
        sections.forEach(section => {
          const subSections = section.getSubSections();
          const blocks = subSections[0].getBlocks();
          const blockContent = blocks[0];
          if (blockContent instanceof SmartForm) {
            const groupElements = blockContent.getGroups().reduce((groupElements, currentGroup) => {
              return groupElements = [...groupElements, ...currentGroup.getGroupElements()];
            }, []);
            smartGroupElements = [...smartGroupElements, ...groupElements];
          }
        });
      } else {
        const smartGroups = this.entryDialog.getDialog().getContent()[0].getGroups();
        smartGroupElements = smartGroups.reduce((groupElements, currentGroup) => {
          return groupElements = [...groupElements, ...currentGroup.getGroupElements()];
        }, []);
      }
      const validator = new SmartValidatorCL(smartGroupElements, this.customControls, this.validationLogics, this.mandatoryErrorMessage);
      return validator.validate();
    },
    validateSimpleValues: function _validateSimpleValues() {
      let simpleFormElements = [];
      if (this.displayObjectPage) {
        const objectPageLayout = this.objectPageLayout.getObjectPageLayout();
        const sections = objectPageLayout.getSections();
        sections.forEach(section => {
          const subSections = section.getSubSections();
          const blocks = subSections[0].getBlocks();
          const blockContent = blocks[0];
          if (blockContent instanceof SimpleForm) {
            simpleFormElements = [...simpleFormElements, ...blockContent.getContent()];
          }
        });
      } else {
        simpleFormElements = this.entryDialog.getDialog().getContent()[0].getContent();
      }
      const validator = new SimpleValidatorCL(simpleFormElements, this.customControls, this.validationLogics, this.mandatoryErrorMessage);
      return validator.validate();
    },
    checkContextMandatory: function _checkContextMandatory() {
      const entryObject = this.entryContext.getObject();
      const objectKeys = Object.keys(entryObject);
      return this.mandatoryProperties.every(prop => objectKeys.includes(prop));
    },
    reset: function _reset() {
      let resetAll = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.getODataModel().hasPendingChanges()) {
        if (resetAll) {
          this.getODataModel().resetChanges(undefined, true, true);
        } else {
          this.getODataModel().resetChanges([this.entryContext.getPath()]);
        }
      }
      this.setOldBindingMode();
      if (this.displayObjectPage) {
        return;
      }
      if (this.getDialogStrategy() === DialogStrategies.LOAD) {
        this.closeEntryDialog();
        this.destroyEntryDialog();
      }
    },
    submit: function _submit() {
      let resetAllOnFail = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.getODataModel().hasPendingChanges()) {
        if (this.dialogStrategy === DialogStrategies.LOAD && this.autoMandatoryCheck && !this.displayObjectPage) {
          if (!this.checkContextMandatory()) {
            MessageBox.error(this.mandatoryErrorMessage);
            return;
          }
        }
        BusyIndicator.show(1);
        this.getODataModel().submitChanges({
          success: response => {
            BusyIndicator.hide();
            if (response?.__batchResponses) {
              let statusCode = response.__batchResponses[0].response?.statusCode;
              if (!statusCode && response.__batchResponses[0].__changeResponses) {
                statusCode = response.__batchResponses[0].__changeResponses[0].statusCode || response.__batchResponses[0].__changeResponses[0].response?.statusCode;
              }
              if (statusCode) {
                if (statusCode.startsWith("4") || statusCode.startsWith("5")) {
                  this.reset(resetAllOnFail);
                  if (this.submitFailed) {
                    let responseObject = response.__batchResponses[0].response;
                    if (!responseObject && response.__batchResponses[0].__changeResponses) {
                      responseObject = response.__batchResponses[0].__changeResponses[0].response;
                    }
                    const errorResponse = new ResponseCL(responseObject, statusCode);
                    this.submitFailed.call(this.submitFailedListener, errorResponse);
                  }
                } else {
                  if (this.displayObjectPage) {
                    this.getODataModel().refresh(true);
                  }
                  if (this.submitCompleted) {
                    let responseData;
                    if (response.__batchResponses[0].__changeResponses) {
                      responseData = response.__batchResponses[0].__changeResponses[0].data;
                    }
                    const successResponse = new ResponseCL(responseData, statusCode);
                    this.submitCompleted.call(this.submitCompletedListener, successResponse);
                  }
                }
              } else {
                this.reset();
                if (this.submitFailed) {
                  const responseObject = {
                    statusCode: "422",
                    statusText: "Status Code not found!"
                  };
                  const errorResponse = new ResponseCL(responseObject, "422");
                  this.submitFailed.call(this.submitFailedListener, errorResponse);
                }
              }
            }
          },
          error: () => {
            BusyIndicator.hide();
            this.reset();
            if (this.submitFailed) {
              const responseObject = {
                statusCode: "500",
                statusText: "An unknown error occured!"
              };
              const errorResponse = new ResponseCL(responseObject, "500");
              this.submitFailed.call(this.submitFailedListener, errorResponse);
            }
          }
        });
      }
      this.setOldBindingMode();
      if (!this.displayObjectPage && !this.disableAutoClose) {
        this.closeEntryDialog();
        this.destroyEntryDialog();
      }
    },
    initializeContext: async function _initializeContext(initializer) {
      this.setInitializer(initializer);
      if (this.entryContext) {
        return;
      }
      if (this.tableId) {
        this.initContextFromTable();
      } else {
        await this.createBindingContext();
      }
    },
    setInitializer: function _setInitializer(initializer) {
      if (initializer instanceof Context) {
        this.entryContext = initializer;
      } else if (typeof initializer === "string") {
        this.tableId = initializer;
      } else {
        this.entityKeys = initializer;
      }
    },
    initContextFromTable: function _initContextFromTable() {
      const table = this.getSourceView().byId(this.tableId);
      if (!table) {
        throw new Error(`Table with ID: ${this.tableId} not found!`);
      }
      if (table instanceof Table) {
        this.tableContext(table);
      } else if (table instanceof UITable) {
        this.uiTableContext(table);
      } else if (table instanceof SmartTable) {
        const innerTable = table.getTable();
        if (innerTable instanceof Table) {
          this.tableContext(innerTable);
        } else if (innerTable instanceof UITable) {
          this.uiTableContext(innerTable);
        } else if (innerTable instanceof TreeTable) {
          this.uiTableContext(innerTable);
        } else if (innerTable instanceof AnalyticalTable) {
          this.uiTableContext(innerTable);
        }
      } else if (table instanceof TreeTable) {
        this.uiTableContext(table);
      } else if (table instanceof AnalyticalTable) {
        this.uiTableContext(table);
      } else {
        throw new Error(`Supported table types: ${this.supportedTableTypes.join(", ")}`);
      }
    },
    tableContext: function _tableContext(table) {
      const selectionMode = table.getMode();
      if (!this.tableModes.includes(selectionMode)) {
        throw new Error(`Please activate one of the following selection modes: ${this.tableModes.join(", ")}`);
      }
      const selectedItem = table.getSelectedItem();
      if (!selectedItem) {
        MessageBox.error(this.selectRowMessage);
        throw new Error("No row selected by the end user!");
      }
      const bindingContext = selectedItem.getBindingContext();
      if (!bindingContext) {
        throw new Error("Only OData binding is supported!");
      }
      this.entryContext = bindingContext;
    },
    uiTableContext: function _uiTableContext(table) {
      const selectionMode = table.getSelectionMode();
      if (!this.uiTableModes.includes(selectionMode)) {
        throw new Error(`Please activate one of the following selection modes: ${this.uiTableModes.join(", ")}`);
      }
      const selectedIndices = table.getSelectedIndices();
      if (!selectedIndices.length) {
        MessageBox.error(this.selectRowMessage);
        throw new Error("No row selected by the end user!");
      }
      const bindingContext = table.getContextByIndex(selectedIndices[0]);
      if (!bindingContext) {
        throw new Error("Only OData binding is supported!");
      }
      this.entryContext = bindingContext;
    },
    createBindingContext: function _createBindingContext() {
      return new Promise((resolve, reject) => {
        const entityKeys = this.entityKeys;
        if (!entityKeys) {
          throw new Error("Entity key values must be provided through the initializer parameter in the class constructor!");
        }
        const path = this.getODataModel().createKey(this.entityPath, entityKeys);
        this.getODataModel().createBindingContext(path, context => {
          if (!context) {
            throw new Error(`No data found for the following path: ${path}`);
          }
          this.entryContext = context;
          resolve();
        });
      });
    },
    getValidationLogicMethod: function _getValidationLogicMethod(control, propertyName, validationMessage) {
      let validationLogic;
      const validationLogicData = control.getCustomData().find(data => data.getKey() === "UI5AntaresValidationLogic");
      if (validationLogicData) {
        const methodName = validationLogicData.getValue();
        const sourceController = this.getSourceController();
        if (methodName in sourceController) {
          if (typeof sourceController[methodName] === "function") {
            validationLogic = new ValidationLogicCL({
              propertyName: propertyName,
              validator: sourceController[methodName],
              listener: this.getSourceController(),
              message: validationMessage
            });
          }
        }
      }
      return validationLogic;
    },
    getValidationLogicMessage: function _getValidationLogicMessage(control) {
      control.setModel(this.getResourceModel(), "i18n");
      const validationLogicData = control.getCustomData().find(data => data.getKey() === "UI5AntaresValidationMessage");
      if (!validationLogicData) {
        return;
      }
      return validationLogicData.getValue();
    },
    createObjectPageLayout: function _createObjectPageLayout() {
      this.objectPageLayout = new ObjectPageLayoutCL(this.formTitle, this.objectPageAvatarSrc, this.objectPageHeaderLabel);
    },
    getObjectPageInstance: function _getObjectPageInstance() {
      return this.objectPageLayout;
    },
    createTypedView: async function _createTypedView() {
      this.objectPageView = await View.create({
        id: "UI5AntaresObjectPageViewID",
        viewName: "module:ui5/antares/ui/view/UI5AntaresObjectPageView",
        viewData: {
          entry: this,
          router: this.getUIRouter(),
          method: this.entryMethod
        }
      });
      this.getUITargets().getViews().setView("module:ui5/antares/ui/view/UI5AntaresObjectPageView", this.objectPageView);
    },
    displayTypedView: function _displayTypedView() {
      this.createNewTarget();
      this.createdTarget.display();
    },
    createNewTarget: function _createNewTarget() {
      const target = this.getUITargets().getTarget("UI5AntaresObjectPageTarget", true);
      if (!target) {
        this.getUITargets().addTarget("UI5AntaresObjectPageTarget", {
          name: "module:ui5/antares/ui/view/UI5AntaresObjectPageView",
          type: "View",
          clearControlAggregation: true
        });
      }
      this.createdTarget = this.getUITargets().getTarget("UI5AntaresObjectPageTarget", true);
    }
  });
  return EntryCL;
});
},
	"ui5/antares/entry/v2/EntryCreateCL.js":function(){
"use strict";

sap.ui.define(["ui5/antares/types/entry/enums", "ui5/antares/ui/ContentCL", "ui5/antares/entry/v2/EntryCL", "ui5/antares/types/odata/enums", "sap/m/MessageBox", "sap/m/Dialog", "ui5/antares/entity/v2/EntityCL"], function (__ui5_antares_types_entry_enums, __ContentCL, __EntryCL, __ui5_antares_types_odata_enums, MessageBox, Dialog, __EntityCL) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const DialogStrategies = __ui5_antares_types_entry_enums["DialogStrategies"];
  const FormTypes = __ui5_antares_types_entry_enums["FormTypes"];
  const GuidStrategies = __ui5_antares_types_entry_enums["GuidStrategies"];
  const ContentCL = _interopRequireDefault(__ContentCL);
  const EntryCL = _interopRequireDefault(__EntryCL);
  const ODataMethods = __ui5_antares_types_odata_enums["ODataMethods"];
  const EntityCL = _interopRequireDefault(__EntityCL);
  /**
   * @namespace ui5.antares.entry.v2
   */
  const EntryCreateCL = EntryCL.extend("ui5.antares.entry.v2.EntryCreateCL", {
    constructor: function _constructor(controller, entityPath, modelName) {
      EntryCL.prototype.constructor.call(this, controller, entityPath, ODataMethods.CREATE, modelName);
    },
    createNewEntry: async function _createNewEntry(data) {
      if (!this.getSourceView()) {
        throw new Error("createNewEntry() method cannot be used on the UIComponent!");
      }
      this.getODataModel().setDefaultBindingMode("TwoWay");
      this.getODataModel().setUseBatch(true);
      if (this.getDisplayObjectPage()) {
        await this.createObjectPage(data);
      } else {
        if (this.getDialogStrategy() === DialogStrategies.LOAD) {
          await this.loadDialog(data);
        } else {
          await this.createDialog(data);
        }
      }
    },
    createDialog: async function _createDialog(data) {
      const content = new ContentCL(this.getSourceController(), this, ODataMethods.CREATE, this.getModelName());

      // Create Dialog
      this.createEntryDialog(`diaUI5AntaresCreateNew${this.getEntityName()}`);
      const entryDialog = this.getEntryDialog();
      entryDialog.addBeginButton(this.getBeginButtonText(), this.getBeginButtonType(), this.onCreateTriggered, this);
      entryDialog.addEndButton(this.getEndButtonText(), this.getEndButtonType(), this.onEntryCanceled, this);
      entryDialog.addEscapeHandler(this.onEscapePressed, this);

      //Create Context
      const dataWithGuid = await this.generateGuid(data);
      this.createEntryContext(dataWithGuid);
      if (this.getFormType() === FormTypes.SMART) {
        const smartForm = await content.getSmartForm();
        smartForm.setModel(this.getODataModel());
        smartForm.setBindingContext(this.getEntryContext());
        entryDialog.addContent(smartForm);
        this.getCustomContents().forEach(customContent => {
          entryDialog.addContent(customContent);
        });
      } else {
        const simpleForm = await content.getSimpleForm();
        simpleForm.setModel(this.getODataModel(), this.getModelName());
        simpleForm.setBindingContext(this.getEntryContext(), this.getModelName());
        entryDialog.addContent(simpleForm);
        this.getCustomContents().forEach(customContent => {
          entryDialog.addContent(customContent);
        });
      }
      this.getSourceView().addDependent(entryDialog.getDialog());
      entryDialog.getDialog().open();
    },
    onCreateTriggered: function _onCreateTriggered() {
      if (this.manualSubmitter) {
        this.manualSubmitter.call(this.manualSubmitListener || this.getSourceController(), this);
      } else {
        this.completeSubmit();
      }
    },
    completeSubmit: function _completeSubmit() {
      const validation = this.valueValidation();
      if (!validation.validated) {
        MessageBox.error(validation.message);
        return;
      }
      this.submit();
    },
    onEntryCanceled: function _onEntryCanceled() {
      this.reset();
      this.closeEntryDialog();
      this.destroyEntryDialog();
    },
    onEscapePressed: function _onEscapePressed(event) {
      this.reset();
      event.resolve();
      this.destroyEntryDialog();
    },
    loadDialog: async function _loadDialog(data) {
      await this.addNonNullableProperties();

      // Create Dialog
      this.createEntryDialog();
      const fragment = this.getEntryDialog();
      await fragment.load();
      const content = fragment.getFragmentContent();
      if (content instanceof Dialog) {
        // Set context and open the dialog
        const dataWithGuid = await this.generateGuid(data);
        this.createEntryContext(dataWithGuid);
        if (this.getContainsSmartForm()) {
          content.setModel(this.getODataModel());
          content.setBindingContext(this.getEntryContext());
        } else {
          content.setModel(this.getODataModel(), this.getModelName());
          content.setBindingContext(this.getEntryContext(), this.getModelName());
        }
        fragment.open(true);
      } else {
        fragment.destroyFragmentContent();
        throw new Error("Provided fragment must contain a sap.m.Dialog control. Put all the controls into a sap.m.Dialog");
      }
    },
    createObjectPage: async function _createObjectPage(data) {
      const content = new ContentCL(this.getSourceController(), this, ODataMethods.CREATE, this.getModelName());

      // Create Object Page
      this.createObjectPageLayout();
      const objectPageInstance = this.getObjectPageInstance();
      objectPageInstance.addCompleteButton(this.getBeginButtonText(), this.getBeginButtonType());
      objectPageInstance.addCancelButton(this.getEndButtonText(), this.getEndButtonType());

      //Create Context
      const dataWithGuid = await this.generateGuid(data);
      this.createEntryContext(dataWithGuid);
      if (this.getFormType() === FormTypes.SMART) {
        await content.addSmartSections();
        objectPageInstance.getObjectPageLayout().setModel(this.getODataModel());
        objectPageInstance.getObjectPageLayout().setBindingContext(this.getEntryContext());
      } else {
        await content.addSimpleSections();
        objectPageInstance.getObjectPageLayout().setModel(this.getODataModel(), this.getModelName());
        objectPageInstance.getObjectPageLayout().setBindingContext(this.getEntryContext(), this.getModelName());
      }
      if (this.getCustomContents().length) {
        objectPageInstance.addEmptySection(this.getCustomContentSectionTitle());
        this.getCustomContents().forEach(customContent => {
          objectPageInstance.addContentToSection(customContent);
        });
      }
      await this.createTypedView();
      this.displayTypedView();
    },
    generateGuid: async function _generateGuid(data) {
      const guidStrategy = this.getGenerateRandomGuid();
      if (guidStrategy === GuidStrategies.NONE) {
        return;
      }
      const entity = new EntityCL(this.getSourceController(), this.getEntityName(), this.getResourceBundlePrefix(), this.getNamingStrategy(), this.getModelName());
      let dataWithGuid = {};
      const entityTypeProperties = await entity.getEntityTypeProperties();
      const entityTypeKeys = await entity.getEntityTypeKeys();
      if (data) {
        dataWithGuid = data;
      }
      switch (guidStrategy) {
        case GuidStrategies.ALL:
          entityTypeProperties.forEach(property => {
            if (property.propertyType === "Edm.Guid") {
              dataWithGuid[property.propertyName] = window.crypto.randomUUID();
            }
          });
          break;
        case GuidStrategies.ONLY_KEY:
          entityTypeKeys.forEach(keyProperty => {
            if (keyProperty.propertyType === "Edm.Guid") {
              dataWithGuid[keyProperty.propertyName] = window.crypto.randomUUID();
            }
          });
          break;
        case GuidStrategies.ONLY_NON_KEY:
          const mappedKeys = entityTypeKeys.map(key => key.propertyName);
          for (const property of entityTypeProperties) {
            if (mappedKeys.includes(property.propertyName) || property.propertyType !== "Edm.Guid") {
              continue;
            }
            dataWithGuid[property.propertyName] = window.crypto.randomUUID();
          }
          break;
      }
      if (!Object.keys(dataWithGuid).length) {
        return;
      }
      return dataWithGuid;
    },
    registerManualSubmit: function _registerManualSubmit(submitter, listener) {
      this.manualSubmitter = submitter;
      this.manualSubmitListener = listener;
    },
    submitManually: function _submitManually() {
      this.completeSubmit();
    }
  });
  return EntryCreateCL;
});
},
	"ui5/antares/entry/v2/EntryDeleteCL.js":function(){
"use strict";

sap.ui.define(["sap/m/Dialog", "sap/m/MessageBox", "sap/m/library", "ui5/antares/entry/v2/EntryCL", "ui5/antares/types/entry/enums", "ui5/antares/types/odata/enums", "ui5/antares/ui/ContentCL", "ui5/antares/entry/v2/ResponseCL"], function (Dialog, MessageBox, sap_m_library, __EntryCL, __ui5_antares_types_entry_enums, __ui5_antares_types_odata_enums, __ContentCL, __ResponseCL) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ButtonType = sap_m_library["ButtonType"];
  const EntryCL = _interopRequireDefault(__EntryCL);
  const DialogStrategies = __ui5_antares_types_entry_enums["DialogStrategies"];
  const FormTypes = __ui5_antares_types_entry_enums["FormTypes"];
  const ODataMethods = __ui5_antares_types_odata_enums["ODataMethods"];
  const ContentCL = _interopRequireDefault(__ContentCL);
  const ResponseCL = _interopRequireDefault(__ResponseCL);
  /**
   * @namespace ui5.antares.entry.v2
   */
  const EntryDeleteCL = EntryCL.extend("ui5.antares.entry.v2.EntryDeleteCL", {
    constructor: function _constructor(controller, settings, modelName) {
      EntryCL.prototype.constructor.call(this, controller, settings.entityPath, ODataMethods.DELETE, modelName);
      this.confirmationText = "The selected line will be deleted. Do you confirm?";
      this.confirmationTitle = "Confirm Delete";
      this.settings = settings;
      this.setBeginButtonType(ButtonType.Reject);
      this.setEndButtonType(ButtonType.Default);
    },
    setConfirmationText: function _setConfirmationText(text) {
      this.confirmationText = text;
    },
    getConfirmationText: function _getConfirmationText() {
      return this.confirmationText;
    },
    setConfirmationTitle: function _setConfirmationTitle(title) {
      this.confirmationTitle = title;
    },
    getConfirmationTitle: function _getConfirmationTitle() {
      return this.confirmationTitle;
    },
    attachDeleteCompleted: function _attachDeleteCompleted(completed, listener) {
      this.deleteCompleted = completed;
      this.completedListener = listener || this.getSourceController();
    },
    attachDeleteFailed: function _attachDeleteFailed(failed, listener) {
      this.deleteFailed = failed;
      this.failedListener = listener || this.getSourceController();
    },
    deleteEntry: async function _deleteEntry() {
      let previewBeforeDelete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (!this.getSourceView()) {
        throw new Error("deleteEntry() method cannot be used on the UIComponent!");
      }
      this.getODataModel().setDefaultBindingMode("TwoWay");
      this.getODataModel().setUseBatch(true);
      await this.initializeContext(this.settings.initializer);
      if (previewBeforeDelete) {
        if (this.getDisplayObjectPage()) {
          await this.createObjectPage();
        } else {
          if (this.getDialogStrategy() === DialogStrategies.LOAD) {
            await this.loadDialog();
          } else {
            await this.createDialog();
          }
        }
      } else {
        this.deleteEntryContext();
      }
    },
    createDialog: async function _createDialog() {
      const content = new ContentCL(this.getSourceController(), this, ODataMethods.DELETE, this.getModelName());

      // Create Dialog
      this.createEntryDialog(`diaUI5AntaresDelete${this.getEntityName()}`);
      const entryDialog = this.getEntryDialog();
      entryDialog.addBeginButton(this.getBeginButtonText(), this.getBeginButtonType(), this.onDeleteTriggered, this);
      entryDialog.addEndButton(this.getEndButtonText(), this.getEndButtonType(), this.onEntryCanceled, this);
      entryDialog.addEscapeHandler(this.onEscapePressed, this);
      entryDialog.getDialog().setInitialFocus(entryDialog.getDialog().getEndButton());
      if (this.getFormType() === FormTypes.SMART) {
        const smartForm = await content.getSmartForm();
        smartForm.setModel(this.getODataModel());
        smartForm.setBindingContext(this.getEntryContext());
        entryDialog.addContent(smartForm);
        this.getCustomContents().forEach(customContent => {
          entryDialog.addContent(customContent);
        });
      } else {
        const simpleForm = await content.getSimpleForm();
        simpleForm.setModel(this.getODataModel(), this.getModelName());
        simpleForm.setBindingContext(this.getEntryContext(), this.getModelName());
        entryDialog.addContent(simpleForm);
        this.getCustomContents().forEach(customContent => {
          entryDialog.addContent(customContent);
        });
      }
      this.getSourceView().addDependent(entryDialog.getDialog());
      entryDialog.getDialog().open();
    },
    onDeleteTriggered: function _onDeleteTriggered(event) {
      this.deleteEntryContext();
      this.closeEntryDialog();
      this.destroyEntryDialog();
    },
    onEntryCanceled: function _onEntryCanceled(event) {
      this.reset();
      this.closeEntryDialog();
      this.destroyEntryDialog();
    },
    onEscapePressed: function _onEscapePressed(event) {
      this.reset();
      event.resolve();
      this.destroyEntryDialog();
    },
    loadDialog: async function _loadDialog() {
      this.createEntryDialog();
      const fragment = this.getEntryDialog();
      await fragment.load();
      const content = fragment.getFragmentContent();
      if (content instanceof Dialog) {
        if (this.getContainsSmartForm()) {
          content.setModel(this.getODataModel());
          content.setBindingContext(this.getEntryContext());
        } else {
          content.setModel(this.getODataModel(), this.getModelName());
          content.setBindingContext(this.getEntryContext(), this.getModelName());
        }
        fragment.open(true);
      } else {
        fragment.destroyFragmentContent();
        throw new Error("Provided fragment must contain a sap.m.Dialog control. Put all the controls into a sap.m.Dialog");
      }
    },
    deleteEntryContext: function _deleteEntryContext() {
      const context = this.getEntryContext();
      const data = context.getObject();
      MessageBox.confirm(this.confirmationText, {
        title: this.confirmationTitle,
        actions: ["YES", "NO"],
        initialFocus: "NO",
        onClose: event => {
          if (event === "YES") {
            context.delete({
              refreshAfterChange: true,
              groupId: "$auto"
            }).then(() => {
              if (this.deleteCompleted) {
                this.deleteCompleted.call(this.completedListener, data);
              }
              if (this.getDisplayObjectPage()) {
                this.getUIRouter().getTargets().display(this.getFromTarget());
              }
            }).catch(error => {
              if (this.deleteFailed) {
                const response = new ResponseCL(error, error.statusCode);
                this.deleteFailed.call(this.failedListener, response);
              }
              if (this.getDisplayObjectPage()) {
                this.getUIRouter().getTargets().display(this.getFromTarget());
              }
            });
          }
        }
      });
    },
    createObjectPage: async function _createObjectPage() {
      const content = new ContentCL(this.getSourceController(), this, ODataMethods.DELETE, this.getModelName());

      // Create Object Page
      this.createObjectPageLayout();
      const objectPageInstance = this.getObjectPageInstance();
      objectPageInstance.addCompleteButton(this.getBeginButtonText(), this.getBeginButtonType());
      objectPageInstance.addCancelButton(this.getEndButtonText(), this.getEndButtonType());
      if (this.getFormType() === FormTypes.SMART) {
        await content.addSmartSections();
        objectPageInstance.getObjectPageLayout().setModel(this.getODataModel());
        objectPageInstance.getObjectPageLayout().setBindingContext(this.getEntryContext());
      } else {
        await content.addSimpleSections();
        objectPageInstance.getObjectPageLayout().setModel(this.getODataModel(), this.getModelName());
        objectPageInstance.getObjectPageLayout().setBindingContext(this.getEntryContext(), this.getModelName());
      }
      if (this.getCustomContents().length) {
        objectPageInstance.addEmptySection(this.getCustomContentSectionTitle());
        this.getCustomContents().forEach(customContent => {
          objectPageInstance.addContentToSection(customContent);
        });
      }
      this.registerEventForObjectPage();
      await this.createTypedView();
      this.displayTypedView();
    },
    registerEventForObjectPage: function _registerEventForObjectPage() {
      const eventBus = this.getSourceOwnerComponent().getEventBus();
      eventBus.subscribe("UI5AntaresEntryDelete", "Complete", this.objectPageEventHandler, this);
      eventBus.subscribe("UI5AntaresEntryDelete", "UnsubscribeEvents", this.unsubscribeEvents, this);
    },
    objectPageEventHandler: function _objectPageEventHandler(channelId, eventId, data) {
      this.deleteEntryContext();
    },
    unsubscribeEvents: function _unsubscribeEvents() {
      const eventBus = this.getSourceOwnerComponent().getEventBus();
      eventBus.unsubscribe("UI5AntaresEntryDelete", "Complete", this.objectPageEventHandler, this);
      eventBus.unsubscribe("UI5AntaresEntryDelete", "UnsubscribeEvents", this.unsubscribeEvents, this);
    }
  });
  return EntryDeleteCL;
});
},
	"ui5/antares/entry/v2/EntryReadCL.js":function(){
"use strict";

sap.ui.define(["sap/m/Dialog", "ui5/antares/entry/v2/EntryCL", "ui5/antares/types/entry/enums", "ui5/antares/types/odata/enums", "ui5/antares/ui/ContentCL"], function (Dialog, __EntryCL, __ui5_antares_types_entry_enums, __ui5_antares_types_odata_enums, __ContentCL) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const EntryCL = _interopRequireDefault(__EntryCL);
  const DialogStrategies = __ui5_antares_types_entry_enums["DialogStrategies"];
  const FormTypes = __ui5_antares_types_entry_enums["FormTypes"];
  const ODataMethods = __ui5_antares_types_odata_enums["ODataMethods"];
  const ContentCL = _interopRequireDefault(__ContentCL);
  /**
   * @namespace ui5.antares.entry.v2
   */
  const EntryReadCL = EntryCL.extend("ui5.antares.entry.v2.EntryReadCL", {
    constructor: function _constructor(controller, settings, modelName) {
      EntryCL.prototype.constructor.call(this, controller, settings.entityPath, ODataMethods.READ, modelName);
      this.settings = settings;
    },
    readEntry: async function _readEntry() {
      if (!this.getSourceView()) {
        throw new Error("readEntry() method cannot be used on the UIComponent!");
      }
      this.getODataModel().setDefaultBindingMode("TwoWay");
      this.getODataModel().setUseBatch(true);
      if (this.getDisplayObjectPage()) {
        await this.createObjectPage();
      } else {
        if (this.getDialogStrategy() === DialogStrategies.LOAD) {
          await this.loadDialog();
        } else {
          await this.createDialog();
        }
      }
    },
    createDialog: async function _createDialog() {
      await this.initializeContext(this.settings.initializer);
      const content = new ContentCL(this.getSourceController(), this, ODataMethods.READ, this.getModelName());

      // Create Dialog
      this.createEntryDialog(`diaUI5AntaresRead${this.getEntityName()}`);
      const entryDialog = this.getEntryDialog();
      entryDialog.addEndButton(this.getEndButtonText(), this.getEndButtonType(), this.onEntryCanceled, this);
      entryDialog.addEscapeHandler(this.onEscapePressed, this);
      if (this.getFormType() === FormTypes.SMART) {
        const smartForm = await content.getSmartForm();
        smartForm.setModel(this.getODataModel());
        smartForm.setBindingContext(this.getEntryContext());
        entryDialog.addContent(smartForm);
        this.getCustomContents().forEach(customContent => {
          entryDialog.addContent(customContent);
        });
      } else {
        const simpleForm = await content.getSimpleForm();
        simpleForm.setModel(this.getODataModel(), this.getModelName());
        simpleForm.setBindingContext(this.getEntryContext(), this.getModelName());
        entryDialog.addContent(simpleForm);
        this.getCustomContents().forEach(customContent => {
          entryDialog.addContent(customContent);
        });
      }
      this.getSourceView().addDependent(entryDialog.getDialog());
      entryDialog.getDialog().open();
    },
    onEntryCanceled: function _onEntryCanceled(event) {
      this.reset();
      this.closeEntryDialog();
      this.destroyEntryDialog();
    },
    onEscapePressed: function _onEscapePressed(event) {
      this.reset();
      event.resolve();
      this.destroyEntryDialog();
    },
    loadDialog: async function _loadDialog() {
      await this.initializeContext(this.settings.initializer);
      this.createEntryDialog();
      const fragment = this.getEntryDialog();
      await fragment.load();
      const content = fragment.getFragmentContent();
      if (content instanceof Dialog) {
        if (this.getContainsSmartForm()) {
          content.setModel(this.getODataModel());
          content.setBindingContext(this.getEntryContext());
        } else {
          content.setModel(this.getODataModel(), this.getModelName());
          content.setBindingContext(this.getEntryContext(), this.getModelName());
        }
        fragment.open(true);
      } else {
        fragment.destroyFragmentContent();
        throw new Error("Provided fragment must contain a sap.m.Dialog control. Put all the controls into a sap.m.Dialog");
      }
    },
    createObjectPage: async function _createObjectPage() {
      await this.initializeContext(this.settings.initializer);
      const content = new ContentCL(this.getSourceController(), this, ODataMethods.READ, this.getModelName());

      // Create Object Page
      this.createObjectPageLayout();
      const objectPageInstance = this.getObjectPageInstance();
      objectPageInstance.addCancelButton(this.getEndButtonText(), this.getEndButtonType());
      if (this.getFormType() === FormTypes.SMART) {
        await content.addSmartSections();
        objectPageInstance.getObjectPageLayout().setModel(this.getODataModel());
        objectPageInstance.getObjectPageLayout().setBindingContext(this.getEntryContext());
      } else {
        await content.addSimpleSections();
        objectPageInstance.getObjectPageLayout().setModel(this.getODataModel(), this.getModelName());
        objectPageInstance.getObjectPageLayout().setBindingContext(this.getEntryContext(), this.getModelName());
      }
      if (this.getCustomContents().length) {
        objectPageInstance.addEmptySection(this.getCustomContentSectionTitle());
        this.getCustomContents().forEach(customContent => {
          objectPageInstance.addContentToSection(customContent);
        });
      }
      await this.createTypedView();
      this.displayTypedView();
    }
  });
  return EntryReadCL;
});
},
	"ui5/antares/entry/v2/EntryUpdateCL.js":function(){
"use strict";

sap.ui.define(["sap/m/Dialog", "sap/m/MessageBox", "ui5/antares/entry/v2/EntryCL", "ui5/antares/types/entry/enums", "ui5/antares/types/odata/enums", "ui5/antares/ui/ContentCL"], function (Dialog, MessageBox, __EntryCL, __ui5_antares_types_entry_enums, __ui5_antares_types_odata_enums, __ContentCL) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const EntryCL = _interopRequireDefault(__EntryCL);
  const DialogStrategies = __ui5_antares_types_entry_enums["DialogStrategies"];
  const FormTypes = __ui5_antares_types_entry_enums["FormTypes"];
  const ODataMethods = __ui5_antares_types_odata_enums["ODataMethods"];
  const ContentCL = _interopRequireDefault(__ContentCL);
  /**
   * @namespace ui5.antares.entry.v2
   */
  const EntryUpdateCL = EntryCL.extend("ui5.antares.entry.v2.EntryUpdateCL", {
    constructor: function _constructor(controller, settings, modelName) {
      EntryCL.prototype.constructor.call(this, controller, settings.entityPath, ODataMethods.UPDATE, modelName);
      this.settings = settings;
    },
    updateEntry: async function _updateEntry() {
      if (!this.getSourceView()) {
        throw new Error("updateEntry() method cannot be used on the UIComponent!");
      }
      this.getODataModel().setDefaultBindingMode("TwoWay");
      this.getODataModel().setUseBatch(true);
      if (this.getDisplayObjectPage()) {
        await this.createObjectPage();
      } else {
        if (this.getDialogStrategy() === DialogStrategies.LOAD) {
          await this.loadDialog();
        } else {
          await this.createDialog();
        }
      }
    },
    createDialog: async function _createDialog() {
      await this.initializeContext(this.settings.initializer);
      const content = new ContentCL(this.getSourceController(), this, ODataMethods.UPDATE, this.getModelName());

      // Create Dialog
      this.createEntryDialog(`diaUI5AntaresUpdate${this.getEntityName()}`);
      const entryDialog = this.getEntryDialog();
      entryDialog.addBeginButton(this.getBeginButtonText(), this.getBeginButtonType(), this.onUpdateTriggered, this);
      entryDialog.addEndButton(this.getEndButtonText(), this.getEndButtonType(), this.onEntryCanceled, this);
      entryDialog.addEscapeHandler(this.onEscapePressed, this);
      if (this.getFormType() === FormTypes.SMART) {
        const smartForm = await content.getSmartForm();
        smartForm.setModel(this.getODataModel());
        smartForm.setBindingContext(this.getEntryContext());
        entryDialog.addContent(smartForm);
        this.getCustomContents().forEach(customContent => {
          entryDialog.addContent(customContent);
        });
      } else {
        const simpleForm = await content.getSimpleForm();
        simpleForm.setModel(this.getODataModel(), this.getModelName());
        simpleForm.setBindingContext(this.getEntryContext(), this.getModelName());
        entryDialog.addContent(simpleForm);
        this.getCustomContents().forEach(customContent => {
          entryDialog.addContent(customContent);
        });
      }
      this.getSourceView().addDependent(entryDialog.getDialog());
      entryDialog.getDialog().open();
    },
    onUpdateTriggered: function _onUpdateTriggered() {
      if (this.manualSubmitter) {
        this.manualSubmitter.call(this.manualSubmitListener || this.getSourceController(), this);
      } else {
        this.completeSubmit();
      }
    },
    completeSubmit: function _completeSubmit() {
      const validation = this.valueValidation();
      if (!validation.validated) {
        MessageBox.error(validation.message);
        return;
      }
      this.submit();
    },
    onEntryCanceled: function _onEntryCanceled() {
      this.reset();
      this.closeEntryDialog();
      this.destroyEntryDialog();
    },
    onEscapePressed: function _onEscapePressed(event) {
      this.reset();
      event.resolve();
      this.destroyEntryDialog();
    },
    loadDialog: async function _loadDialog() {
      await this.initializeContext(this.settings.initializer);
      await this.addNonNullableProperties();
      this.createEntryDialog();
      const fragment = this.getEntryDialog();
      await fragment.load();
      const content = fragment.getFragmentContent();
      if (content instanceof Dialog) {
        if (this.getContainsSmartForm()) {
          content.setModel(this.getODataModel());
          content.setBindingContext(this.getEntryContext());
        } else {
          content.setModel(this.getODataModel(), this.getModelName());
          content.setBindingContext(this.getEntryContext(), this.getModelName());
        }
        fragment.open(true);
      } else {
        fragment.destroyFragmentContent();
        throw new Error("Provided fragment must contain a sap.m.Dialog control. Put all the controls into a sap.m.Dialog");
      }
    },
    createObjectPage: async function _createObjectPage() {
      await this.initializeContext(this.settings.initializer);
      const content = new ContentCL(this.getSourceController(), this, ODataMethods.UPDATE, this.getModelName());

      // Create Object Page
      this.createObjectPageLayout();
      const objectPageInstance = this.getObjectPageInstance();
      objectPageInstance.addCompleteButton(this.getBeginButtonText(), this.getBeginButtonType());
      objectPageInstance.addCancelButton(this.getEndButtonText(), this.getEndButtonType());
      if (this.getFormType() === FormTypes.SMART) {
        await content.addSmartSections();
        objectPageInstance.getObjectPageLayout().setModel(this.getODataModel());
        objectPageInstance.getObjectPageLayout().setBindingContext(this.getEntryContext());
      } else {
        await content.addSimpleSections();
        objectPageInstance.getObjectPageLayout().setModel(this.getODataModel(), this.getModelName());
        objectPageInstance.getObjectPageLayout().setBindingContext(this.getEntryContext(), this.getModelName());
      }
      if (this.getCustomContents().length) {
        objectPageInstance.addEmptySection(this.getCustomContentSectionTitle());
        this.getCustomContents().forEach(customContent => {
          objectPageInstance.addContentToSection(customContent);
        });
      }
      await this.createTypedView();
      this.displayTypedView();
    },
    registerManualSubmit: function _registerManualSubmit(submitter, listener) {
      this.manualSubmitter = submitter;
      this.manualSubmitListener = listener;
    },
    submitManually: function _submitManually() {
      this.completeSubmit();
    }
  });
  return EntryUpdateCL;
});
},
	"ui5/antares/entry/v2/ResponseCL.js":function(){
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
},
	"ui5/antares/entry/v2/SimpleValidatorCL.js":function(){
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
},
	"ui5/antares/entry/v2/SmartValidatorCL.js":function(){
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
},
	"ui5/antares/library.js":function(){
"use strict";

sap.ui.define(["sap/ui/core/Lib"], function (Lib) {
  "use strict";

  const library = Lib.init({
    name: "ui5.antares",
    dependencies: ["sap.m", "sap.ui.core", "sap.ui.comp", "sap.ui.table", "sap.ui.layout"],
    controls: ["ui5.antares.base.v2.ModelCL", "ui5.antares.entity.v2.EntityCL", "ui5.antares.entry.v2.EntryCL", "ui5.antares.entry.v2.EntryCreateCL", "ui5.antares.entry.v2.EntryDeleteCL", "ui5.antares.entry.v2.EntryReadCL", "ui5.antares.entry.v2.EntryUpdateCL", "ui5.antares.entry.v2.ResponseCL", "ui5.antares.entry.v2.SimpleValidatorCL", "ui5.antares.entry.v2.SmartValidatorCL", "ui5.antares.odata.v2.ODataCL", "ui5.antares.odata.v2.ODataCreateCL", "ui5.antares.odata.v2.ODataDeleteCL", "ui5.antares.odata.v2.ODataReadCL", "ui5.antares.odata.v2.ODataUpdateCL", "ui5.antares.ui.ContentCL", "ui5.antares.ui.CustomControlCL", "ui5.antares.ui.DialogCL", "ui5.antares.ui.FragmentCL", "ui5.antares.ui.ValidationLogicCL", "ui5.antares.ui.ValueHelpCL", "ui5.antares.util.Util"],
    noLibraryCSS: true,
    version: "1.120.1014"
  });
  return library;
});
},
	"ui5/antares/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"ui5.antares","type":"library","title":"UI5 Antares","applicationVersion":{"version":"1.120.1014"}},"sap.ui5":{"dependencies":{"minUI5Version":"1.120.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.ui.comp":{},"sap.ui.table":{},"sap.ui.layout":{}}},"library":{"css":false}}}',
	"ui5/antares/odata/v2/ODataCL.js":function(){
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
},
	"ui5/antares/odata/v2/ODataCreateCL.js":function(){
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
  const ODataCreateCL = ODataCL.extend("ui5.antares.odata.v2.ODataCreateCL", {
    constructor: function _constructor(controller, entityPath, modelName) {
      ODataCL.prototype.constructor.call(this, controller, entityPath, ODataMethods.CREATE, modelName);
      this.refreshAfterChange = true;
    },
    setData: function _setData(data) {
      this.payload = data;
    },
    getData: function _getData() {
      return this.payload;
    },
    setUrlParameters: function _setUrlParameters(urlParameters) {
      this.urlParameters = urlParameters;
    },
    getUrlParameters: function _getUrlParameters() {
      return this.urlParameters;
    },
    setRefreshAfterChange: function _setRefreshAfterChange(refreshAfterChange) {
      this.refreshAfterChange = refreshAfterChange;
    },
    getRefreshAfterChange: function _getRefreshAfterChange() {
      return this.refreshAfterChange;
    },
    getResponse: function _getResponse() {
      return this.response;
    },
    createEntry: function _createEntry() {
      const oDataModel = this.getODataModel();
      const entry = oDataModel.createEntry(this.getEntityPath(), {
        properties: this.payload
      });
      return entry;
    },
    create: function _create() {
      this.checkData(this.payload);
      const oDataModel = this.getODataModel();
      return new Promise((resolve, reject) => {
        oDataModel.create(this.getEntityPath(), this.payload, {
          urlParameters: this.urlParameters,
          refreshAfterChange: this.refreshAfterChange,
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
  return ODataCreateCL;
});
},
	"ui5/antares/odata/v2/ODataDeleteCL.js":function(){
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
  const ODataDeleteCL = ODataCL.extend("ui5.antares.odata.v2.ODataDeleteCL", {
    constructor: function _constructor(controller, entityPath, modelName) {
      ODataCL.prototype.constructor.call(this, controller, entityPath, ODataMethods.DELETE, modelName);
      this.refreshAfterChange = true;
    },
    setUrlParameters: function _setUrlParameters(urlParameters) {
      this.urlParameters = urlParameters;
    },
    getUrlParameters: function _getUrlParameters() {
      return this.urlParameters;
    },
    setRefreshAfterChange: function _setRefreshAfterChange(refreshAfterChange) {
      this.refreshAfterChange = refreshAfterChange;
    },
    getRefreshAfterChange: function _getRefreshAfterChange() {
      return this.refreshAfterChange;
    },
    getResponse: function _getResponse() {
      return this.response;
    },
    delete: function _delete(keys) {
      const oDataModel = this.getODataModel();
      const path = oDataModel.createKey(this.getEntityPath(), keys);
      return new Promise((resolve, reject) => {
        oDataModel.remove(path, {
          urlParameters: this.urlParameters,
          refreshAfterChange: this.refreshAfterChange,
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
  return ODataDeleteCL;
});
},
	"ui5/antares/odata/v2/ODataReadCL.js":function(){
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
},
	"ui5/antares/odata/v2/ODataUpdateCL.js":function(){
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
  const ODataUpdateCL = ODataCL.extend("ui5.antares.odata.v2.ODataUpdateCL", {
    constructor: function _constructor(controller, entityPath, modelName) {
      ODataCL.prototype.constructor.call(this, controller, entityPath, ODataMethods.UPDATE, modelName);
      this.refreshAfterChange = true;
    },
    setData: function _setData(data) {
      this.payload = data;
    },
    getData: function _getData() {
      return this.payload;
    },
    setUrlParameters: function _setUrlParameters(urlParameters) {
      this.urlParameters = urlParameters;
    },
    getUrlParameters: function _getUrlParameters() {
      return this.urlParameters;
    },
    setRefreshAfterChange: function _setRefreshAfterChange(refreshAfterChange) {
      this.refreshAfterChange = refreshAfterChange;
    },
    getRefreshAfterChange: function _getRefreshAfterChange() {
      return this.refreshAfterChange;
    },
    getResponse: function _getResponse() {
      return this.response;
    },
    update: function _update(keys) {
      this.checkData(this.payload);
      const oDataModel = this.getODataModel();
      const path = oDataModel.createKey(this.getEntityPath(), keys);
      return new Promise((resolve, reject) => {
        oDataModel.update(path, this.payload, {
          urlParameters: this.urlParameters,
          refreshAfterChange: this.refreshAfterChange,
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
  return ODataUpdateCL;
});
},
	"ui5/antares/types/common.js":function(){
"use strict";
},
	"ui5/antares/types/entity/type.js":function(){
"use strict";
},
	"ui5/antares/types/entry/common.js":function(){
"use strict";
},
	"ui5/antares/types/entry/delete.js":function(){
"use strict";
},
	"ui5/antares/types/entry/enums.js":function(){
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
},
	"ui5/antares/types/entry/read.js":function(){
"use strict";
},
	"ui5/antares/types/entry/submit.js":function(){
"use strict";
},
	"ui5/antares/types/entry/update.js":function(){
"use strict";
},
	"ui5/antares/types/odata/enums.js":function(){
"use strict";

sap.ui.define([], function () {
  "use strict";

  var ODataMethods = /*#__PURE__*/function (ODataMethods) {
    ODataMethods["CREATE"] = "CREATE";
    ODataMethods["UPDATE"] = "UPDATE";
    ODataMethods["DELETE"] = "DELETE";
    ODataMethods["READ"] = "READ";
    return ODataMethods;
  }(ODataMethods || {});
  var __exports = {
    __esModule: true
  };
  __exports.ODataMethods = ODataMethods;
  return __exports;
});
},
	"ui5/antares/types/odata/read.js":function(){
"use strict";
},
	"ui5/antares/types/ui/enums.js":function(){
"use strict";

sap.ui.define([], function () {
  "use strict";

  var ValidationOperator = /*#__PURE__*/function (ValidationOperator) {
    ValidationOperator["BT"] = "BT";
    ValidationOperator["Contains"] = "Contains";
    ValidationOperator["EndsWith"] = "EndsWith";
    ValidationOperator["EQ"] = "EQ";
    ValidationOperator["GE"] = "GE";
    ValidationOperator["GT"] = "GT";
    ValidationOperator["LE"] = "LE";
    ValidationOperator["LT"] = "LT";
    ValidationOperator["NB"] = "NB";
    ValidationOperator["NE"] = "NE";
    ValidationOperator["NotContains"] = "NotContains";
    ValidationOperator["NotEndsWith"] = "NotEndsWith";
    ValidationOperator["NotStartsWith"] = "NotStartsWith";
    ValidationOperator["StartsWith"] = "StartsWith";
    return ValidationOperator;
  }(ValidationOperator || {});
  var __exports = {
    __esModule: true
  };
  __exports.ValidationOperator = ValidationOperator;
  return __exports;
});
},
	"ui5/antares/types/ui/validation.js":function(){
"use strict";
},
	"ui5/antares/types/ui/valuehelp.js":function(){
"use strict";

;
},
	"ui5/antares/ui/ContentCL.js":function(){
"use strict";

sap.ui.define(["ui5/antares/entity/v2/EntityCL", "sap/ui/comp/smartform/SmartForm", "sap/ui/comp/smartform/Group", "sap/ui/comp/smartfield/SmartField", "sap/ui/comp/smartform/GroupElement", "sap/ui/layout/form/SimpleForm", "sap/m/Label", "sap/m/CheckBox", "sap/m/DatePicker", "sap/m/DateTimePicker", "sap/m/Input", "ui5/antares/types/entry/enums", "sap/ui/core/CustomData", "ui5/antares/types/odata/enums", "sap/ui/core/Title", "sap/ui/comp/smartform/ColumnLayout"], function (__EntityCL, SmartForm, Group, SmartField, GroupElement, SimpleForm, Label, CheckBox, DatePicker, DateTimePicker, Input, __ui5_antares_types_entry_enums, CustomData, __ui5_antares_types_odata_enums, Title, ColumnLayout) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const EntityCL = _interopRequireDefault(__EntityCL);
  const FormTypes = __ui5_antares_types_entry_enums["FormTypes"];
  const GuidStrategies = __ui5_antares_types_entry_enums["GuidStrategies"];
  const ODataMethods = __ui5_antares_types_odata_enums["ODataMethods"];
  /**
   * @namespace ui5.antares.ui
   */
  const ContentCL = EntityCL.extend("ui5.antares.ui.ContentCL", {
    constructor: function _constructor(controller, entry, method, modelName) {
      EntityCL.prototype.constructor.call(this, controller, entry.getEntityName(), entry.getResourceBundlePrefix(), entry.getNamingStrategy(), modelName);
      this.numberTypes = ["Edm.Decimal", "Edm.Double", "Edm.Int16", "Edm.Int32", "Edm.Int64"];
      this.entry = entry;
      this.method = method;
    },
    getSmartForm: async function _getSmartForm() {
      const smartFormGroups = await this.getSmartFormGroups();
      const smartForm = new SmartForm({
        editTogglable: false,
        editable: true,
        title: this.entry.getFormTitle(),
        groups: smartFormGroups
      });
      if (this.entry.getFormGroups().length) {
        smartForm.setLayout(new ColumnLayout({
          columnsXL: 3,
          columnsL: 3,
          columnsM: 2
        }));
      }
      return smartForm;
    },
    getSimpleForm: async function _getSimpleForm() {
      const simpleFormContent = await this.getSimpleFormContent();
      const simpleForm = new SimpleForm({
        editable: true,
        layout: "ResponsiveGridLayout",
        columnsXL: 3,
        columnsL: 3,
        columnsM: 2,
        title: this.entry.getFormTitle(),
        content: simpleFormContent
      });
      if (this.entry.getFormGroups().length) {
        simpleForm.setLayout("ColumnLayout");
      }
      return simpleForm;
    },
    getSmartFormGroups: async function _getSmartFormGroups() {
      const formGroups = this.entry.getFormGroups();
      const smartGroups = [];
      this.smartGroup = new Group({
        title: this.entry.getDefaultGroupTitle()
      });
      smartGroups.push(this.smartGroup);
      // Key properties are always in the default group
      await this.addKeyProperties();
      if (formGroups.length) {
        if (this.entry.getIncludeAllProperties()) {
          await this.addDefaultGroupElements(formGroups);
        }
        for (const group of formGroups) {
          this.smartGroup = new Group({
            title: group.title === "UI5AntaresDefaultGroup" ? this.entry.getUnknownGroupTitle() : group.title
          });
          smartGroups.push(this.smartGroup);
          await this.addProperties(group);
        }
      } else {
        await this.addProperties();
      }
      return smartGroups;
    },
    getSimpleFormContent: async function _getSimpleFormContent() {
      const formGroups = this.entry.getFormGroups();
      this.simpleFormElements = [];
      if (this.entry.getDefaultGroupTitle()) {
        this.simpleFormElements.push(new Title({
          text: this.entry.getDefaultGroupTitle()
        }));
      }

      // Key properties are always in the default group
      await this.addKeyProperties();
      if (formGroups.length) {
        if (this.entry.getIncludeAllProperties()) {
          await this.addDefaultGroupElements(formGroups);
        }
        for (const group of formGroups) {
          this.simpleFormElements.push(new Title({
            text: group.title === "UI5AntaresDefaultGroup" ? this.entry.getUnknownGroupTitle() : group.title
          }));
          await this.addProperties(group);
        }
      } else {
        await this.addProperties();
      }
      return this.simpleFormElements;
    },
    addDefaultGroupElements: async function _addDefaultGroupElements(groups) {
      const groupProperties = groups.reduce((props, group) => props = [...props, ...group.properties], []);
      const entityTypeKeys = await this.getEntityTypeKeys();
      const entityTypeProperties = await this.getEntityTypeProperties();
      const defaultProperties = [];
      for (const property of entityTypeProperties) {
        if (entityTypeKeys.some(key => key.propertyName === property.propertyName) || this.entry.getExcludedProperties().includes(property.propertyName) || groupProperties.includes(property.propertyName)) {
          continue;
        }
        defaultProperties.push(property.propertyName);
      }
      if (defaultProperties.length) {
        groups.push({
          title: "UI5AntaresDefaultGroup",
          properties: defaultProperties
        });
      }
    },
    addKeyProperties: async function _addKeyProperties() {
      const entityTypeKeys = await this.getEntityTypeKeys();
      this.entry.setMandatoryProperties([...this.entry.getMandatoryProperties(), ...entityTypeKeys.map(key => key.propertyName)]);
      entityTypeKeys.forEach(key => {
        if (this.entry.getFormType() === FormTypes.SMART) {
          const customControl = this.entry.getCustomControl(key.propertyName);
          if (customControl) {
            this.addSmartCustomControl(customControl, key);
          } else {
            this.addSmartField(key, true);
          }
        } else {
          const customControl = this.entry.getCustomControl(key.propertyName);
          if (customControl) {
            this.addSimpleCustomControl(customControl, key);
          } else {
            this.addSimpleFormField(key, true);
          }
        }
      });
    },
    addProperties: async function _addProperties(group) {
      const entityTypeKeys = await this.getEntityTypeKeys();
      const entityTypeProperties = await this.getEntityTypeProperties();
      for (const property of this.entry.getPropertyOrder()) {
        if (entityTypeKeys.some(key => key.propertyName === property) || !entityTypeProperties.some(prop => prop.propertyName === property)) {
          continue;
        }
        if (group) {
          if (!group.properties.includes(property)) {
            continue;
          }
        }
        let entityTypeProperty = entityTypeProperties.find(prop => prop.propertyName === property);
        if (this.entry.getFormType() === FormTypes.SMART) {
          const customControl = this.entry.getCustomControl(property);
          if (customControl) {
            this.addSmartCustomControl(customControl, entityTypeProperty);
          } else {
            this.addSmartField(entityTypeProperty);
          }
        } else {
          const customControl = this.entry.getCustomControl(property);
          if (customControl) {
            this.addSimpleCustomControl(customControl, entityTypeProperty);
          } else {
            this.addSimpleFormField(entityTypeProperty);
          }
        }
      }
      if (this.entry.getUseAllProperties()) {
        for (const property of entityTypeProperties) {
          if (entityTypeKeys.some(key => key.propertyName === property.propertyName) || this.entry.getPropertyOrder().includes(property.propertyName) || this.entry.getExcludedProperties().includes(property.propertyName)) {
            continue;
          }
          if (group) {
            if (!group.properties.includes(property.propertyName)) {
              continue;
            }
          }
          if (this.entry.getFormType() === FormTypes.SMART) {
            const customControl = this.entry.getCustomControl(property.propertyName);
            if (customControl) {
              this.addSmartCustomControl(customControl, property);
            } else {
              this.addSmartField(property);
            }
          } else {
            const customControl = this.entry.getCustomControl(property.propertyName);
            if (customControl) {
              this.addSimpleCustomControl(customControl, property);
            } else {
              this.addSimpleFormField(property);
            }
          }
        }
      }
    },
    addSmartField: function _addSmartField(property) {
      let keyField = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      const smartField = new SmartField({
        mandatory: this.entry.getMandatoryProperties().includes(property.propertyName),
        value: `{${property.propertyName}}`
      });
      if (property.nullable === "false") {
        smartField.setMandatory(true);
      }
      smartField.addCustomData(new CustomData({
        key: "UI5AntaresStandardControlName",
        value: property.propertyName
      }));
      smartField.addCustomData(new CustomData({
        key: "UI5AntaresStandardControlType",
        value: property.propertyType
      }));
      if (this.method === ODataMethods.UPDATE && keyField || this.method === ODataMethods.DELETE || this.method === ODataMethods.READ) {
        smartField.setEditable(false);
      }
      if (this.method === ODataMethods.CREATE) {
        switch (this.entry.getGenerateRandomGuid()) {
          case GuidStrategies.ALL:
            if (property.propertyType === "Edm.Guid") {
              smartField.setEditable(false);
            }
            break;
          case GuidStrategies.ONLY_KEY:
            if (property.propertyType === "Edm.Guid" && keyField) {
              smartField.setEditable(false);
            }
            break;
          case GuidStrategies.ONLY_NON_KEY:
            if (property.propertyType === "Edm.Guid" && !keyField) {
              smartField.setEditable(false);
            }
            break;
        }
      }
      switch (this.entry.getDisplayGuidProperties()) {
        case GuidStrategies.NONE:
          if (property.propertyType === "Edm.Guid" && !this.entry.getFormGroups().length) {
            smartField.setVisible(false);
          }
          break;
        case GuidStrategies.ONLY_KEY:
          if (property.propertyType === "Edm.Guid" && !keyField && !this.entry.getFormGroups().length) {
            smartField.setVisible(false);
          }
          break;
        case GuidStrategies.ONLY_NON_KEY:
          if (property.propertyType === "Edm.Guid" && keyField && !this.entry.getFormGroups().length) {
            smartField.setVisible(false);
          }
          break;
      }
      if (this.entry.getReadonlyProperties().includes(property.propertyName)) {
        smartField.setEditable(false);
      }
      const customData = this.entry.getFieldCustomData().find(data => data.propertyName === property.propertyName);
      if (customData) {
        smartField.addCustomData(customData.customData);
      }
      const editMode = this.entry.getTextInEditModeSource().find(mode => mode.propertyName === property.propertyName);
      if (editMode) {
        smartField.setTextInEditModeSource(editMode.textInEditModeSource);
      }
      const groupElement = new GroupElement({
        elements: [smartField]
      });
      if (!this.entry.getUseMetadataLabels()) {
        groupElement.setLabel(this.getEntityTypePropLabel(property.propertyName));
      }
      this.smartGroup.addGroupElement(groupElement);
    },
    addSimpleFormField: function _addSimpleFormField(property) {
      let keyField = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (this.entry.getUseMetadataLabels()) {
        this.simpleFormElements.push(new Label({
          text: property.annotationLabel || this.getEntityTypePropLabel(property.propertyName)
        }));
      } else {
        this.simpleFormElements.push(new Label({
          text: this.getEntityTypePropLabel(property.propertyName)
        }));
      }
      switch (property.propertyType) {
        case "Edm.Boolean":
          this.addCheckBox(property, keyField);
          break;
        case "Edm.DateTime":
          if (property.displayFormat === "Date") {
            this.addDatePicker(property, keyField);
          } else {
            this.addDateTimePicker(property, keyField);
          }
          break;
        case "Edm.DateTimeOffset":
          this.addDateTimePicker(property, keyField);
          break;
        default:
          this.addInput(property, keyField);
          break;
      }
    },
    addCheckBox: function _addCheckBox(property, keyField) {
      const selectedPath = this.getModelName() ? `${this.getModelName()}>${property.propertyName}` : property.propertyName;
      const checkbox = new CheckBox({
        selected: {
          path: selectedPath
        }
      });
      if (this.method === ODataMethods.UPDATE && keyField || this.method === ODataMethods.DELETE || this.method === ODataMethods.READ) {
        checkbox.setEditable(false);
      }
      if (this.entry.getReadonlyProperties().includes(property.propertyName)) {
        checkbox.setEditable(false);
      }
      const customData = this.entry.getFieldCustomData().find(data => data.propertyName === property.propertyName);
      if (customData) {
        checkbox.addCustomData(customData.customData);
      }
      this.simpleFormElements.push(checkbox);
    },
    addDatePicker: function _addDatePicker(property, keyField) {
      const valuePath = this.getModelName() ? `${this.getModelName()}>${property.propertyName}` : property.propertyName;
      const dateValue = {
        path: valuePath,
        type: "sap.ui.model.odata.type.DateTime",
        constraints: {
          displayFormat: "Date"
        }
      };
      const datePicker = new DatePicker({
        dateValue: dateValue
      });
      datePicker.addCustomData(new CustomData({
        key: "UI5AntaresStandardControlName",
        value: property.propertyName
      }));
      datePicker.addCustomData(new CustomData({
        key: "UI5AntaresStandardControlType",
        value: property.propertyType
      }));
      if (this.method === ODataMethods.UPDATE && keyField || this.method === ODataMethods.DELETE || this.method === ODataMethods.READ) {
        datePicker.setEditable(false);
      }
      if (this.entry.getMandatoryProperties().includes(property.propertyName) || property.nullable === "false") {
        datePicker.setRequired(true);
      }
      if (this.entry.getReadonlyProperties().includes(property.propertyName)) {
        datePicker.setEditable(false);
      }
      const customData = this.entry.getFieldCustomData().find(data => data.propertyName === property.propertyName);
      if (customData) {
        datePicker.addCustomData(customData.customData);
      }
      this.simpleFormElements.push(datePicker);
    },
    addDateTimePicker: function _addDateTimePicker(property, keyField) {
      const valuePath = this.getModelName() ? `${this.getModelName()}>${property.propertyName}` : property.propertyName;
      const dateTimePicker = new DateTimePicker({
        dateValue: {
          path: valuePath,
          type: "sap.ui.model.odata.type.DateTimeOffset"
        }
      });
      dateTimePicker.addCustomData(new CustomData({
        key: "UI5AntaresStandardControlName",
        value: property.propertyName
      }));
      dateTimePicker.addCustomData(new CustomData({
        key: "UI5AntaresStandardControlType",
        value: property.propertyType
      }));
      if (this.method === ODataMethods.UPDATE && keyField || this.method === ODataMethods.DELETE || this.method === ODataMethods.READ) {
        dateTimePicker.setEditable(false);
      }
      if (this.entry.getMandatoryProperties().includes(property.propertyName) || property.nullable === "false") {
        dateTimePicker.setRequired(true);
      }
      if (this.entry.getReadonlyProperties().includes(property.propertyName)) {
        dateTimePicker.setEditable(false);
      }
      const customData = this.entry.getFieldCustomData().find(data => data.propertyName === property.propertyName);
      if (customData) {
        dateTimePicker.addCustomData(customData.customData);
      }
      this.simpleFormElements.push(dateTimePicker);
    },
    addInput: function _addInput(property, keyField) {
      const valueHelp = this.entry.getValueHelp(property.propertyName);
      const valuePath = this.getModelName() ? `${this.getModelName()}>${property.propertyName}` : property.propertyName;
      const inputValue = {
        path: valuePath
      };
      if (this.numberTypes.includes(property.propertyType)) {
        inputValue.type = `sap.ui.model.odata.type.${property.propertyType.slice(4)}`;
        switch (property.propertyType) {
          case "Edm.Decimal":
            if (property.precision && property.scale) {
              inputValue.constraints = {
                precision: property.precision,
                scale: property.scale
              };
            }
            break;
          default:
            const groupingEnabled = property.propertyType === "Edm.Double";
            inputValue.formatOptions = {
              groupingEnabled: groupingEnabled
            };
            break;
        }
      }
      const input = new Input({
        value: inputValue
      });
      input.addCustomData(new CustomData({
        key: "UI5AntaresStandardControlName",
        value: property.propertyName
      }));
      input.addCustomData(new CustomData({
        key: "UI5AntaresStandardControlType",
        value: property.propertyType
      }));
      if (this.method === ODataMethods.UPDATE && keyField || this.method === ODataMethods.DELETE || this.method === ODataMethods.READ) {
        input.setEditable(false);
      }
      if (this.method === ODataMethods.CREATE) {
        switch (this.entry.getGenerateRandomGuid()) {
          case GuidStrategies.ALL:
            if (property.propertyType === "Edm.Guid") {
              input.setEditable(false);
            }
            break;
          case GuidStrategies.ONLY_KEY:
            if (property.propertyType === "Edm.Guid" && keyField) {
              input.setEditable(false);
            }
            break;
          case GuidStrategies.ONLY_NON_KEY:
            if (property.propertyType === "Edm.Guid" && !keyField) {
              input.setEditable(false);
            }
            break;
        }
      }
      switch (this.entry.getDisplayGuidProperties()) {
        case GuidStrategies.NONE:
          if (property.propertyType === "Edm.Guid" && !this.entry.getFormGroups().length) {
            input.setVisible(false);
          }
          break;
        case GuidStrategies.ONLY_KEY:
          if (property.propertyType === "Edm.Guid" && !keyField && !this.entry.getFormGroups().length) {
            input.setVisible(false);
          }
          break;
        case GuidStrategies.ONLY_NON_KEY:
          if (property.propertyType === "Edm.Guid" && keyField && !this.entry.getFormGroups().length) {
            input.setVisible(false);
          }
          break;
      }
      if (this.entry.getMandatoryProperties().includes(property.propertyName) || property.nullable === "false") {
        input.setRequired(true);
      }
      if (this.entry.getReadonlyProperties().includes(property.propertyName)) {
        input.setEditable(false);
      }
      if (valueHelp) {
        input.setShowValueHelp(true);
        input.attachValueHelpRequest({}, valueHelp.openValueHelpDialog, valueHelp);
      }
      const customData = this.entry.getFieldCustomData().find(data => data.propertyName === property.propertyName);
      if (customData) {
        input.addCustomData(customData.customData);
      }
      this.simpleFormElements.push(input);
    },
    addSmartCustomControl: function _addSmartCustomControl(control, property) {
      const groupElement = new GroupElement({
        elements: [control.getControl()]
      });
      if (this.entry.getUseMetadataLabels()) {
        groupElement.setLabel(property.annotationLabel || this.getEntityTypePropLabel(property.propertyName));
      } else {
        groupElement.setLabel(this.getEntityTypePropLabel(property.propertyName));
      }
      this.smartGroup.addGroupElement(groupElement);
    },
    addSimpleCustomControl: function _addSimpleCustomControl(control, property) {
      if (this.entry.getUseMetadataLabels()) {
        this.simpleFormElements.push(new Label({
          text: property.annotationLabel || this.getEntityTypePropLabel(property.propertyName)
        }));
      } else {
        this.simpleFormElements.push(new Label({
          text: this.getEntityTypePropLabel(property.propertyName)
        }));
      }
      this.simpleFormElements.push(control.getControl());
    },
    addSmartSections: async function _addSmartSections() {
      const objectPageInstance = this.entry.getObjectPageInstance();
      const formGroups = this.entry.getFormGroups();
      const smartFormForKeys = this.createSmartForm();
      await this.addKeyProperties();
      objectPageInstance.addSection(smartFormForKeys, this.entry.getDefaultGroupTitle() || this.entry.getFormTitle());
      if (formGroups.length) {
        if (this.entry.getIncludeAllProperties()) {
          await this.addDefaultGroupElements(formGroups);
        }
        for (const group of formGroups) {
          const smartForm = this.createSmartForm();
          await this.addProperties(group);
          objectPageInstance.addSection(smartForm, group.title === "UI5AntaresDefaultGroup" ? this.entry.getUnknownGroupTitle() : group.title);
        }
      } else {
        await this.addProperties();
      }
    },
    addSimpleSections: async function _addSimpleSections() {
      const objectPageInstance = this.entry.getObjectPageInstance();
      const formGroups = this.entry.getFormGroups();
      const simpleFormForKeys = this.createSimpleForm();
      await this.addKeyProperties();
      this.simpleFormElements.forEach(element => {
        simpleFormForKeys.addContent(element);
      });
      objectPageInstance.addSection(simpleFormForKeys, this.entry.getDefaultGroupTitle() || this.entry.getFormTitle());
      if (formGroups.length) {
        if (this.entry.getIncludeAllProperties()) {
          await this.addDefaultGroupElements(formGroups);
        }
        for (const group of formGroups) {
          const simpleForm = this.createSimpleForm();
          await this.addProperties(group);
          this.simpleFormElements.forEach(element => {
            simpleForm.addContent(element);
          });
          objectPageInstance.addSection(simpleForm, group.title === "UI5AntaresDefaultGroup" ? this.entry.getUnknownGroupTitle() : group.title);
        }
      } else {
        this.simpleFormElements = [];
        await this.addProperties();
        this.simpleFormElements.forEach(element => {
          simpleFormForKeys.addContent(element);
        });
      }
    },
    createSmartForm: function _createSmartForm() {
      this.smartGroup = new Group();
      const smartForm = new SmartForm({
        editTogglable: false,
        editable: true,
        groups: this.smartGroup,
        layout: new ColumnLayout({
          columnsXL: 1,
          columnsL: 1,
          columnsM: 1,
          emptyCellsLarge: 5
        })
      });
      return smartForm;
    },
    createSimpleForm: function _createSimpleForm() {
      this.simpleFormElements = [];
      const simpleForm = new SimpleForm({
        editable: true,
        layout: "ColumnLayout",
        emptySpanXL: 5,
        emptySpanL: 5,
        emptySpanM: 5,
        emptySpanS: 5,
        columnsXL: 1,
        columnsL: 1,
        columnsM: 1
      });
      return simpleForm;
    }
  });
  return ContentCL;
});
},
	"ui5/antares/ui/CustomControlCL.js":function(){
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
},
	"ui5/antares/ui/DialogCL.js":function(){
"use strict";

sap.ui.define(["sap/m/Button", "sap/m/Dialog", "sap/ui/base/Object"], function (Button, Dialog, BaseObject) {
  "use strict";

  /**
   * @namespace ui5.antares.ui
   */
  const DialogCL = BaseObject.extend("ui5.antares.ui.DialogCL", {
    constructor: function _constructor(dialogId) {
      BaseObject.prototype.constructor.call(this);
      this.dialogId = dialogId;
      this.dialog = new Dialog({
        id: this.dialogId,
        showHeader: false,
        resizable: true,
        draggable: true
      });
    },
    addBeginButton: function _addBeginButton(buttonText, buttonType, pressEventHandler, listener) {
      this.dialog.setBeginButton(new Button({
        text: buttonText,
        type: buttonType,
        press: pressEventHandler.bind(listener)
      }));
    },
    addEndButton: function _addEndButton(buttonText, buttonType, pressEventHandler, listener) {
      this.dialog.setEndButton(new Button({
        text: buttonText,
        type: buttonType,
        press: pressEventHandler.bind(listener)
      }));
    },
    addEscapeHandler: function _addEscapeHandler(escapeHandler, listener) {
      this.dialog.setEscapeHandler(escapeHandler.bind(listener));
    },
    addContent: function _addContent(content) {
      this.dialog.addContent(content);
    },
    getDialog: function _getDialog() {
      return this.dialog;
    }
  });
  return DialogCL;
});
},
	"ui5/antares/ui/FragmentCL.js":function(){
"use strict";

sap.ui.define(["sap/m/BusyDialog", "sap/m/ColorPalettePopover", "sap/m/Dialog", "sap/m/MessagePopover", "sap/m/Popover", "sap/m/ResponsivePopover", "sap/m/SelectDialog", "sap/m/TableSelectDialog", "sap/m/ViewSettingsDialog", "sap/ui/base/Object", "sap/ui/comp/valuehelpdialog/ValueHelpDialog", "sap/ui/core/Fragment", "sap/ui/core/mvc/Controller"], function (BusyDialog, ColorPalettePopover, Dialog, MessagePopover, Popover, ResponsivePopover, SelectDialog, TableSelectDialog, ViewSettingsDialog, BaseObject, ValueHelpDialog, Fragment, Controller) {
  "use strict";

  /**
   * @namespace ui5.antares.ui
   */
  const FragmentCL = BaseObject.extend("ui5.antares.ui.FragmentCL", {
    constructor: function _constructor(controller, fragmentPath, openByControl) {
      BaseObject.prototype.constructor.call(this);
      this.autoDestroyOnESC = false;
      this.selectDialogSearchValue = "";
      this.sourceController = controller;
      this.fragmentPath = fragmentPath;
      this.openByControl = openByControl;
      if (controller instanceof Controller) {
        this.sourceView = controller.getView();
      }
    },
    openAsync: async function _openAsync() {
      let viewDependent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      const fragment = await this.load();
      if (fragment instanceof Dialog || fragment instanceof ValueHelpDialog || fragment instanceof BusyDialog || fragment instanceof ViewSettingsDialog) {
        if (this.sourceView && viewDependent) {
          this.sourceView.addDependent(fragment);
        }
        fragment.open();
        return fragment;
      }
      if (fragment instanceof SelectDialog || fragment instanceof TableSelectDialog) {
        if (this.sourceView && viewDependent) {
          this.sourceView.addDependent(fragment);
        }
        fragment.open(this.selectDialogSearchValue);
        return fragment;
      }
      if (fragment instanceof Popover || fragment instanceof MessagePopover || fragment instanceof ResponsivePopover || fragment instanceof ColorPalettePopover) {
        if (!this.openByControl) {
          this.fragment.destroy();
          throw new Error("Popover requires a control to be opened by. Provide the control through the class constructor.");
        }
        if (this.sourceView && viewDependent) {
          this.sourceView.addDependent(fragment);
        }
        fragment.openBy(this.openByControl);
        return fragment;
      }
      throw new Error("openAsync() method can only be used with fragments that contain Dialog or Popover.");
    },
    open: function _open() {
      let viewDependent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (!this.fragment) {
        throw new Error("No fragment was found to open. Use load() method to initialize the fragment.");
      }
      if (this.fragment instanceof Dialog || this.fragment instanceof ValueHelpDialog || this.fragment instanceof BusyDialog || this.fragment instanceof ViewSettingsDialog) {
        if (this.sourceView && viewDependent) {
          this.sourceView.addDependent(this.fragment);
        }
        this.fragment.open();
        return this.fragment;
      }
      if (this.fragment instanceof SelectDialog || this.fragment instanceof TableSelectDialog) {
        if (this.sourceView && viewDependent) {
          this.sourceView.addDependent(this.fragment);
        }
        this.fragment.open(this.selectDialogSearchValue);
        return this.fragment;
      }
      if (this.fragment instanceof Popover || this.fragment instanceof MessagePopover || this.fragment instanceof ResponsivePopover || this.fragment instanceof ColorPalettePopover) {
        if (!this.openByControl) {
          this.fragment.destroy();
          throw new Error("Popover requires a control to be opened by. Provide the control through the class constructor.");
        }
        if (this.sourceView && viewDependent) {
          this.sourceView.addDependent(this.fragment);
        }
        this.fragment.openBy(this.openByControl);
        return this.fragment;
      }
      this.destroyFragmentContent();
      throw new Error("open() method can only be used with fragments that contain Dialog or Popover.");
    },
    getFragmentContent: function _getFragmentContent() {
      if (!this.fragment) {
        throw new Error("No fragment was found to return. Use load() or openAsync() method to initialize the fragment.");
      }
      return this.fragment;
    },
    close: function _close() {
      if (!this.fragment) {
        throw new Error("No fragment was found to close. Use load() or openAsync() method to initialize the fragment.");
      }
      if (this.fragment instanceof Dialog || this.fragment instanceof Popover || this.fragment instanceof MessagePopover || this.fragment instanceof ResponsivePopover || this.fragment instanceof ValueHelpDialog) {
        if (this.fragment.isOpen()) {
          this.fragment.close();
        }
      } else if (this.fragment instanceof BusyDialog) {
        this.fragment.close();
      } else {
        this.destroyFragmentContent();
        throw new Error("close() method can only be used with fragments that contain Dialog or Popover.");
      }
    },
    destroyFragmentContent: function _destroyFragmentContent() {
      if (!this.fragment) {
        throw new Error("No fragment was found to destroy. Use load() or openAsync() method to initialize the fragment.");
      }
      if (Array.isArray(this.fragment)) {
        this.fragment.forEach(control => {
          if (!control.isDestroyed()) {
            control.destroy();
          }
        });
      } else {
        if (!this.fragment.isDestroyed()) {
          this.fragment.destroy();
        }
      }
    },
    closeAndDestroy: function _closeAndDestroy() {
      this.close();
      this.destroyFragmentContent();
    },
    load: async function _load() {
      const sourceView = this.sourceView;
      if (!sourceView) {
        throw new Error("FragmentCL methods can only be used in a controller!");
      }
      const fragment = await Fragment.load({
        id: sourceView.getId(),
        name: this.fragmentPath,
        controller: this.sourceController
      });
      if (fragment instanceof Dialog && this.autoDestroyOnESC) {
        fragment.setEscapeHandler(this.onESCTriggered.bind(this));
      }
      this.fragment = fragment;
      return fragment;
    },
    setAutoDestroyOnESC: function _setAutoDestroyOnESC(destroy) {
      this.autoDestroyOnESC = destroy;
    },
    onESCTriggered: function _onESCTriggered(event) {
      event.resolve();
      this.destroyFragmentContent();
    },
    setSearchValue: function _setSearchValue(value) {
      this.selectDialogSearchValue = value;
    }
  });
  return FragmentCL;
});
},
	"ui5/antares/ui/ObjectPageLayoutCL.js":function(){
"use strict";

sap.ui.define(["sap/m/Avatar", "sap/m/Button", "sap/m/FlexBox", "sap/m/Label", "sap/m/Title", "sap/ui/base/Object", "sap/uxap/ObjectPageDynamicHeaderTitle", "sap/uxap/ObjectPageLayout", "sap/uxap/ObjectPageSection", "sap/uxap/ObjectPageSubSection"], function (Avatar, Button, FlexBox, Label, Title, BaseObject, ObjectPageDynamicHeaderTitle, ObjectPageLayout, ObjectPageSection, ObjectPageSubSection) {
  "use strict";

  /**
   * @namespace ui5.antares.ui
   */
  const ObjectPageLayoutCL = BaseObject.extend("ui5.antares.ui.ObjectPageLayoutCL", {
    constructor: function _constructor(headerText, avatarSrc, headerLabel) {
      BaseObject.prototype.constructor.call(this);
      const avatar = new Avatar({
        src: avatarSrc
      });
      avatar.addStyleClass("sapUiTinyMarginEnd");
      const label = new Label({
        text: headerLabel
      });
      label.addStyleClass("sapUiTinyMarginBegin");
      this.objectPageLayout = new ObjectPageLayout({
        id: "UI5AntaresObjectPageViewID--UI5AntaresObjectPageLayout",
        upperCaseAnchorBar: false,
        headerTitle: new ObjectPageDynamicHeaderTitle({
          expandedHeading: new Title({
            text: headerText,
            wrapping: true
          }),
          snappedHeading: new FlexBox({
            fitContainer: true,
            alignItems: "Center",
            items: [avatar, new Title({
              text: headerText,
              wrapping: true
            })]
          })
        }),
        headerContent: new FlexBox({
          wrap: "Wrap",
          fitContainer: true,
          alignItems: "Center",
          items: [new Avatar({
            src: avatarSrc
          }), label]
        })
      });
    },
    addCompleteButton: function _addCompleteButton(buttonText, buttonType) {
      const headerTitle = this.objectPageLayout.getHeaderTitle();
      headerTitle.addAction(new Button({
        id: "UI5AntaresObjectPageViewID--UI5AntaresObjectPageCompleteButton",
        text: buttonText,
        type: buttonType
      }));
    },
    addCancelButton: function _addCancelButton(buttonText, buttonType) {
      const headerTitle = this.objectPageLayout.getHeaderTitle();
      headerTitle.addAction(new Button({
        id: "UI5AntaresObjectPageViewID--UI5AntaresObjectPageCancelButton",
        text: buttonText,
        type: buttonType
      }));
    },
    addSection: function _addSection(content, sectionTitle) {
      const subSection = new ObjectPageSubSection({
        titleUppercase: false,
        blocks: content
      });
      const section = new ObjectPageSection({
        titleUppercase: false,
        title: sectionTitle,
        subSections: subSection
      });
      this.objectPageLayout.addSection(section);
    },
    addEmptySection: function _addEmptySection(sectionTitle) {
      const subSection = new ObjectPageSubSection({
        titleUppercase: false
      });
      this.emptySection = new ObjectPageSection({
        titleUppercase: false,
        title: sectionTitle,
        subSections: subSection
      });
      this.objectPageLayout.addSection(this.emptySection);
    },
    addContentToSection: function _addContentToSection(content) {
      this.emptySection.getSubSections()[0].addBlock(content);
    },
    getObjectPageLayout: function _getObjectPageLayout() {
      return this.objectPageLayout;
    }
  });
  return ObjectPageLayoutCL;
});
},
	"ui5/antares/ui/ValidationLogicCL.js":function(){
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
},
	"ui5/antares/ui/ValueHelpCL.js":function(){
"use strict";

sap.ui.define(["sap/m/Column", "sap/m/Text", "ui5/antares/base/v2/ModelCL", "ui5/antares/types/entry/enums", "ui5/antares/entity/v2/EntityCL", "sap/m/ColumnListItem", "sap/m/Input", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/comp/valuehelpdialog/ValueHelpDialog", "sap/ui/table/Table", "sap/m/Table", "sap/ui/table/Column", "sap/m/Label", "sap/ui/comp/filterbar/FilterBar", "sap/ui/comp/filterbar/FilterGroupItem", "sap/m/SearchField", "sap/m/DatePicker", "sap/m/DateTimePicker", "sap/m/CheckBox", "sap/ui/model/json/JSONModel"], function (Column, Text, __ModelCL, __ui5_antares_types_entry_enums, __EntityCL, ColumnListItem, Input, Filter, FilterOperator, ValueHelpDialog, UITable, Table, UIColumn, Label, FilterBar, FilterGroupItem, SearchField, DatePicker, DateTimePicker, CheckBox, JSONModel) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ModelCL = _interopRequireDefault(__ModelCL);
  const NamingStrategies = __ui5_antares_types_entry_enums["NamingStrategies"];
  const EntityCL = _interopRequireDefault(__EntityCL);
  /**
   * @namespace ui5.antares.ui
   */
  const ValueHelpCL = ModelCL.extend("ui5.antares.ui.ValueHelpCL", {
    constructor: function _constructor(controller, settings, modelName) {
      ModelCL.prototype.constructor.call(this, controller, modelName);
      this.numberTypes = ["Edm.Decimal", "Edm.Double", "Edm.Int16", "Edm.Int32", "Edm.Int64"];
      this.propertyName = settings.propertyName;
      this.valueHelpEntity = settings.valueHelpEntity.startsWith("/") ? settings.valueHelpEntity.slice(1) : settings.valueHelpEntity;
      this.entityPath = `/${this.valueHelpEntity}`;
      this.valueHelpProperty = settings.valueHelpProperty;
      this.title = settings.title || `${this.valueHelpEntity}`;
      this.searchPlaceholder = settings.searchPlaceholder || `Search ${this.valueHelpEntity}`;
      this.readonlyProperties = settings.readonlyProperties || [];
      this.excludedFilterProperties = settings.excludedFilterProperties || [];
      this.namingStrategy = settings.namingStrategy || NamingStrategies.CAMEL_CASE;
      this.resourceBundlePrefix = settings.resourceBundlePrefix || "antaresVH";
      this.useMetadataLabels = settings.useMetadataLabels === undefined ? false : settings.useMetadataLabels;
      this.filterModelName = settings.filterModelName || "UI5AntaresVHFilterModel";
      this.caseSensitive = settings.filterCaseSensitive ?? false;
    },
    openValueHelpDialog: function _openValueHelpDialog(event) {
      this.getValueHelpDialog().then(dialog => {
        dialog.open();
        if (this.initialFilters) {
          this.applyInitialFilters();
        }
        if (this.afterDialogOpened) {
          this.afterDialogOpened.call(this.afterOpenedListener || this.getSourceController(), this.valueHelpDialog);
        }
      });
      this.sourceControl = event.getSource();
    },
    getPropertyName: function _getPropertyName() {
      return this.propertyName;
    },
    getValueHelpDialog: async function _getValueHelpDialog() {
      const entity = new EntityCL(this.getSourceController(), this.valueHelpEntity, this.resourceBundlePrefix, this.namingStrategy, this.getModelName());
      this.valueHelpDialog = new ValueHelpDialog({
        title: this.title,
        supportRanges: false,
        supportMultiselect: false,
        ok: this.onConfirm.bind(this),
        cancel: this.onCancel.bind(this),
        afterClose: this.onAfterClose.bind(this),
        key: this.valueHelpProperty
      });
      this.entityTypeProperties = await entity.getEntityTypeProperties();
      this.addFilterBar(this.valueHelpDialog);
      this.addSearchField(this.valueHelpDialog);
      const table = await this.valueHelpDialog.getTableAsync();
      if (table instanceof UITable) {
        this.bindUITable(table, this.valueHelpDialog);
      }
      if (table instanceof Table) {
        this.bindTable(table, this.valueHelpDialog);
      }
      this.valueHelpDialog.update();
      return this.valueHelpDialog;
    },
    onConfirm: function _onConfirm(event) {
      const selectedTokens = event.getParameter("tokens");
      if (selectedTokens) {
        this.sourceControl.setValue(selectedTokens[0].getKey());
        if (this.afterSelect) {
          const selectedRow = selectedTokens[0].getCustomData().find(data => data.getKey() === "row");
          if (selectedRow) {
            this.afterSelect.call(this.afterSelectListener || this.getSourceController(), selectedRow.getValue());
          } else {
            this.afterSelect.call(this.afterSelectListener || this.getSourceController(), selectedTokens[0].getKey());
          }
        }
      }
      this.valueHelpDialog.close();
    },
    onCancel: function _onCancel() {
      this.valueHelpDialog.close();
    },
    onAfterClose: function _onAfterClose() {
      this.valueHelpDialog.destroy();
    },
    addFilterBar: function _addFilterBar(valueHelpDialog) {
      const filterGroupItems = this.getFilterGroupItems();
      this.filterBar = new FilterBar({
        advancedMode: true,
        isRunningInValueHelpDialog: true,
        search: this.onFilterBarSearch.bind(this),
        filterGroupItems: filterGroupItems
      });
      this.createFilterModel();
      this.filterBar.setModel(this.filterModel, this.filterModelName);
      valueHelpDialog.setFilterBar(this.filterBar);
    },
    getFilterGroupItems: function _getFilterGroupItems() {
      const entity = new EntityCL(this.getSourceController(), this.valueHelpEntity, this.resourceBundlePrefix, this.namingStrategy, this.getModelName());
      const keyProperty = this.entityTypeProperties.find(prop => prop.propertyName === this.valueHelpProperty);
      if (!keyProperty) {
        throw new Error(`Property ${this.valueHelpProperty} does not exist on entity ${this.valueHelpEntity}!`);
      }
      let keyPropertyLabel = entity.getEntityTypePropLabel(this.valueHelpProperty);
      if (this.useMetadataLabels) {
        keyPropertyLabel = keyProperty.annotationLabel || entity.getEntityTypePropLabel(this.valueHelpProperty);
      }
      const groupItems = [new FilterGroupItem({
        groupName: "__$INTERNAL$",
        name: this.valueHelpProperty,
        label: keyPropertyLabel,
        visibleInFilterBar: true,
        control: this.getFilterControl(keyProperty)
      })];
      for (const property of this.readonlyProperties) {
        const readonlyProperty = this.entityTypeProperties.find(prop => prop.propertyName === property);
        if (!readonlyProperty) {
          throw new Error(`Property ${property} does not exist on entity ${this.valueHelpEntity}!`);
        }
        if (this.excludedFilterProperties.includes(property)) {
          continue;
        }
        let readonlyPropertyLabel = entity.getEntityTypePropLabel(property);
        if (this.useMetadataLabels) {
          readonlyPropertyLabel = readonlyProperty.annotationLabel || entity.getEntityTypePropLabel(property);
        }
        groupItems.push(new FilterGroupItem({
          groupName: "__$INTERNAL$",
          name: property,
          label: readonlyPropertyLabel,
          visibleInFilterBar: true,
          control: this.getFilterControl(readonlyProperty)
        }));
      }
      return groupItems;
    },
    getFilterControl: function _getFilterControl(property) {
      switch (property.propertyType) {
        case "Edm.DateTime":
          return this.getDatePickerControl(property);
        case "Edm.DateTimeOffset":
          return this.getDateTimePickerControl(property);
        case "Edm.Boolean":
          return this.getCheckBoxControl(property);
        default:
          return this.getInputControl(property);
      }
    },
    getInputControl: function _getInputControl(property) {
      const inputValue = {
        path: `${this.filterModelName}>/${property.propertyName}`
      };
      if (this.numberTypes.includes(property.propertyType)) {
        inputValue.type = `sap.ui.model.odata.type.${property.propertyType.slice(4)}`;
        switch (property.propertyType) {
          case "Edm.Decimal":
            if (property.precision && property.scale) {
              inputValue.constraints = {
                precision: property.precision,
                scale: property.scale
              };
            }
            break;
          default:
            const groupingEnabled = property.propertyType === "Edm.Double";
            inputValue.formatOptions = {
              groupingEnabled: groupingEnabled
            };
            break;
        }
      }
      const input = new Input({
        name: property.propertyName,
        value: inputValue,
        submit: () => {
          this.filterBar.search();
        }
      });
      return input;
    },
    getDatePickerControl: function _getDatePickerControl(property) {
      const datePicker = new DatePicker({
        name: property.propertyName,
        dateValue: {
          path: `${this.filterModelName}>/${property.propertyName}`,
          constraints: {
            displayFormat: "Date"
          },
          type: "sap.ui.model.odata.type.DateTime"
        }
      });
      return datePicker;
    },
    getDateTimePickerControl: function _getDateTimePickerControl(property) {
      const dateTimePicker = new DateTimePicker({
        name: property.propertyName,
        dateValue: {
          path: `${this.filterModelName}>/${property.propertyName}`,
          type: "sap.ui.model.odata.type.DateTimeOffset"
        }
      });
      return dateTimePicker;
    },
    getCheckBoxControl: function _getCheckBoxControl(property) {
      const checkbox = new CheckBox({
        name: property.propertyName,
        selected: {
          path: `${this.filterModelName}>/${property.propertyName}`
        }
      });
      return checkbox;
    },
    bindUITable: function _bindUITable(table, valueHelpDialog) {
      const path = this.getModelName() ? `${this.getModelName()}>${this.entityPath}` : this.entityPath;
      table.setModel(this.getODataModel(), this.getModelName());
      table.bindAggregation("rows", {
        path: path,
        events: {
          dataReceived: () => {
            valueHelpDialog.update();
          }
        }
      });
      this.addUITableColumns(table);
    },
    addUITableColumns: function _addUITableColumns(table) {
      const entity = new EntityCL(this.getSourceController(), this.valueHelpEntity, this.resourceBundlePrefix, this.namingStrategy, this.getModelName());
      const keyProperty = this.entityTypeProperties.find(prop => prop.propertyName === this.valueHelpProperty);
      if (!keyProperty) {
        throw new Error(`Property ${this.valueHelpProperty} does not exist on entity ${this.valueHelpEntity}!`);
      }
      let keyPropertyLabel = entity.getEntityTypePropLabel(this.valueHelpProperty);
      if (this.useMetadataLabels) {
        keyPropertyLabel = keyProperty.annotationLabel || entity.getEntityTypePropLabel(this.valueHelpProperty);
      }
      const keyPropertyColumn = new UIColumn({
        label: new Label({
          text: keyPropertyLabel
        }),
        template: new Text({
          text: `{${this.valueHelpProperty}}`
        })
      });
      keyPropertyColumn.data({
        fieldName: this.valueHelpProperty
      });
      table.addColumn(keyPropertyColumn);
      for (const property of this.readonlyProperties) {
        const readonlyProperty = this.entityTypeProperties.find(prop => prop.propertyName === property);
        if (!readonlyProperty) {
          throw new Error(`Property ${property} does not exist on entity ${this.valueHelpEntity}!`);
        }
        let readonlyPropertyLabel = entity.getEntityTypePropLabel(property);
        if (this.useMetadataLabels) {
          readonlyPropertyLabel = readonlyProperty.annotationLabel || entity.getEntityTypePropLabel(property);
        }
        const readonlyColumn = new UIColumn({
          label: new Label({
            text: readonlyPropertyLabel
          }),
          template: new Text({
            text: `{${property}}`
          })
        });
        readonlyColumn.data({
          fieldName: property
        });
        table.addColumn(readonlyColumn);
      }
    },
    bindTable: function _bindTable(table, valueHelpDialog) {
      const path = this.getModelName() ? `${this.getModelName()}>${this.entityPath}` : this.entityPath;
      table.setModel(this.getODataModel(), this.getModelName());
      table.bindAggregation("items", {
        path: path,
        template: this.getTableTemplate(),
        events: {
          dataReceived: () => {
            valueHelpDialog.update();
          }
        }
      });
      this.addTableColumns(table);
    },
    getTableTemplate: function _getTableTemplate() {
      const valueHelpPropText = this.getModelName() ? `${this.getModelName()}>${this.valueHelpProperty}` : this.valueHelpProperty;
      const columnListItem = new ColumnListItem({
        cells: new Text({
          text: `{${valueHelpPropText}}`
        })
      });
      this.readonlyProperties.forEach(property => {
        const readonlyPropText = this.getModelName() ? `${this.getModelName()}>${property}` : property;
        columnListItem.addCell(new Text({
          text: `{${readonlyPropText}}`
        }));
      });
      return columnListItem;
    },
    addTableColumns: function _addTableColumns(table) {
      const entity = new EntityCL(this.getSourceController(), this.valueHelpEntity, this.resourceBundlePrefix, this.namingStrategy, this.getModelName());
      const keyProperty = this.entityTypeProperties.find(prop => prop.propertyName === this.valueHelpProperty);
      if (!keyProperty) {
        throw new Error(`Property ${this.valueHelpProperty} does not exist on entity ${this.valueHelpEntity}!`);
      }
      let keyPropertyLabel = entity.getEntityTypePropLabel(this.valueHelpProperty);
      if (this.useMetadataLabels) {
        keyPropertyLabel = keyProperty.annotationLabel || entity.getEntityTypePropLabel(this.valueHelpProperty);
      }
      table.addColumn(new Column({
        header: new Label({
          text: keyPropertyLabel
        })
      }));
      for (const property of this.readonlyProperties) {
        const readonlyProperty = this.entityTypeProperties.find(prop => prop.propertyName === property);
        if (!readonlyProperty) {
          throw new Error(`Property ${property} does not exist on entity ${this.valueHelpEntity}!`);
        }
        let readonlyPropertyLabel = entity.getEntityTypePropLabel(property);
        if (this.useMetadataLabels) {
          readonlyPropertyLabel = readonlyProperty.annotationLabel || entity.getEntityTypePropLabel(property);
        }
        table.addColumn(new Column({
          header: new Label({
            text: readonlyPropertyLabel
          })
        }));
      }
    },
    onFilterBarSearch: async function _onFilterBarSearch(event) {
      const filterData = this.filterModel.getData();
      const filterProperties = Object.keys(filterData).filter(key => key !== "VHSearchFieldValue");
      const filters = [];
      for (const property of filterProperties) {
        const filterValue = filterData[property];
        if (filterValue === undefined || filterValue === null || filterValue === "") {
          continue;
        }
        const entityTypeProperty = this.entityTypeProperties.find(prop => prop.propertyName === property);
        if (entityTypeProperty?.propertyType === "Edm.String") {
          filters.push(new Filter({
            path: property,
            operator: FilterOperator.Contains,
            caseSensitive: this.caseSensitive,
            value1: filterValue
          }));
        } else {
          filters.push(new Filter({
            path: property,
            operator: FilterOperator.EQ,
            value1: filterValue
          }));
        }
      }
      const searchFieldFilters = this.getSearchFieldFilters();
      if (searchFieldFilters.length) {
        filters.push(new Filter({
          filters: this.getSearchFieldFilters(),
          and: false
        }));
      }
      const table = await this.valueHelpDialog.getTableAsync();
      if (table instanceof UITable) {
        const binding = table.getBinding("rows");
        if (filters.length) {
          binding.filter(new Filter({
            filters: filters,
            and: true
          }));
        } else {
          binding.filter([]);
        }
      }
      if (table instanceof Table) {
        const binding = table.getBinding("items");
        if (filters.length) {
          binding.filter(new Filter({
            filters: filters,
            and: true
          }));
        } else {
          binding.filter([]);
        }
      }
    },
    addSearchField: function _addSearchField(valueHelpDialog) {
      this.searchField = new SearchField({
        placeholder: this.searchPlaceholder,
        value: {
          path: `${this.filterModelName}>/VHSearchFieldValue`
        }
      });
      const filterbar = valueHelpDialog.getFilterBar();
      filterbar.setBasicSearch(this.searchField);
      this.searchField.attachSearch(() => {
        filterbar.search();
      });
    },
    getSearchFieldFilters: function _getSearchFieldFilters() {
      const searchFieldValue = this.filterModel.getProperty("/VHSearchFieldValue");
      const filters = [];
      const keyProperty = this.entityTypeProperties.find(prop => prop.propertyName === this.valueHelpProperty);
      if (!searchFieldValue) {
        return filters;
      }
      if (keyProperty?.propertyType === "Edm.String") {
        filters.push(new Filter({
          path: this.valueHelpProperty,
          operator: FilterOperator.Contains,
          value1: searchFieldValue,
          caseSensitive: this.caseSensitive
        }));
      }
      for (const property of this.readonlyProperties) {
        if (this.excludedFilterProperties.includes(property)) {
          continue;
        }
        const readonlyProperty = this.entityTypeProperties.find(prop => prop.propertyName === property);
        if (readonlyProperty?.propertyType === "Edm.String") {
          filters.push(new Filter({
            path: property,
            operator: FilterOperator.Contains,
            value1: searchFieldValue,
            caseSensitive: this.caseSensitive
          }));
        }
      }
      return filters;
    },
    createFilterModel: function _createFilterModel() {
      const filterModel = new JSONModel();
      filterModel.setDefaultBindingMode("TwoWay");
      this.filterModel = filterModel;
    },
    attachAfterSelect: function _attachAfterSelect(afterSelect, listener) {
      this.afterSelect = afterSelect;
      this.afterSelectListener = listener;
    },
    setInitialFilters: function _setInitialFilters(filters) {
      this.initialFilters = filters;
    },
    applyInitialFilters: function _applyInitialFilters() {
      for (const filter of this.initialFilters) {
        if (this.excludedFilterProperties.includes(filter.propertyName)) {
          continue;
        }
        if (filter.propertyName === this.valueHelpProperty || this.readonlyProperties.includes(filter.propertyName)) {
          this.filterModel.setProperty(`/${filter.propertyName}`, filter.value);
        }
      }
      this.filterBar.search();
    },
    attachAfterDialogOpened: function _attachAfterDialogOpened(afterDialogOpened, listener) {
      this.afterDialogOpened = afterDialogOpened;
      this.afterOpenedListener = listener;
    }
  });
  return ValueHelpCL;
});
},
	"ui5/antares/ui/view/UI5AntaresObjectPage.controller.js":function(){
"use strict";

sap.ui.define(["sap/m/MessageBox", "sap/ui/core/mvc/Controller", "ui5/antares/types/odata/enums"], function (MessageBox, Controller, __ui5_antares_types_odata_enums) {
  "use strict";

  const ODataMethods = __ui5_antares_types_odata_enums["ODataMethods"];
  /**
   * @namespace ui5.antares.ui.view
   */
  const UI5AntaresObjectPage = Controller.extend("ui5.antares.ui.view.UI5AntaresObjectPage", {
    constructor: function constructor() {
      Controller.prototype.constructor.apply(this, arguments);
      this.completeTriggered = false;
    },
    onInit: function _onInit() {
      const view = this.getView();
      const viewData = view.getViewData();
      view.addEventDelegate({
        onAfterHide: () => {
          if (!this.completeTriggered) {
            if (viewData.method === ODataMethods.DELETE) {
              const eventBus = viewData.entry.getSourceOwnerComponent().getEventBus();
              eventBus.publish("UI5AntaresEntryDelete", "UnsubscribeEvents");
            }
            viewData.entry.reset();
          }
          view.destroy();
        }
      });
      if (view.byId("UI5AntaresObjectPageCompleteButton")) {
        view.byId("UI5AntaresObjectPageCompleteButton").attachPress({}, this.onComplete, this);
      }
      view.byId("UI5AntaresObjectPageCancelButton").attachPress({}, this.onCancel, this);
    },
    onComplete: function _onComplete() {
      this.completeTriggered = true;
      const view = this.getView();
      const viewData = view.getViewData();
      if (viewData.method === ODataMethods.DELETE) {
        const eventBus = viewData.entry.getSourceOwnerComponent().getEventBus();
        eventBus.publish("UI5AntaresEntryDelete", "Complete");
        eventBus.publish("UI5AntaresEntryDelete", "UnsubscribeEvents");
      } else {
        const validation = viewData.entry.valueValidation();
        if (!validation.validated) {
          MessageBox.error(validation.message);
          return;
        }
        viewData.entry.submit();
        viewData.router.getTargets().display(viewData.entry.getFromTarget());
      }
    },
    onCancel: function _onCancel() {
      const view = this.getView();
      const viewData = view.getViewData();
      viewData.router.getTargets().display(viewData.entry.getFromTarget());
    }
  });
  return UI5AntaresObjectPage;
});
},
	"ui5/antares/ui/view/UI5AntaresObjectPageView.js":function(){
"use strict";

sap.ui.define(["sap/ui/core/mvc/View"], function (View) {
  "use strict";

  /**
   * @namespace ui5.antares.ui.view
   */
  const UI5AntaresObjectPageView = View.extend("ui5.antares.ui.view.UI5AntaresObjectPageView", {
    getControllerName: function _getControllerName() {
      return "ui5.antares.ui.view.UI5AntaresObjectPage";
    },
    createContent: function _createContent() {
      const viewData = this.getViewData();
      return viewData.entry.getObjectPageInstance().getObjectPageLayout();
    }
  });
  return UI5AntaresObjectPageView;
});
},
	"ui5/antares/util/Util.js":function(){
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
}
});

