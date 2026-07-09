"use strict";

sap.ui.define(["sap/m/Column", "sap/m/Text", "ui5/antares/base/v2/ModelCL", "ui5/antares/types/entry/enums", "ui5/antares/entity/v2/EntityCL", "sap/m/ColumnListItem", "sap/m/Input", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/comp/valuehelpdialog/ValueHelpDialog", "sap/ui/table/Table", "sap/m/Table", "sap/ui/table/Column", "sap/m/Label", "sap/ui/comp/filterbar/FilterBar", "sap/ui/comp/filterbar/FilterGroupItem", "sap/m/SearchField", "sap/m/DatePicker", "sap/m/DateTimePicker", "sap/m/CheckBox", "sap/ui/model/json/JSONModel"], function (Column, Text, __ModelCL, __ui5_antares_types_entry_enums, __EntityCL, ColumnListItem, Input, Filter, FilterOperator, ValueHelpDialog, UITable, Table, UIColumn, Label, FilterBar, FilterGroupItem, SearchField, DatePicker, DateTimePicker, CheckBox, JSONModel) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ModelCL = _interopRequireDefault(__ModelCL);
  const NamingStrategies = __ui5_antares_types_entry_enums["NamingStrategies"];
  const EntityCL = _interopRequireDefault(__EntityCL);
  /**
   * @namespace ui5.antares.ui
   */
  const ValueHelpCL = ModelCL.extend("ui5.antares.ui.ValueHelpCL", {
    constructor: function _constructor(controller, settings, modelName) {
      ModelCL.prototype.constructor.call(this, controller, modelName);
      this.numberTypes = ["Edm.Decimal", "Edm.Double", "Edm.Int16", "Edm.Int32", "Edm.Int64"];
      this.propertyName = settings.propertyName;
      this.valueHelpEntity = settings.valueHelpEntity.startsWith("/") ? settings.valueHelpEntity.slice(1) : settings.valueHelpEntity;
      this.entityPath = `/${this.valueHelpEntity}`;
      this.valueHelpProperty = settings.valueHelpProperty;
      this.title = settings.title || `${this.valueHelpEntity}`;
      this.searchPlaceholder = settings.searchPlaceholder || `Search ${this.valueHelpEntity}`;
      this.readonlyProperties = settings.readonlyProperties || [];
      this.excludedFilterProperties = settings.excludedFilterProperties || [];
      this.namingStrategy = settings.namingStrategy || NamingStrategies.CAMEL_CASE;
      this.resourceBundlePrefix = settings.resourceBundlePrefix || "antaresVH";
      this.useMetadataLabels = settings.useMetadataLabels === undefined ? false : settings.useMetadataLabels;
      this.filterModelName = settings.filterModelName || "UI5AntaresVHFilterModel";
      this.caseSensitive = settings.filterCaseSensitive ?? false;
    },
    openValueHelpDialog: function _openValueHelpDialog(event) {
      this.getValueHelpDialog().then(dialog => {
        dialog.open();
        if (this.initialFilters) {
          this.applyInitialFilters();
        }
        if (this.afterDialogOpened) {
          this.afterDialogOpened.call(this.afterOpenedListener || this.getSourceController(), this.valueHelpDialog);
        }
      });
      this.sourceControl = event.getSource();
    },
    getPropertyName: function _getPropertyName() {
      return this.propertyName;
    },
    getValueHelpDialog: async function _getValueHelpDialog() {
      const entity = new EntityCL(this.getSourceController(), this.valueHelpEntity, this.resourceBundlePrefix, this.namingStrategy, this.getModelName());
      this.valueHelpDialog = new ValueHelpDialog({
        title: this.title,
        supportRanges: false,
        supportMultiselect: false,
        ok: this.onConfirm.bind(this),
        cancel: this.onCancel.bind(this),
        afterClose: this.onAfterClose.bind(this),
        key: this.valueHelpProperty
      });
      this.entityTypeProperties = await entity.getEntityTypeProperties();
      this.addFilterBar(this.valueHelpDialog);
      this.addSearchField(this.valueHelpDialog);
      const table = await this.valueHelpDialog.getTableAsync();
      if (table instanceof UITable) {
        this.bindUITable(table, this.valueHelpDialog);
      }
      if (table instanceof Table) {
        this.bindTable(table, this.valueHelpDialog);
      }
      this.valueHelpDialog.update();
      return this.valueHelpDialog;
    },
    onConfirm: function _onConfirm(event) {
      const selectedTokens = event.getParameter("tokens");
      if (selectedTokens) {
        this.sourceControl.setValue(selectedTokens[0].getKey());
        if (this.afterSelect) {
          const selectedRow = selectedTokens[0].getCustomData().find(data => data.getKey() === "row");
          if (selectedRow) {
            this.afterSelect.call(this.afterSelectListener || this.getSourceController(), selectedRow.getValue());
          } else {
            this.afterSelect.call(this.afterSelectListener || this.getSourceController(), selectedTokens[0].getKey());
          }
        }
      }
      this.valueHelpDialog.close();
    },
    onCancel: function _onCancel() {
      this.valueHelpDialog.close();
    },
    onAfterClose: function _onAfterClose() {
      this.valueHelpDialog.destroy();
    },
    addFilterBar: function _addFilterBar(valueHelpDialog) {
      const filterGroupItems = this.getFilterGroupItems();
      this.filterBar = new FilterBar({
        advancedMode: true,
        isRunningInValueHelpDialog: true,
        search: this.onFilterBarSearch.bind(this),
        filterGroupItems: filterGroupItems
      });
      this.createFilterModel();
      this.filterBar.setModel(this.filterModel, this.filterModelName);
      valueHelpDialog.setFilterBar(this.filterBar);
    },
    getFilterGroupItems: function _getFilterGroupItems() {
      const entity = new EntityCL(this.getSourceController(), this.valueHelpEntity, this.resourceBundlePrefix, this.namingStrategy, this.getModelName());
      const keyProperty = this.entityTypeProperties.find(prop => prop.propertyName === this.valueHelpProperty);
      if (!keyProperty) {
        throw new Error(`Property ${this.valueHelpProperty} does not exist on entity ${this.valueHelpEntity}!`);
      }
      let keyPropertyLabel = entity.getEntityTypePropLabel(this.valueHelpProperty);
      if (this.useMetadataLabels) {
        keyPropertyLabel = keyProperty.annotationLabel || entity.getEntityTypePropLabel(this.valueHelpProperty);
      }
      const groupItems = [new FilterGroupItem({
        groupName: "__$INTERNAL$",
        name: this.valueHelpProperty,
        label: keyPropertyLabel,
        visibleInFilterBar: true,
        control: this.getFilterControl(keyProperty)
      })];
      for (const property of this.readonlyProperties) {
        const readonlyProperty = this.entityTypeProperties.find(prop => prop.propertyName === property);
        if (!readonlyProperty) {
          throw new Error(`Property ${property} does not exist on entity ${this.valueHelpEntity}!`);
        }
        if (this.excludedFilterProperties.includes(property)) {
          continue;
        }
        let readonlyPropertyLabel = entity.getEntityTypePropLabel(property);
        if (this.useMetadataLabels) {
          readonlyPropertyLabel = readonlyProperty.annotationLabel || entity.getEntityTypePropLabel(property);
        }
        groupItems.push(new FilterGroupItem({
          groupName: "__$INTERNAL$",
          name: property,
          label: readonlyPropertyLabel,
          visibleInFilterBar: true,
          control: this.getFilterControl(readonlyProperty)
        }));
      }
      return groupItems;
    },
    getFilterControl: function _getFilterControl(property) {
      switch (property.propertyType) {
        case "Edm.DateTime":
          return this.getDatePickerControl(property);
        case "Edm.DateTimeOffset":
          return this.getDateTimePickerControl(property);
        case "Edm.Boolean":
          return this.getCheckBoxControl(property);
        default:
          return this.getInputControl(property);
      }
    },
    getInputControl: function _getInputControl(property) {
      const inputValue = {
        path: `${this.filterModelName}>/${property.propertyName}`
      };
      if (this.numberTypes.includes(property.propertyType)) {
        inputValue.type = `sap.ui.model.odata.type.${property.propertyType.slice(4)}`;
        switch (property.propertyType) {
          case "Edm.Decimal":
            if (property.precision && property.scale) {
              inputValue.constraints = {
                precision: property.precision,
                scale: property.scale
              };
            }
            break;
          default:
            const groupingEnabled = property.propertyType === "Edm.Double";
            inputValue.formatOptions = {
              groupingEnabled: groupingEnabled
            };
            break;
        }
      }
      const input = new Input({
        name: property.propertyName,
        value: inputValue,
        submit: () => {
          this.filterBar.search();
        }
      });
      return input;
    },
    getDatePickerControl: function _getDatePickerControl(property) {
      const datePicker = new DatePicker({
        name: property.propertyName,
        dateValue: {
          path: `${this.filterModelName}>/${property.propertyName}`,
          constraints: {
            displayFormat: "Date"
          },
          type: "sap.ui.model.odata.type.DateTime"
        }
      });
      return datePicker;
    },
    getDateTimePickerControl: function _getDateTimePickerControl(property) {
      const dateTimePicker = new DateTimePicker({
        name: property.propertyName,
        dateValue: {
          path: `${this.filterModelName}>/${property.propertyName}`,
          type: "sap.ui.model.odata.type.DateTimeOffset"
        }
      });
      return dateTimePicker;
    },
    getCheckBoxControl: function _getCheckBoxControl(property) {
      const checkbox = new CheckBox({
        name: property.propertyName,
        selected: {
          path: `${this.filterModelName}>/${property.propertyName}`
        }
      });
      return checkbox;
    },
    bindUITable: function _bindUITable(table, valueHelpDialog) {
      const path = this.getModelName() ? `${this.getModelName()}>${this.entityPath}` : this.entityPath;
      table.setModel(this.getODataModel(), this.getModelName());
      table.bindAggregation("rows", {
        path: path,
        events: {
          dataReceived: () => {
            valueHelpDialog.update();
          }
        }
      });
      this.addUITableColumns(table);
    },
    addUITableColumns: function _addUITableColumns(table) {
      const entity = new EntityCL(this.getSourceController(), this.valueHelpEntity, this.resourceBundlePrefix, this.namingStrategy, this.getModelName());
      const keyProperty = this.entityTypeProperties.find(prop => prop.propertyName === this.valueHelpProperty);
      if (!keyProperty) {
        throw new Error(`Property ${this.valueHelpProperty} does not exist on entity ${this.valueHelpEntity}!`);
      }
      let keyPropertyLabel = entity.getEntityTypePropLabel(this.valueHelpProperty);
      if (this.useMetadataLabels) {
        keyPropertyLabel = keyProperty.annotationLabel || entity.getEntityTypePropLabel(this.valueHelpProperty);
      }
      const keyPropertyColumn = new UIColumn({
        label: new Label({
          text: keyPropertyLabel
        }),
        template: new Text({
          text: `{${this.valueHelpProperty}}`
        })
      });
      keyPropertyColumn.data({
        fieldName: this.valueHelpProperty
      });
      table.addColumn(keyPropertyColumn);
      for (const property of this.readonlyProperties) {
        const readonlyProperty = this.entityTypeProperties.find(prop => prop.propertyName === property);
        if (!readonlyProperty) {
          throw new Error(`Property ${property} does not exist on entity ${this.valueHelpEntity}!`);
        }
        let readonlyPropertyLabel = entity.getEntityTypePropLabel(property);
        if (this.useMetadataLabels) {
          readonlyPropertyLabel = readonlyProperty.annotationLabel || entity.getEntityTypePropLabel(property);
        }
        const readonlyColumn = new UIColumn({
          label: new Label({
            text: readonlyPropertyLabel
          }),
          template: new Text({
            text: `{${property}}`
          })
        });
        readonlyColumn.data({
          fieldName: property
        });
        table.addColumn(readonlyColumn);
      }
    },
    bindTable: function _bindTable(table, valueHelpDialog) {
      const path = this.getModelName() ? `${this.getModelName()}>${this.entityPath}` : this.entityPath;
      table.setModel(this.getODataModel(), this.getModelName());
      table.bindAggregation("items", {
        path: path,
        template: this.getTableTemplate(),
        events: {
          dataReceived: () => {
            valueHelpDialog.update();
          }
        }
      });
      this.addTableColumns(table);
    },
    getTableTemplate: function _getTableTemplate() {
      const valueHelpPropText = this.getModelName() ? `${this.getModelName()}>${this.valueHelpProperty}` : this.valueHelpProperty;
      const columnListItem = new ColumnListItem({
        cells: new Text({
          text: `{${valueHelpPropText}}`
        })
      });
      this.readonlyProperties.forEach(property => {
        const readonlyPropText = this.getModelName() ? `${this.getModelName()}>${property}` : property;
        columnListItem.addCell(new Text({
          text: `{${readonlyPropText}}`
        }));
      });
      return columnListItem;
    },
    addTableColumns: function _addTableColumns(table) {
      const entity = new EntityCL(this.getSourceController(), this.valueHelpEntity, this.resourceBundlePrefix, this.namingStrategy, this.getModelName());
      const keyProperty = this.entityTypeProperties.find(prop => prop.propertyName === this.valueHelpProperty);
      if (!keyProperty) {
        throw new Error(`Property ${this.valueHelpProperty} does not exist on entity ${this.valueHelpEntity}!`);
      }
      let keyPropertyLabel = entity.getEntityTypePropLabel(this.valueHelpProperty);
      if (this.useMetadataLabels) {
        keyPropertyLabel = keyProperty.annotationLabel || entity.getEntityTypePropLabel(this.valueHelpProperty);
      }
      table.addColumn(new Column({
        header: new Label({
          text: keyPropertyLabel
        })
      }));
      for (const property of this.readonlyProperties) {
        const readonlyProperty = this.entityTypeProperties.find(prop => prop.propertyName === property);
        if (!readonlyProperty) {
          throw new Error(`Property ${property} does not exist on entity ${this.valueHelpEntity}!`);
        }
        let readonlyPropertyLabel = entity.getEntityTypePropLabel(property);
        if (this.useMetadataLabels) {
          readonlyPropertyLabel = readonlyProperty.annotationLabel || entity.getEntityTypePropLabel(property);
        }
        table.addColumn(new Column({
          header: new Label({
            text: readonlyPropertyLabel
          })
        }));
      }
    },
    onFilterBarSearch: async function _onFilterBarSearch(event) {
      const filterData = this.filterModel.getData();
      const filterProperties = Object.keys(filterData).filter(key => key !== "VHSearchFieldValue");
      const filters = [];
      for (const property of filterProperties) {
        const filterValue = filterData[property];
        if (filterValue === undefined || filterValue === null || filterValue === "") {
          continue;
        }
        const entityTypeProperty = this.entityTypeProperties.find(prop => prop.propertyName === property);
        if (entityTypeProperty?.propertyType === "Edm.String") {
          filters.push(new Filter({
            path: property,
            operator: FilterOperator.Contains,
            caseSensitive: this.caseSensitive,
            value1: filterValue
          }));
        } else {
          filters.push(new Filter({
            path: property,
            operator: FilterOperator.EQ,
            value1: filterValue
          }));
        }
      }
      const searchFieldFilters = this.getSearchFieldFilters();
      if (searchFieldFilters.length) {
        filters.push(new Filter({
          filters: this.getSearchFieldFilters(),
          and: false
        }));
      }
      const table = await this.valueHelpDialog.getTableAsync();
      if (table instanceof UITable) {
        const binding = table.getBinding("rows");
        if (filters.length) {
          binding.filter(new Filter({
            filters: filters,
            and: true
          }));
        } else {
          binding.filter([]);
        }
      }
      if (table instanceof Table) {
        const binding = table.getBinding("items");
        if (filters.length) {
          binding.filter(new Filter({
            filters: filters,
            and: true
          }));
        } else {
          binding.filter([]);
        }
      }
    },
    addSearchField: function _addSearchField(valueHelpDialog) {
      this.searchField = new SearchField({
        placeholder: this.searchPlaceholder,
        value: {
          path: `${this.filterModelName}>/VHSearchFieldValue`
        }
      });
      const filterbar = valueHelpDialog.getFilterBar();
      filterbar.setBasicSearch(this.searchField);
      this.searchField.attachSearch(() => {
        filterbar.search();
      });
    },
    getSearchFieldFilters: function _getSearchFieldFilters() {
      const searchFieldValue = this.filterModel.getProperty("/VHSearchFieldValue");
      const filters = [];
      const keyProperty = this.entityTypeProperties.find(prop => prop.propertyName === this.valueHelpProperty);
      if (!searchFieldValue) {
        return filters;
      }
      if (keyProperty?.propertyType === "Edm.String") {
        filters.push(new Filter({
          path: this.valueHelpProperty,
          operator: FilterOperator.Contains,
          value1: searchFieldValue,
          caseSensitive: this.caseSensitive
        }));
      }
      for (const property of this.readonlyProperties) {
        if (this.excludedFilterProperties.includes(property)) {
          continue;
        }
        const readonlyProperty = this.entityTypeProperties.find(prop => prop.propertyName === property);
        if (readonlyProperty?.propertyType === "Edm.String") {
          filters.push(new Filter({
            path: property,
            operator: FilterOperator.Contains,
            value1: searchFieldValue,
            caseSensitive: this.caseSensitive
          }));
        }
      }
      return filters;
    },
    createFilterModel: function _createFilterModel() {
      const filterModel = new JSONModel();
      filterModel.setDefaultBindingMode("TwoWay");
      this.filterModel = filterModel;
    },
    attachAfterSelect: function _attachAfterSelect(afterSelect, listener) {
      this.afterSelect = afterSelect;
      this.afterSelectListener = listener;
    },
    setInitialFilters: function _setInitialFilters(filters) {
      this.initialFilters = filters;
    },
    applyInitialFilters: function _applyInitialFilters() {
      for (const filter of this.initialFilters) {
        if (this.excludedFilterProperties.includes(filter.propertyName)) {
          continue;
        }
        if (filter.propertyName === this.valueHelpProperty || this.readonlyProperties.includes(filter.propertyName)) {
          this.filterModel.setProperty(`/${filter.propertyName}`, filter.value);
        }
      }
      this.filterBar.search();
    },
    attachAfterDialogOpened: function _attachAfterDialogOpened(afterDialogOpened, listener) {
      this.afterDialogOpened = afterDialogOpened;
      this.afterOpenedListener = listener;
    }
  });
  return ValueHelpCL;
});
