declare module "ui5/antares/types/entry/read" {
    import Context from "sap/ui/model/Context";
    interface IReadSettings<EntityKeysT extends object> {
        entityPath: string;
        initializer: string | Context | EntityKeysT;
    }
}
