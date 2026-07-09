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
