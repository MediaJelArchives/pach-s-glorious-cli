import Command from '../helpers/shared/base'
import * as fs from 'fs-extra'
import * as PublicGoogleSheetsParser from 'public-google-sheets-parser'
import SQLReports from '../helpers/shared/SQLReports'
import { flags } from '@oclif/command'
import { CSVContext, QueryResultsArgs, SheetContext } from '../helpers/interfaces/report-interface'
import { cli } from 'cli-ux'
import { SheetColumns } from '../helpers/interfaces/report-interface'
import { parse } from 'json2csv'
import { SnowflakeQueryArgs } from '../helpers/interfaces/base-interface'

export default class Reports extends Command {
  static description = 'Generate automated reports via the Google Sheets API.'

  static flags = {
    help: flags.help({ char: 'h', description: `Help documentation` }),

    sheetName: flags.string({
      char: 's',
      description: 'Specified sheet name to process reports on',
      required: true,
    }),

    quiet: flags.boolean({
      char: 'q',
      description: 'Specified sheet name to process reports on',
      default: false,
    }),
  }

  static args = [
    {
      name: 'type',
      required: true,
      default: 'cpc',
      options: ['cpc'],

    },
  ]

  private msg = {
    logQuiet: '--quiet flag passed, will not print table to stdout',
    intitializationMessage: 'Generating report!',
    configFileExists: 'Config file exists... Continuing!',
  }

  async run() {
    const { args, flags } = this.parse(Reports)
    const { sheetName: appId, quiet } = flags
    const { type } = args
    this.task.initiateTask(this.msg.intitializationMessage)

    if (quiet) {
      this.chalk.warnLog(this.msg.logQuiet)
    }

    this.chalk.primarylog(this.msg.configFileExists)
    const sheetContext = this.readSheetConfig(appId)
    const sheetContents: any[] = await this.getPublicSpreadsheet(sheetContext)
    const sheetRows = `Generating cpc reports for ${sheetContents.length} UTM campaigns`
    this.chalk.secondarylog(sheetRows)

    sheetContents.map(async (column: SheetColumns) => {
      const { UTM_CAMPAIGN: utmCampaign, RETAIL_ID: retailId } = column
      const SQLContext = { appId, retailId, type, utmCampaign, quiet }
      const SQLClass = new SQLReports(SQLContext)

      const tableColumns = SQLClass.getColumns()
      const rows = await this.queryResults(SQLContext, SQLClass)
      const csvContext = { ...SQLContext, rows }

      if (rows.length !== 0) {
        if (!quiet) { cli.table(rows, tableColumns) }

        const rowLog = this.rowCount(csvContext)
        this.chalk.warnLog(rowLog)
        this.writeCSV(csvContext)
      }
      else {
        const noRows = this.rowCount(csvContext)
        this.chalk.errorLog(noRows)
      }
    })
  }

  private async queryResults(context: QueryResultsArgs, SQLClass: SQLReports): Promise<any[]> {
    const sqlText = SQLClass.getStatement()
    const { appId, retailId, type, utmCampaign } = context

    const attemptMessage = `Querying snowflake for ${type} report... APP_ID=${appId}, RETAIL_ID=${retailId}, UTM_CAMPAIGN=${utmCampaign}`
    this.chalk.warnLog(attemptMessage)
    try {
      const connection = await this.snowflake.connection
      const snowflakeQueryArgs: SnowflakeQueryArgs = { connection, sqlText }
      const queryResult = await this.snowflake.query(snowflakeQueryArgs)

      return queryResult
    } catch (err) {
      this.chalk.errorLog(err)
      this.exit(1)
    }
  }

  // Todo: Transfer this to base class later
  protected rowCount(context: CSVContext): string {
    const { appId, retailId, rows, utmCampaign } = context
    const message = `${rows.length} Rows returned for APP_ID=${appId}, UTM_CAMPAIGN=${utmCampaign}, RETAIL_ID=${retailId}, `
    return message
  }

  protected writeCSV(context: CSVContext): void {
    const { appId, retailId, type, rows, utmCampaign } = context

    const fields = Object.getOwnPropertyNames(rows[0]) // Takes first obj as an example
    const opts = { fields }
    const csv = parse(rows, opts)
    const title = `${appId} ${type} report - UTM_CAMPAIGN:${utmCampaign} RETAIL_ID:${retailId}.csv`
    fs.writeFileSync(title, csv)
    const successMessage = `Successfully generated ${type} report : ${title}`
    this.chalk.successLog(successMessage)
  }

  protected readSheetConfig(sheetName: string): SheetContext {
    const configSync: string = fs.readFileSync(this.configPath, 'utf8')
    const config: ConfigJSON = JSON.parse(configSync)
    const spreadsheetId: string = config.GOOGLE_SPREADSHEET_ID
    const sheetContext: SheetContext = { spreadsheetId, sheetName }
    const attemptMessage = `Generating report for Sheet name: ${sheetName} from Sheet ID: ${spreadsheetId}`
    this.chalk.primarylog(attemptMessage)
    return sheetContext
  }

  protected async getPublicSpreadsheet(context: SheetContext): Promise<any[]> {
    const { sheetName, spreadsheetId } = context
    const parser = new PublicGoogleSheetsParser(spreadsheetId, sheetName)
    const attemptMessage = `Parsing contents of Sheet name: ${sheetName} to JSON`
    try {
      const spreadsheetContents = await parser.parse()
      this.chalk.primarylog(attemptMessage)
      return spreadsheetContents
    } catch (err) {
      this.chalk.errorLog('Invalid sheet')
    }
  }
}
