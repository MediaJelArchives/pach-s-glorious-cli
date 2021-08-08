import { QueryArgs } from '../query/interface'
import { SQLContext } from '../query/interface'
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

  public getStatement(): SQLContext {
    switch (this.type) {
      case 'pageviews': {
        return this.genericPageview()
      }
      case 'transactions': {
        return this.genericTransaction()
      }
      default: {
        throw new Error('Invalid SQL type')
      }
    }
  }

  private genericPageview(): SQLContext {
    const sqlText = `SELECT APP_ID, COLLECTOR_TSTAMP
      FROM DATA_COLLECTION_DB.SNOWPLOW.BASE_EVENTS
      WHERE APP_ID = '${this.appId}' AND EVENT='page_view'
      ORDER BY COLLECTOR_TSTAMP DESC LIMIT ${this.limit}`
    const columns = {
      APP_ID: {
        header: 'APP_ID',
        get: (row: any) => row['APP_ID'],
      },
      COLLECTOR_TSTAMP: {
        header: 'COLLECTOR_TSTAMP',
        get: (row: any) => row['COLLECTOR_TSTAMP'],
      },
    }
    const context: SQLContext = { sqlText, columns }
    return context
  }

  private genericTransaction(): SQLContext {
    const sqlText = `
      SELECT APP_ID,
      COLLECTOR_TSTAMP,
      TR_TOTAL,
      TR_ORDERID
      FROM DATA_COLLECTION_DB.SNOWPLOW.COMMERCE_TRANSACTIONS
      WHERE APP_ID='${this.appId}' 
      ORDER BY COLLECTOR_TSTAMP DESC
      LIMIT ${this.limit}`
    const columns = {
      APP_ID: {
        header: 'APP_ID',
        get: (row: any) => row['APP_ID'],
      },
      COLLECTOR_TSTAMP: {
        header: 'COLLECTOR_TSTAMP',
        get: (row: any) => row['COLLECTOR_TSTAMP'],
      },
      TR_TOTAL: {
        header: 'TR_TOTAL',
        get: (row: any) => row['TR_TOTAL'],
      },
      TR_ORDERID: {
        header: 'TR_ORDERID',
        get: (row: any) => row['TR_ORDERID'],
      },
    }
    const context: SQLContext = { sqlText, columns }

    return context
  }
}
