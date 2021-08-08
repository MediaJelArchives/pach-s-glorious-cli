import { flags } from '@oclif/command'
import Command from '../helpers/shared/base'
import { QueryArgs, SQLContext } from '../helpers/query/interface'
import SQL from '../helpers/shared/SQL'
import { cli } from 'cli-ux'

export default class Query extends Command {
  static description = 'Query specific app ids from Snowflake database'

  static flags = {
    help: flags.help({
      char: 'h',
      description: `Help documentation`,
      hidden: true,
    }),
    appId: flags.string({
      char: 'a',
      description: `flag to declare the app id to query`,
      required: true,
    }),

    limit: flags.string({
      char: 'l',
      description: `flag to declare the limit of entries to be returned (note: 'NULL' === no limits)`,
      default: 'NULL',
    }),
  }

  static args = [
    {
      name: 'type',
      required: true,
      default: null,
      options: ['pageviews', 'transactions'],
    },
  ]

  async run() {
    const { flags, args } = this.parse(Query)
    const { appId, limit } = flags
    const { type } = args
    const context: QueryArgs = { appId, limit, type }

    try {
      this.task.initiateTask(`Querying ${type} for ${appId}, limit ${limit}`)
      this.initiatQuery(context)
    } catch (error) {
      this.error(error)
    }
  }

  private async initiatQuery(context: QueryArgs) {
    const sqlContext: SQLContext = new SQL(context).getStatement()
    const { limit, appId } = context
    const { sqlText, columns } = sqlContext
    const tryTask = this.task.tryTask
    const finishTask = this.task.finishTask

    const connection = await this.getConnection

    connection.execute({
      sqlText,
      fetchAsString: ['Date'],
      complete(err: any, stmt: any, rows: any) {
        const result = tryTask(err, rows)

        cli.table(result, columns)

        finishTask(`Returned ${limit} counts for ${appId}`)
      },
    })
  }
}
