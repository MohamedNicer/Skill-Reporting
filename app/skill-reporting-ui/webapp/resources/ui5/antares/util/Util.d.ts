declare module "ui5/antares/util/Util" {
    import BaseObject from "sap/ui/base/Object";
    import { NamingStrategies } from "ui5/antares/types/entry/enums";
    /**
     * @namespace ui5.antares.util
     */
    export default class Util extends BaseObject {
        static getGeneratedLabel(property: string, namingStrategy: NamingStrategies): string;
        private static getCamelCaseLabel;
        private static getPascalCaseLabel;
        private static getSnakeCaseLabel;
        private static getConstantCaseLabel;
        private static getKebabCaseLabel;
    }
}
