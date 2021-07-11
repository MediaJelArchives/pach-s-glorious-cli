import { Command, flags } from '@oclif/command'
import QueryHelper from '../helpers/query/query-helper'

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
  }

  async run() {
    const { flags, raw } = this.parse(Query)
    const appId = raw[0].input

    flags.pageviews && this.queryPageview(appId)
    flags.transactions && this.queryTransaction(appId)
  }

  private async queryPageview(appId: string) {
    QueryHelper.Pageview.getPageviews(appId)
    this.log(`querying pageview for ${appId}`)
  }

  private async queryTransaction(appId: string) {
    this.log(`querying transaction for ${appId}`)
  }
}
