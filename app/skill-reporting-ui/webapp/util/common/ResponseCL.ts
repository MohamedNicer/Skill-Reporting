import BaseObject from "sap/ui/base/Object";
import { ISubmitChangeResponse } from "../../types/global.types";

/**
 * @namespace com.ndbs.skillreportingui.util.common
 */
export default class ResponseCL<DataT extends object = object> extends BaseObject {
    private rawResponse?: ISubmitChangeResponse<DataT>;
    private data: DataT | null;
    private statusCode: string | null;
    private statusType: "SUCCESS" | "ERROR";

    constructor(rawResponse?: ISubmitChangeResponse<DataT>) {
        super();
        this.rawResponse = rawResponse;
        this.parseResponse();
    }

    public getStatusCode(): string | null {
        return this.statusCode;
    }

    public getResponseData(): DataT | null {
        return this.data;
    }

    public getStatusType(): "SUCCESS" | "ERROR" {
        return this.statusType;
    }

    public getRawResponse(): ISubmitChangeResponse<DataT> | undefined {
        return this.rawResponse;
    }

    private parseResponse() {
        if (this.rawResponse) {
            if (this.rawResponse.__batchResponses.length) {
                this.statusCode = this.rawResponse.__batchResponses[0].response?.statusCode || null;

                if (!this.statusCode && this.rawResponse.__batchResponses[0].__changeResponses) {
                    this.statusCode = this.rawResponse.__batchResponses[0].__changeResponses[0].statusCode ||
                        this.rawResponse.__batchResponses[0].__changeResponses[0].response?.statusCode || null;
                }

                if (this.statusCode) {
                    if (this.statusCode.startsWith("4") || this.statusCode.startsWith("5")) {
                        this.data = null;
                        this.statusType = "ERROR";
                    } else {
                        this.statusType = "SUCCESS";

                        if (this.rawResponse.__batchResponses[0].__changeResponses) {
                            this.data = this.rawResponse.__batchResponses[0].__changeResponses[0].data || null;
                        } else {
                            this.data = null;
                        }
                    }
                } else {
                    this.data = null;
                    this.statusType = "ERROR";
                }
            } else {
                this.data = null;
                this.statusCode = null;
                this.statusType = "ERROR";
            }
        } else {
            this.data = null;
            this.statusCode = null;
            this.statusType = "ERROR";
        }
    }
}