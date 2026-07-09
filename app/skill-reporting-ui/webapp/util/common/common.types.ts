import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import { Model$RequestFailedEvent as RequestFailedEvent } from "sap/ui/model/Model";

export enum FormTypes {
    SMART,
    SIMPLE
}

export interface IPage {
    onODataRequestFail(event: RequestFailedEvent): void;
    onObjectMatched(event?: Route$PatternMatchedEvent): void;
}

export interface IWhoami {
    personnelID: string | null;
    successFactorsID: string;
    firstName: string;
    lastName: string;
    team: string | null;
    country: string | null;
    role: string;
    roleDescription: string;
    createRequired: boolean;
    email: string;
}

export type PageController = IPage & BaseController;