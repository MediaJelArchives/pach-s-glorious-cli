export interface SheetContext {
  spreadsheetId: string
  sheetName: string
}

export interface QueryArgsReports {
  appId: string
  type: string
  utmCampaign: string
  retailId: string
}
export interface SheetColumns {
  UTM_CAMPAIGN: string
  RETAIL_ID: string
}

export interface CSVContext extends QueryArgsReports {
  rows: any[]
}
