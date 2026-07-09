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
