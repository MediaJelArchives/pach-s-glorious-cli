import getConnection from '../../data/snowflake/get-connection'
import handleResults from '../shared/handle-results'
import SQL from './query-sql'
import { QueryClass } from './query-interface'

const QueryHelper: QueryClass = {
  Transaction: {
    async getTransactions(appId: string): Promise<any> {
      console.log(appId, 'queryclass')
    },
  },

  Pageview: {
    async getPageviews(appId: string): Promise<any> {
      const limit = 5
      const sqlText = new SQL(appId, limit).pageview()
      const connection = await getConnection
      connection.execute({
        sqlText,
        complete(err, stmt, rows) {
          const result = handleResults(err, rows)
          console.log(result)
        },
      })
    },
  },
}

export default QueryHelper
