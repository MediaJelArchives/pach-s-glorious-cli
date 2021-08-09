import { flags } from '@oclif/command'
import Command from '../helpers/shared/base'
import * as fs from 'fs-extra'
import * as PublicGoogleSheetsParser from 'public-google-sheets-parser'
import { SheetContext } from '../helpers/reports/interface'
import { QueryArgs, SQLContext } from '../helpers/interfaces/query-interface'
import { cli } from 'cli-ux'
import SQLReports from '../helpers/shared/SQLReports'
import { QueryArgsReports } from '../helpers/interfaces/report-interface'

export default class Reports extends Command {
  static description = 'Generate automated reports via the Google Sheets API.'

  static flags = {
    help: flags.help({ char: 'h', description: `Help documentation` }),

    sheetName: flags.string({
      char: 's',
      description: 'Specified sheet name to process reports on',
      required: true,
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

  async run() {
    const { args, flags } = this.parse(Reports)
    const { sheetName } = flags
    const { type } = args

    console.log(type)
    this.task.initiateTask('Initiating report processing!')
    const configExists = fs.pathExistsSync(this.configPath)

    if (configExists) {
      const sheetContext = this.readSheetConfig(sheetName)
      const contents: any[] = await this.getPublicSpreadsheet(sheetContext)
      const generateReports = contents.map((el) => {
        console.log(el)
      })

      this.task.finishTask('Report successfully processed!')
    } else {
      this.chalk.secondary('Error: Please check if your config file exists')
      this.exit
    }
  }

  private async queryReport(context: QueryArgsReports) {
    const sqlContext: SQLContext = new SQLReports(context).getStatement()
    const { appId, retailID, type, utmCampaign } = context
    const { sqlText, columns } = sqlContext
    const tryTask = this.task.tryTask
    const finishTask = this.task.finishTask

    const connection = await this.snowflakeConnection

    connection.execute({
      sqlText,
      fetchAsString: ['Date'],
      complete(err: any, stmt: any, rows: any) {
        const result = tryTask(err, rows)
        cli.table(result, columns)
        const successMessage = `Generated ${type} report for ${appId}, with UTM_CAMPAIGN: ${utmCampaign} and RETAIL_ID: ${retailID}`
        finishTask(successMessage)
      },
    })
  }

  protected readSheetConfig(sheetName: string): SheetContext {
    const configSync: string = fs.readFileSync(this.configPath, 'utf8')
    const config: ConfigJSON = JSON.parse(configSync)
    const spreadsheetId: string = config.GOOGLE_SPREADSHEET_ID
    const sheetContext: SheetContext = { spreadsheetId, sheetName }
    return sheetContext
  }
  protected async getPublicSpreadsheet(context: SheetContext): Promise<any[]> {
    const { sheetName, spreadsheetId } = context
    const parser = new PublicGoogleSheetsParser(spreadsheetId, sheetName)
    try {
      const spreadsheetContents = await parser.parse()
      return spreadsheetContents
    } catch (err) {
      this.chalk.secondary('Invalid sheet')
    }
  }
}
