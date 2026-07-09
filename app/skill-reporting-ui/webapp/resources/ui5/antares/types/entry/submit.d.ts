declare module "ui5/antares/types/entry/submit" {
    interface ISubmitChangeResponse<T> {
        __batchResponses: IBatchResponses<T>[];
    }
    interface IBatchResponses<T> {
        __changeResponses?: IChangeResponses<T>[];
        response?: ISubmitResponse;
        $reported?: boolean;
        message?: string;
    }
    interface IChangeResponses<T> {
        $reported?: boolean;
        _imported?: boolean;
        statusCode?: string;
        statusText?: string;
        headers?: object;
        data?: T;
        response?: ISubmitResponse;
    }
    interface ISubmitResponse {
        statusCode?: string;
        body?: string;
        statusText?: string;
        headers?: object;
    }
    interface IValueValidation {
        type: "MANDATORY" | "VALIDATION";
        message: string;
        validated: boolean;
    }
}
