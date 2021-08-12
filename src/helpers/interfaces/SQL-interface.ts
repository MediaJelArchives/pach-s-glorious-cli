import { MainContext, SheetColumns } from "./report-interface";

export interface SQLRequirements {
    sqlText: (arg0: MainContext) => string
}

export interface CPCSQLRequirements extends SQLRequirements {
    columns: {
        TR_ORDERID: {},
        TR_TOTAL: {},
        MKT_MEDIUM: {},
        MKT_SOURCE: {},
        MKT_CAMPAIGN: {},
        TRANSACTION_PAGE_URL: {},
        TRANSACTION_TIME: {},
        CLICKS: {},
    }
}

export interface OrganicSQLRequirements extends SQLRequirements {
    columns: {
        TR_ORDERID: {}
        TR_TOTAL: {}
        TRANSACTION_TIME: {}
        TRANSACTION_PAGE_URL: {}
        REFR_TERM: {}
        REFR_MEDIUM: {}
        REFR_SOURCE: {}
    }
}

export interface SQLTextArgs extends SheetColumns { }