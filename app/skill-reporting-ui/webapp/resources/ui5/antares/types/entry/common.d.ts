declare module "ui5/antares/types/entry/common" {
    import { smartfield } from "sap/ui/comp/library";
    import CustomData from "sap/ui/core/CustomData";
    import Router from "sap/ui/core/routing/Router";
    import EntryCL from "ui5/antares/entry/v2/EntryCL";
    import { ODataMethods } from "ui5/antares/types/odata/enums";
    interface IFormGroups {
        title: string;
        properties: string[];
    }
    interface IObjectPageViewData {
        entry: EntryCL;
        router: Router;
        method: ODataMethods;
    }
    interface IFieldCustomData {
        propertyName: string;
        customData: CustomData;
    }
    interface ITextInEditModeSource {
        propertyName: string;
        textInEditModeSource: smartfield.TextInEditModeSource;
    }
}
