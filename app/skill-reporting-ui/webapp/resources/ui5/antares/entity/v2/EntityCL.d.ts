declare module "ui5/antares/entity/v2/EntityCL" {
    import UIComponent from "sap/ui/core/UIComponent";
    import Controller from "sap/ui/core/mvc/Controller";
    import ODataMetaModel, { EntitySet, EntityType } from "sap/ui/model/odata/ODataMetaModel";
    import ModelCL from "ui5/antares/base/v2/ModelCL";
    import { IEntityType } from "ui5/antares/types/entity/type";
    import { NamingStrategies } from "ui5/antares/types/entry/enums";
    /**
     * @namespace ui5.antares.entity.v2
     */
    export default class EntityCL extends ModelCL {
        private entityName;
        private metaModel;
        private resourceBundlePrefix;
        private namingStrategy;
        constructor(controller: Controller | UIComponent, entityName: string, resourceBundlePrefix: string, namingStrategy: NamingStrategies, modelName?: string);
        protected getEntityName(): string;
        getMetaModel(): ODataMetaModel;
        getEntityType(): Promise<EntityType>;
        getEntitySet(): Promise<EntitySet>;
        getEntityTypeKeys(): Promise<IEntityType[]>;
        getEntityTypeProperties(): Promise<IEntityType[]>;
        getEntityTypePropLabel(property: string): string;
    }
}
