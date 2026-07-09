declare module "ui5/antares/ui/ValueHelpCL" {
    import UIComponent from "sap/ui/core/UIComponent";
    import Controller from "sap/ui/core/mvc/Controller";
    import ModelCL from "ui5/antares/base/v2/ModelCL";
    import { IValueHelpInitialFilter, IValueHelpSettings } from "ui5/antares/types/ui/valuehelp";
    import { Input$ValueHelpRequestEvent } from "sap/m/Input";
    import ValueHelpDialog from "sap/ui/comp/valuehelpdialog/ValueHelpDialog";
    /**
     * @namespace ui5.antares.ui
     */
    export default class ValueHelpCL extends ModelCL {
        private propertyName;
        private valueHelpEntity;
        private entityPath;
        private valueHelpProperty;
        private readonlyProperties;
        private excludedFilterProperties;
        private title;
        private searchPlaceholder;
        private namingStrategy;
        private resourceBundlePrefix;
        private useMetadataLabels;
        private sourceControl;
        private valueHelpDialog;
        private searchField;
        private filterBar;
        private entityTypeProperties;
        private readonly numberTypes;
        private filterModelName;
        private filterModel;
        private caseSensitive;
        private afterSelect?;
        private afterSelectListener?;
        private initialFilters?;
        private afterDialogOpened?;
        private afterOpenedListener?;
        constructor(controller: Controller | UIComponent, settings: IValueHelpSettings, modelName?: string);
        openValueHelpDialog(event: Input$ValueHelpRequestEvent): void;
        getPropertyName(): string;
        private getValueHelpDialog;
        private onConfirm;
        private onCancel;
        private onAfterClose;
        private addFilterBar;
        private getFilterGroupItems;
        private getFilterControl;
        private getInputControl;
        private getDatePickerControl;
        private getDateTimePickerControl;
        private getCheckBoxControl;
        private bindUITable;
        private addUITableColumns;
        private bindTable;
        private getTableTemplate;
        private addTableColumns;
        private onFilterBarSearch;
        private addSearchField;
        private getSearchFieldFilters;
        private createFilterModel;
        attachAfterSelect(afterSelect: (data: string | object) => void, listener?: object): void;
        setInitialFilters(filters: IValueHelpInitialFilter[]): void;
        private applyInitialFilters;
        attachAfterDialogOpened(afterDialogOpened: (dialog: ValueHelpDialog) => void, listener?: object): void;
    }
}
