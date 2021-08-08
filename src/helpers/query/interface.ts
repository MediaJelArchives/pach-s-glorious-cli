export interface QueryArgs {
  appId: string
  limit: string
  type: string
}

export interface QueryClass {
  Pageview: PageviewClass
  Transaction: TransactionClass
}

export interface SQLContext {
  sqlText: string
  columns: any
}

export interface PageviewClass {
  getPageviews(context: QueryArgs): Promise<void>
}

export interface TransactionClass {
  getTransactions(context: QueryArgs): Promise<void>
}
