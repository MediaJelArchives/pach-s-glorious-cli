export interface QueryClass {
  Pageview: Pageview
  Transaction: Transaction
}

export interface Pageview {
  getPageviews(appId: string): Promise<void>
  sqlText: string
}

export interface Transaction {
  getTransactions(appId: string): Promise<void>
  sqlText: string
}
