declare module "ui5/antares/ui/FragmentCL" {
    import BusyDialog from "sap/m/BusyDialog";
    import ColorPalettePopover from "sap/m/ColorPalettePopover";
    import Dialog from "sap/m/Dialog";
    import MessagePopover from "sap/m/MessagePopover";
    import Popover from "sap/m/Popover";
    import ResponsivePopover from "sap/m/ResponsivePopover";
    import SelectDialog from "sap/m/SelectDialog";
    import TableSelectDialog from "sap/m/TableSelectDialog";
    import ViewSettingsDialog from "sap/m/ViewSettingsDialog";
    import BaseObject from "sap/ui/base/Object";
    import ValueHelpDialog from "sap/ui/comp/valuehelpdialog/ValueHelpDialog";
    import Control from "sap/ui/core/Control";
    import UIComponent from "sap/ui/core/UIComponent";
    import Controller from "sap/ui/core/mvc/Controller";
    /**
     * @namespace ui5.antares.ui
     */
    export default class FragmentCL extends BaseObject {
        private sourceController;
        private fragmentPath;
        private sourceView?;
        private openByControl?;
        private fragment?;
        private autoDestroyOnESC;
        private selectDialogSearchValue;
        constructor(controller: Controller | UIComponent, fragmentPath: string, openByControl?: Control);
        openAsync(viewDependent?: boolean): Promise<Dialog | ValueHelpDialog | BusyDialog | SelectDialog | TableSelectDialog | ViewSettingsDialog | Popover | MessagePopover | ResponsivePopover | ColorPalettePopover>;
        open(viewDependent?: boolean): Dialog | ValueHelpDialog | BusyDialog | SelectDialog | TableSelectDialog | ViewSettingsDialog | Popover | MessagePopover | ResponsivePopover | ColorPalettePopover;
        getFragmentContent(): Control | Control[];
        close(): void;
        destroyFragmentContent(): void;
        closeAndDestroy(): void;
        load(): Promise<Control | Control[]>;
        setAutoDestroyOnESC(destroy: boolean): void;
        private onESCTriggered;
        setSearchValue(value: string): void;
    }
}
