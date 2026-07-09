declare module "ui5/antares/types/entry/update" {
    import Context from "sap/ui/model/Context";
    interface IUpdateSettings<EntityKeysT extends object> {
        entityPath: string;
        initializer: string | Context | EntityKeysT;
    }
}
