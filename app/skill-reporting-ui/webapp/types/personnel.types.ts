export interface IPersonnelKeys {
    ID: string;
}

export interface IPersonnel {
    ID?: string;
    createdAt?: Date | null;
    createdBy?: string | null;
    modifiedAt?: Date | null;
    modifiedBy?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    country?: string | null;
    workHours?: number | null;
    teamID?: string | null;
    isActive?: boolean | null;
    email?: string | null;
    userRole?: string | null;
    sfUser?: string | null;
    isDedicated?: boolean | null;
    cost?: number | null;
    targetUtilization?: number | null;
    fullTimeEquivalent?: number | null;
}

export interface IIPersonnelUsersKeys {
    userID: string;
    personnelID: string;
}

export interface IPersonnelUsers {
    userID?: string;
    personnelID?: string;
    isDefaultUser?: boolean | null;
    country?: string | null;
}

export interface ITeamRateCalculation {
    teamID: string;
    inheritCalculatedRate: boolean;
}