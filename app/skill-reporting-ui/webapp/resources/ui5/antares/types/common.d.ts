declare module "ui5/antares/types/common" {
    interface IError {
        headers?: object;
        message?: string;
        responseText?: string;
        statusCode?: string | number;
        statusText?: string;
    }
    interface IManifestModels {
        dataSource: string;
        preload?: boolean;
        settings?: object;
    }
    interface IManifestDataSources {
        uri: string;
        type: string;
        settings?: object;
    }
    interface IResponse {
        $reported?: boolean;
        body?: string;
        headers?: object;
        statusCode?: string | number;
        statusText?: string;
        _imported?: boolean;
    }
    interface ICreateResponse<T> extends IResponse {
        data?: T;
    }
    interface IUpdateResponse<T> extends IResponse {
        data?: T;
    }
    interface IDeleteResponse extends IResponse {
        data?: string;
    }
    interface IReadResponse<T> extends IResponse {
        data?: {
            results: T[];
        };
    }
}
