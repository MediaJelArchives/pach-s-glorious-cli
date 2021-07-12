import { QueryArgs } from './query-interface'
import getConnection from '../../data/snowflake/get-connection'
import handleResults from '../shared/handle-results'
import SQL from './query-sql'
import finishTask from '../shared/finish-task'
import cli from 'cli-ux'

const QueryHelper = {
  async get(context: QueryArgs): Promise<any> {
    const { limit, appId } = context
    const sqlText = new SQL(context).getStatement()
    const connection = await getConnection

    connection.execute({
      sqlText,
      fetchAsString: ['Date'],
      complete(err, stmt, rows) {
        const result = handleResults(err, rows)
        console.log(result)
        cli.table(result, {
          APP_ID: {
            header: 'APP_ID',
            get: (row: any) => row['APP_ID'],
          },
          COLLECTOR_TSTAMP: {
            header: 'COLLECTOR_TSTAMP',
            get: (row: any) => row['COLLECTOR_TSTAMP'],
          },
        })

        finishTask(`Returned ${limit} counts for ${appId}`)
      },
    })
  },
}
// Transaction: {
//   async getTransactions(appId: string, limit: string): Promise<any> {
//     const sqlText = new SQL(appId, limit).transaction()
//     const connection = await getConnection
//     connection.execute({
//       sqlText,
//       complete(err, stmt, rows) {
//         const result = handleResults(err, rows)
//         console.log(result)
//         finishTask(`Returned ${limit} counts for ${appId}`)
//       },
//     })
//   },
// },

// Pageview: {
//   async getPageviews(appId: string, limit: string): Promise<any> {
//     const sqlText = new SQL(appId, limit).pageview()
//     const connection = await getConnection
//     connection.execute({
//       sqlText,
//       complete(err, stmt, rows) {
//         const result = handleResults(err, rows)
//         console.log(result)
//         cli.table(result, {
//           APP_ID: {
//             header: 'APP_ID',
//             get: (row: any) => row['APP_ID'],
//           },
//           COLLECTOR_TSTAMP: {
//             header: 'TSTAMP',
//             get: (row: any) => row['COLLECTOR_TSTAMP'],
//           },
//         })

//         finishTask(`Returned ${limit} counts for ${appId}`)
//       },
//     })
//   },
// },

export default QueryHelper
