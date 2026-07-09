declare module "ui5/antares/entry/v2/ResponseCL" {
    import BaseObject from "sap/ui/base/Object";
    /**
     * @namespace ui5.antares.entry.v2
     */
    export default class ResponseCL<ResponseT = object> extends BaseObject {
        private response?;
        private statusCode?;
        constructor(response?: ResponseT, statusCode?: string);
        getStatusCode(): string | undefined;
        getResponse(): ResponseT | undefined;
    }
}
