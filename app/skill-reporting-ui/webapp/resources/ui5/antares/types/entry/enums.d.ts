declare module "ui5/antares/types/entry/enums" {
    enum FormTypes {
        SMART = "SMART",
        SIMPLE = "SIMPLE"
    }
    enum NamingStrategies {
        CAMEL_CASE = "CAMEL_CASE",
        PASCAL_CASE = "PASCAL_CASE",
        KEBAB_CASE = "KEBAB_CASE",
        SNAKE_CASE = "SNAKE_CASE",
        CONSTANT_CASE = "CONSTANT_CASE"
    }
    enum DialogStrategies {
        CREATE = "CREATE",
        LOAD = "LOAD"
    }
    enum GuidStrategies {
        ONLY_KEY = "ONLY_KEY",
        ONLY_NON_KEY = "ONLY_NON_KEY",
        ALL = "ALL",
        NONE = "NONE"
    }
}
