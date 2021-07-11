export interface QueryClass {
  Pageview: PageviewClass
  Transaction: TransactionClass
}

export interface PageviewClass {
  getPageviews(appId: string, limit: string): Promise<void>
}

export interface TransactionClass {
  getTransactions(appId: string, limit: string): Promise<void>
}
