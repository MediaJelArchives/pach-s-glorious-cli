import { Command, flags } from '@oclif/command'
import QueryHelper from '../helpers/query/query-helper'
import finishTask from '../helpers/shared/finish-task'
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
  }

  async run() {
    // Declare the arguments
    const { flags, raw } = this.parse(Query)
    const appId = raw[0].input

    flags.pageviews && (await this.queryPageview(appId))
    flags.transactions && (await this.queryTransaction(appId))

    // End task
  }

  private async queryPageview(appId: string) {
    cli.action.start(`Querying pageviews for ${appId}`, '', { stdout: true })
    await QueryHelper.Pageview.getPageviews(appId)
    finishTask(`Task completed for ${appId}`)
  }

  private async queryTransaction(appId: string) {
    cli.action.start(`Querying transactions for ${appId}`, '', { stdout: true })
  }
}
