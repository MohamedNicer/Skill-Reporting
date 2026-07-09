declare module "ui5/antares/ui/view/UI5AntaresObjectPageView" {
    import Control from "sap/ui/core/Control";
    import View from "sap/ui/core/mvc/View";
    /**
     * @namespace ui5.antares.ui.view
     */
    export default class UI5AntaresObjectPageView extends View {
        getControllerName(): string;
        createContent(): Control | Control[] | Promise<Control | Control[]>;
    }
}
//# sourceMappingURL=UI5AntaresObjectPageView.d.ts.map