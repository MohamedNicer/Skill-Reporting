declare module "ui5/antares/ui/DialogCL" {
    import { Button$PressEvent } from "sap/m/Button";
    import Dialog from "sap/m/Dialog";
    import { ButtonType } from "sap/m/library";
    import BaseObject from "sap/ui/base/Object";
    import Control from "sap/ui/core/Control";
    /**
     * @namespace ui5.antares.ui
     */
    export default class DialogCL extends BaseObject {
        private dialogId;
        private dialog;
        constructor(dialogId: string);
        addBeginButton(buttonText: string, buttonType: ButtonType, pressEventHandler: (event: Button$PressEvent) => void, listener: object): void;
        addEndButton(buttonText: string, buttonType: ButtonType, pressEventHandler: (event: Button$PressEvent) => void, listener: object): void;
        addEscapeHandler(escapeHandler: (event: {
            resolve: Function;
            reject: Function;
        }) => void, listener: object): void;
        addContent(content: Control): void;
        getDialog(): Dialog;
    }
}
