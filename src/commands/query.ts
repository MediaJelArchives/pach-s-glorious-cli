import { Command, flags } from '@oclif/command'
import QueryHelper from '../helpers/query/query-helper'

import cli from 'cli-ux'

export default class Query extends Command {
  static description = 'Query specific app ids from Snowflake database'

  static flags = {
    help: flags.help({
      char: 'h',
      description: `Help documentation`,
    }),
    // flag with a value (-n, --name=VALUE)
    pageviews: flags.string({
      char: 'p',
      description: `query all pageview data based on app ID sorted by date from snowflake`,
    }),

    transactions: flags.string({
      char: 't',
      description: `query all transaction data based on app ID sorted by date from snowflake`,
    }),

    limit: flags.string({
      char: 'l',
      description: `query all transaction data based on app ID sorted by date from snowflake`,
      default: 'NULL',
    }),
  }

  static args = [
    {
      name: 'query type',
      required: true,
      default: 'pageviews',
      options: ['pageviews', 'transactions'],
    },
  ]

  async run() {
    // Declare the arguments
    const { flags, args } = this.parse(Query)
    console.log(args)
    const { pageviews, limit, transactions } = flags
    const appId = pageviews ?? transactions ?? 'NULL'

    flags.pageviews && (await this.queryPageview(appId, limit))
    flags.transactions && (await this.queryTransaction(appId, limit))
  }

  private async queryPageview(appId: string, limit: string) {
    cli.action.start(`Querying pageviews for ${appId}`, '', { stdout: true })
    await QueryHelper.Pageview.getPageviews(appId, limit)
  }

  private async queryTransaction(appId: string, limit: string) {
    cli.action.start(`Querying transactions for ${appId}`, '', { stdout: true })
    await QueryHelper.Transaction.getTransactions(appId, limit)
  }
}
