

export interface SheetContext {
  spreadsheetId: string
  sheetName: string
}

export interface CSVContext extends MainContext {
  rows: any[]
}

// Main Context containing Base props & sheetColumn args. 
export interface MainContext {
  base: BaseContext,
  sheetColumns: SheetColumns
}
export interface BaseContext {
  appId: string
  type: string
  quiet: boolean
}

export interface SheetColumns {
  UTM_CAMPAIGN?: string
  RETAIL_ID?: string
}

export interface ReportProgress {
  total: number
  current: number
}