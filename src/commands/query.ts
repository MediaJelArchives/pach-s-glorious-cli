import { Command, flags } from '@oclif/command'
import { QueryArgs } from '../helpers/query/query-interface'
import QueryHelper from '../helpers/query/query-helper'
import initiateMessage from '../helpers/shared/initiate-message'

export default class Query extends Command {
  static description = 'Query specific app ids from Snowflake database'

  static flags = {
    help: flags.help({
      char: 'h',
      description: `Help documentation`,
      hidden: true,
    }),
    // flag with a value (-n, --name=VALUE)
    appId: flags.string({
      char: 'a',
      description: `flag to declare the app id to query`,
      default: 'null',
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
      default: 'pageviews',
      options: ['pageviews', 'transactions'],
    },
  ]

  async run() {
    // Declare the arguments
    const { flags, args } = this.parse(Query)
    const { appId, limit } = flags
    const { type } = args
    const context: QueryArgs = { appId, limit, type }

    try {
      await this.initiateQuery(context)
    } catch (error) {
      console.warn(error)
    }

    // type === 'pageviews' && (await this.queryPageview(appId, limit))
    // type === 'transactions' && (await this.queryTransaction(appId, limit))
  }

  private async initiateQuery(context: QueryArgs): Promise<void> {
    const { appId, limit, type } = context

    initiateMessage(`Querying ${type} for ${appId}, limit ${limit}`)

    await QueryHelper.get(context)
  }

  // private async queryPageview(appId: string, limit: string) {
  //   cli.action.start(`Querying pageviews for ${appId}`, '', { stdout: true })
  //   await QueryHelper.Pageview.getPageviews(appId, limit)
  // }

  // private async queryTransaction(appId: string, limit: string) {
  //   cli.action.start(`Querying transactions for ${appId}`, '', { stdout: true })
  //   await QueryHelper.Transaction.getTransactions(appId, limit)
  // }
}
