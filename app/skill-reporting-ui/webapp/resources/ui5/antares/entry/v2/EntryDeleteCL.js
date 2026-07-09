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
