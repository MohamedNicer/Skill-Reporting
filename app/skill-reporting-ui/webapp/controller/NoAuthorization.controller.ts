import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import formatter from "com/ndbs/skillreportingui/model/formatter";
import Target, { Target$DisplayEvent } from "sap/ui/core/routing/Target";
import IllustratedMessage from "sap/m/IllustratedMessage";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class NoAuthorization extends BaseController {

    /* ======================================================================================================================= */
    /* Properties - Getters - Setters                                                                                          */
    /* ======================================================================================================================= */

    public formatter = formatter;

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {
        (this.getRouter().getTarget("TargetNoAuthorization") as Target).attachDisplay(this.onObjectMatched, this);
    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

    public onObjectMatched(event: Target$DisplayEvent): void {
        const pageID = (event.getParameter("data") as { fromTarget: string; }).fromTarget;
        const pageName = this.getResourceBundleText(`view${pageID}`);
        (this.getCurrentView().byId("imNoAuthMessage") as IllustratedMessage).setDescription(this.getResourceBundleText("noAuthorizationText", [pageName]));
    }
}