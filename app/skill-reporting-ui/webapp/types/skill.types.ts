export interface IVSkills {
    ID: string;
    categoryID: string;
    canonicalName: string;
    normalizedName: string;
    description: string;
    status: string;
    isActive: boolean;
}

export interface IVSkillsKeys {
    ID: string;
}

export interface IVEmployeeSkills {
    ID: string;
    employeeID: string;
    skillID: string;
    proficiencyLevelID: string;
    yearsExperience: number;
    lastUsedOn: string;
    source: string;
    validationStatus: string;
    confirmedAt: string;
}

export interface IVEmployeeSkillsKeys {
    ID: string;
}

export interface ISkillCategories {
    ID: string;
    name: string;
    description: string;
    sortOrder: number;
    isActive: boolean;
}

export interface ISkillCategoriesKeys {
    ID: string;
}
