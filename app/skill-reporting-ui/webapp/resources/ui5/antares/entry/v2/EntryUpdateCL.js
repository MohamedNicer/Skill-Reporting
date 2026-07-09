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
