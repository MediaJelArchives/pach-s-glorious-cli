import Command from '../helpers/shared/base'
import * as fs from 'fs-extra'
import * as PublicGoogleSheetsParser from 'public-google-sheets-parser'
import SQLReports from '../helpers/shared/SQLReports'
import { flags } from '@oclif/command'
import { CSVContext, BaseContext, SheetContext, SheetColumns, MainContext } from '../helpers/interfaces/report-interface'
import { cli } from 'cli-ux'
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
      options: ['cpc', 'organic'],

    },
  ]

  static examples = [
    '$ pach reports cpc -s Gormley -q',
    '$ pach reports organic -s Gormley'
  ]

  private msg = {
    logQuiet(quiet: Boolean): string {
      const logmsg = '--quiet flag passed, will not print table to stdout'
      if (quiet) return logmsg
      return ''
    },
    intitializationMessage: 'Generating report!',
    configFileExists: 'Config file exists... Continuing!',

  }

  //Todo: Make this appear after Row log
  private progress = {
    log: this.chalk.primarylog,
    initialValue: 0,
    increment(total: number): void {
      this.initialValue++
      this.log(`Progress: ${this.initialValue}/${total}`)
    }
  }

  async run() {
    const { args, flags } = this.parse(Reports)
    const { sheetName: appId, quiet } = flags
    const { type } = args
    this.task.initiateTask(this.msg.intitializationMessage)
    this.chalk.primarylog(this.msg.configFileExists)
    this.chalk.warnLog(this.msg.logQuiet(quiet))

    const sheetContext = this.readSheetConfig(appId)
    let sheetColumns: any[] = await this.getPublicSpreadsheet(sheetContext)
    const sheetRows = `Generating ${type} reports for ${sheetColumns.length} entries`
    this.chalk.secondarylog(sheetRows)

    //Todo: refactor this, checks for unique retail IDs
    if (type === 'organic') {
      sheetColumns = sheetColumns.filter((elem, index) => sheetColumns.findIndex(obj => obj.RETAIL_ID === elem.RETAIL_ID) === index)
      this.chalk.secondarylog(`Evaluating sheet results to process unique RETAIL_IDs,${sheetColumns.length} entries to process.`)
    }

    sheetColumns.map(async (column: SheetColumns) => {
      const base = { appId, type, quiet }
      const SQLContext = this.sheetOperator(base, column)
      const SQLClass = new SQLReports(SQLContext)
      const tableColumns = SQLClass.getColumns()
      const rows = await this.queryResults(SQLContext, SQLClass, sheetColumns.length)
      const CSVContext = { ...SQLContext, rows }

      if (rows.length !== 0) {
        if (!quiet) { cli.table(rows, tableColumns) }
        const rowLog = this.rowCount(CSVContext)
        this.chalk.warnLog(rowLog)
        this.writeCSV(CSVContext)
      }
      else {
        const noRows = this.rowCount(CSVContext)
        this.chalk.errorLog(noRows)
      }
    })
  }

  private sheetOperator(base: BaseContext, columns: SheetColumns): MainContext {
    const { RETAIL_ID, UTM_CAMPAIGN } = columns
    switch (base.type) {
      case 'cpc': {
        const sheetColumns: SheetColumns = { RETAIL_ID, UTM_CAMPAIGN }
        return { base, sheetColumns }
      }
      case 'organic': {
        const sheetColumns: SheetColumns = { RETAIL_ID }
        return { base, sheetColumns }
      }
    }
  }

  private async queryResults(context: MainContext, SQLClass: SQLReports, total: number) {

    const { base, sheetColumns } = context
    const { appId, type } = base
    const sqlText = SQLClass.getStatement()
    const entriesLog = this.logEntries(sheetColumns)

    const attemptMessage = `Querying snowflake for ${type} report... APP_ID: ${appId},${entriesLog}`
    this.chalk.warnLog(attemptMessage)
    try {
      const connection = await this.snowflake.connection
      const snowflakeQueryArgs: SnowflakeQueryArgs = { connection, sqlText }
      const queryResult = await this.snowflake.query(snowflakeQueryArgs)
      //Increment
      this.progress.increment(total)
      return queryResult
    } catch (err) {
      this.chalk.errorLog(err)
      this.exit(1)
    }
  }

  // Todo: Transfer this to base class later
  protected rowCount(context: CSVContext): string {
    const { base, rows, sheetColumns } = context
    const { appId } = base
    const entriesLog = this.logEntries(sheetColumns)
    const message = `${rows.length} Rows returned for APP_ID=${appId},${entriesLog}`
    return message
  }

  protected writeCSV(context: CSVContext): void {
    const { base, rows, sheetColumns } = context
    const { appId, type } = base
    const entriesLog = this.logEntries(sheetColumns)

    const fields = Object.getOwnPropertyNames(rows[0]) // Takes first obj as an example
    const opts = { fields }
    const csv = parse(rows, opts)
    const title = `${appId} ${type} report - ${entriesLog}.csv`
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

  protected async getPublicSpreadsheet(context: SheetContext): Promise<SheetColumns[]> {
    const { sheetName, spreadsheetId } = context
    const parser = new PublicGoogleSheetsParser(spreadsheetId, sheetName)
    const attemptMessage = `Parsing contents of Sheet name: ${sheetName} to JSON`
    try {
      const spreadsheetContents: SheetColumns[] = await parser.parse()
      this.chalk.primarylog(attemptMessage)
      return spreadsheetContents
    } catch (err) {
      this.chalk.errorLog('Invalid sheet')
    }
  }

  protected logEntries(context: SheetColumns): string[] {
    const sheetEntries = Object.entries(context)
    const logEntries = sheetEntries.map(([key, value]) => ` ${key}: ${value}`)
    return logEntries
  }
}
