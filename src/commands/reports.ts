import { flags } from '@oclif/command'
import Command from '../helpers/shared/base'
import * as fs from 'fs-extra'
import * as PublicGoogleSheetsParser from 'public-google-sheets-parser'
import { SheetContext } from '../helpers/reports/interface'

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

    this.task.initiateTask('Initiating report processing!')
    const configExists = fs.pathExistsSync(this.configPath)

    if (configExists) {
      const configSync: string = fs.readFileSync(this.configPath, 'utf8')
      const config: ConfigJSON = JSON.parse(configSync)
      const spreadsheetId: string = config.GOOGLE_SPREADSHEET_ID
      const sheetContext: SheetContext = { spreadsheetId, sheetName }
      const result: any[] = await this.getPublicSpreadsheet(sheetContext)
      console.log(result)
      this.task.finishTask('Report successfully processed!')
    } else {
      this.chalk.secondary('Error: Please check if your config file exists')
      this.exit
    }
  }

  protected async getPublicSpreadsheet(context: SheetContext): Promise<any[]> {
    const { sheetName, spreadsheetId } = context
    const parser = new PublicGoogleSheetsParser(spreadsheetId, sheetName)
    try {
      const result = await parser.parse()
      return result
    } catch (err) {
      this.chalk.secondary('Invalid sheet')
    }
  }
}
