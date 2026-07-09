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
