import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device";
import { IAppVisibilities, IJSONVisibilities } from "../types/visibility.types";

export function createDeviceModel() {
    const model = new JSONModel(Device);
    model.setDefaultBindingMode("OneWay");
    return model;
}

export function createVisibilityModel(appVisibilities: IAppVisibilities[]) {
    const visibilities: IJSONVisibilities[] = appVisibilities.map((visibility) => {
        return {
            ID: visibility.ID,
            group: visibility.group,
            uiElement: visibility.uiElement,
            adminCanSee: visibility.adminCanSee,
            managerCanSee: visibility.managerCanSee,
            userCanSee: visibility.userCanSee,
            noneCanSee: visibility.noneCanSee,
            elementType: visibility.toApplicationElement.type
        };
    });

    const model = new JSONModel(visibilities);
    model.setDefaultBindingMode("TwoWay");
    return model;
}