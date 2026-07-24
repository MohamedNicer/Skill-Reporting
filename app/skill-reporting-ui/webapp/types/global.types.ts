import Filter from "sap/ui/model/Filter";

export enum DefaultMessages {
    NO_I18N_TEXT = "The message could not be displayed due to technical issues. Contact the administrator."
}

export enum ApplicationModels {
    GLOBAL_JSON = "globalJSONModel",
    VISIBILITY = "globalAppVisibilities"
}

export enum Routes {
    HOMEPAGE       = "RouteHomepage",
    PERSONNEL      = "RoutePersonnel",
    SKILLS         = "RouteSkills",
    EMPLOYEE_SKILLS = "RouteEmployeeSkills",
    NO_AUTH        = "RouteNoAuthorization",
    SKILL_CATEGORIES = "RouteSkillCategories",
    PROFICIENCY_LEVELS = "RouteProficiencyLevels",
    SKILL_REQUESTS = "RouteSkillRequests",
    UPLOADED_CVS   = "RouteUploadedCVs",
    GENERATED_CVS  = "RouteGeneratedCVs",
    TEAM_SKILLS    = "RouteTeamSkills",
    DEPARTMENT_HEATMAP = "RouteDepartmentHeatmap",
    CV_ACTIVITY    = "RouteCVActivity",
    AUDIT_LOG      = "RouteAuditLog"
}

export enum FioriThemes {
    HORIZON_HCW,
    HORIZON_HCB,
    HORIZON_DARK,
    HORIZON,
    FIORI_3_DARK,
    FIORI_3,
    HCB,
    BELIZE_HCW,
    BELIZE
}

export enum FioriThemeTexts {
    HORIZON_HCW = "sap_horizon_hcw",
    HORIZON_HCB = "sap_horizon_hcb",
    HORIZON_DARK = "sap_horizon_dark",
    HORIZON = "sap_horizon",
    FIORI_3_DARK = "sap_fiori_3_dark",
    FIORI_3 = "sap_fiori_3",
    HCB = "sap_hcb",
    BELIZE_HCW = "sap_belize_hcw",
    BELIZE = "sap_belize"
}

export enum UserRoles {
    ADMIN = "A",
    MANAGER = "M",
    USER = "U",
    NONE = "N"
}

export interface IUserAPI {
    name: string;
    firstname: string;
    lastname: string;
    email: string;
}

export interface IAppActivityLogs {
    ID: string;
    firstName: string;
    lastName: string;
    email: string;
    lastLoginTime?: Date;
    loginCount: number;
}

export interface IAppActivityLogsKeys {
    ID: string;
}

export interface IBindingParams {
    parameters: {
        expand: string;
    };
    filters: Filter[];
}

export interface IUserRole {
    ID: string;
    sfUser: string | null;
    userRole: UserRoles | null;
}

export interface ICurrentUserInfo {
    personnelID?: string;
    successFactorsID?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    teamID?: string | null;
    teamName?: string | null;
    userRole?: UserRoles | null;
}

export interface ISubmitChangeResponse<T> {
    __batchResponses: IBatchResponses<T>[];
}

export interface IBatchResponses<T> {
    __changeResponses?: IChangeResponses<T>[];
    response?: ISubmitResponse;
    $reported?: boolean;
    message?: string;
}

export interface IChangeResponses<T> {
    $reported?: boolean;
    _imported?: boolean;
    statusCode?: string;
    statusText?: string;
    headers?: object;
    data?: T;
    response?: ISubmitResponse;
}

export interface ISubmitResponse {
    statusCode?: string;
    body?: string;
    statusText?: string;
    headers?: object;
}