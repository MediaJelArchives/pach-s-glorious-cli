import { QueryArgs } from './query-interface'

export default class SQL {
  private context: QueryArgs

  private appId: string

  private limit: string

  private type: string

  constructor(context: QueryArgs) {
    this.context = context
    this.appId = context.appId
    this.limit = context.limit
    this.type = context.type
  }

  public getStatement() {
    if (this.type === 'pageviews') {
      return this.genericPageview()
    }
    if (this.type === 'transactions') {
      return this.genericTransaction()
    }
    throw new Error('No SQL for provided type')
  }

  private genericPageview(): string {
    const sql = `SELECT APP_ID, COLLECTOR_TSTAMP
      FROM DATA_COLLECTION_DB.SNOWPLOW.BASE_EVENTS
      WHERE APP_ID = '${this.appId}' AND EVENT='page_view'
      ORDER BY COLLECTOR_TSTAMP DESC LIMIT ${this.limit}`

    return sql
  }

  private genericTransaction(): string {
    const sql = `
      SELECT APP_ID,
      COLLECTOR_TSTAMP,
      TR_TOTAL,
      TR_ORDERID
      FROM DATA_COLLECTION_DB.SNOWPLOW.COMMERCE_TRANSACTIONS
      WHERE APP_ID='${this.appId}' 
      ORDER BY COLLECTOR_TSTAMP DESC
      LIMIT ${this.limit}`

    return sql
  }
}
