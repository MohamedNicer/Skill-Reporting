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
