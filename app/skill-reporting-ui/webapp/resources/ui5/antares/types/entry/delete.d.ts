declare module "ui5/antares/types/entry/delete" {
    import Context from "sap/ui/model/Context";
    interface IDeleteSettings<EntityKeysT extends object> {
        entityPath: string;
        initializer: string | Context | EntityKeysT;
    }
    interface IDeleteFailed {
        headers: object;
        message: string;
        responseText: string;
        statusCode: string;
        statusText: string;
    }
}
