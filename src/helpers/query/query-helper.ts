import getConnection from '../../data/snowflake'
import { QueryClass } from './query-interface'

// To create mixin
const QueryHelper: QueryClass = {
  Transaction: {
    sqlText: `SELECT * FROM SNOWPLOW.BASE_EVENTS WHERE APP_ID=`,

    async getTransactions(appId: string): Promise<any> {
      console.log(appId, 'queryclass')
    },
  },

  // Currently static
  Pageview: {
    sqlText: `SELECT APP_ID, COLLECTOR_TSTAMP
    FROM SNOWPLOW.BASE_EVENTS
    WHERE EVENT='page_view'
    ORDER BY COLLECTOR_TSTAMP DESC LIMIT 5`,

    async getPageviews(appId: string): Promise<any> {
      const connection = await getConnection
      connection.execute({
        sqlText: this.sqlText,
        complete(err, stmt, rows) {
          console.log(appId)
          if (err) {
            console.error(
              'Failed to execute statement due to the following error: ' +
                err.message +
                stmt
            )
          } else {
            console.log(rows)
            return rows
          }
        },
      })
    },
  },
}

export default QueryHelper
