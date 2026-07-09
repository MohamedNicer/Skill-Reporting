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
