import { QueryArgs, SQLContext } from './query-interface'
import getConnection from '../../data/snowflake/get-connection'
import handleResults from '../shared/handle-results'
import SQL from './query-sql'
import finishTask from '../shared/finish-task'
import cli from 'cli-ux'
// import parseColumns from '../shared/set-table'

const QueryHelper = {
  async get(context: QueryArgs): Promise<any> {
    const sqlContext: SQLContext = new SQL(context).getStatement()
    const { limit, appId } = context
    const { sqlText, columns } = sqlContext

    const connection = await getConnection

    connection.execute({
      sqlText,
      fetchAsString: ['Date'],
      complete(err, stmt, rows) {
        const result = handleResults(err, rows)
        cli.table(result, columns)
        finishTask(`Returned ${limit} counts for ${appId}`)
      },
    })
  },
}

export default QueryHelper
