export interface QueryClass {
  Pageview: PageviewClass
  Transaction: TransactionClass
}

export interface PageviewClass {
  getPageviews(appId: string): Promise<void>
}

export interface TransactionClass {
  getTransactions(appId: string): Promise<void>
}
