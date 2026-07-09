declare module "ui5/antares/types/ui/valuehelp" {
    import { NamingStrategies } from "ui5/antares/types/entry/enums";
    interface IValueHelpSettings {
        propertyName: string;
        valueHelpEntity: string;
        valueHelpProperty: string;
        readonlyProperties?: string[];
        excludedFilterProperties?: string[];
        title?: string;
        searchPlaceholder?: string;
        namingStrategy?: NamingStrategies;
        resourceBundlePrefix?: string;
        useMetadataLabels?: boolean;
        filterModelName?: string;
        filterCaseSensitive?: boolean;
    }
    interface IValueHelpInitialFilter {
        propertyName: string;
        value: string | number | boolean | Date;
    }
}
