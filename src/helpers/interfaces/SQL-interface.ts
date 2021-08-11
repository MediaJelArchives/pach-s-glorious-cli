import { QueryArgsReports } from "./report-interface";

export interface SQLRequirements {
    sqlText: (arg0: SQLTextArgs) => string
    columns: {}
}

export interface SQLTextArgs extends QueryArgsReports { }