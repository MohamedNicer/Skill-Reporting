declare module "ui5/antares/ui/ObjectPageLayoutCL" {
    import { ButtonType } from "sap/m/library";
    import BaseObject from "sap/ui/base/Object";
    import Control from "sap/ui/core/Control";
    import ObjectPageLayout from "sap/uxap/ObjectPageLayout";
    /**
     * @namespace ui5.antares.ui
     */
    export default class ObjectPageLayoutCL extends BaseObject {
        private objectPageLayout;
        private emptySection;
        constructor(headerText: string, avatarSrc: string, headerLabel: string);
        addCompleteButton(buttonText: string, buttonType: ButtonType): void;
        addCancelButton(buttonText: string, buttonType: ButtonType): void;
        addSection(content: Control, sectionTitle: string): void;
        addEmptySection(sectionTitle: string): void;
        addContentToSection(content: Control): void;
        getObjectPageLayout(): ObjectPageLayout;
    }
}
