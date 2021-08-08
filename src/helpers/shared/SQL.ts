import chalk = require('chalk')

import { table } from 'cli-ux/lib/styled/table'
import { QueryArgs } from '../query/interface'
import { SQLContext } from '../query/interface'
import Command from '../shared/base'
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
      APP_ID: {},
      COLLECTOR_TSTAMP: {},
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
      APP_ID: {},
      TR_TOTAL: { header: 'Total' },
      TR_ORDERID: { header: 'Order ID' },
      COLLECTOR_TSTAMP: {},
    }
    const context: SQLContext = { sqlText, columns }

    return context
  }
}
