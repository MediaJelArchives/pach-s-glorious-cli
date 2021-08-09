interface QueryArgs {
  appId: string
  limit: string
  type: string
}

interface QueryClass {
  Pageview: PageviewClass
  Transaction: TransactionClass
}

interface SQLContext {
  sqlText: string
  columns: any
}

interface PageviewClass {
  getPageviews(context: QueryArgs): Promise<void>
}

interface TransactionClass {
  getTransactions(context: QueryArgs): Promise<void>
}

export { SQLContext, TransactionClass, PageviewClass, QueryArgs, QueryClass }
