import Command from '../helpers/shared/base'
import cli from 'cli-ux'
import fs = require('fs-extra')
import chalk = require('chalk')

export class Configure extends Command {
  static description = 'Initial configuration for CLI usage'

  public async run() {
    const configArgs = await this.promptConfig()
    this.writeConfig(configArgs, this.configPath)
    this.exit
  }

  private async promptConfig(): Promise<Config> {
    const account = await cli.prompt(
      this.chalk.primary('What is your Snowflake Account?'),
      {
        required: true,
      }
    )

    const username = await cli.prompt(
      this.chalk.primary('What is your Snowflake Username?'),
      {
        required: true,
      }
    )
    const password = await cli.prompt(
      this.chalk.primary('What is your Snowflake Password?'),
      {
        type: 'hide',
        required: true,
      }
    )
    const region = await cli.prompt(
      this.chalk.primary('What is your Snowflake Region?'),
      {
        required: true,
      }
    )
    const database = await cli.prompt(
      this.chalk.primary('What is your Snowflake Database?'),
      {
        required: true,
      }
    )
    const warehouse = await cli.prompt(
      this.chalk.primary('What is your Snowflake Warehouse?'),
      {
        required: true,
      }
    )

    const spreadSheetID = await cli.prompt(
      this.chalk.primary('[Optional] Add the Google sheet ID for reporting?'),
      {
        required: false,
        default: 'NONE',
      }
    )

    const config: Config = {
      account,
      database,
      password,
      region,
      username,
      warehouse,
      spreadSheetID,
    }
    return config
  }

  private writeConfig(configArgs: Config, configPath: string): void {
    const {
      account,
      warehouse,
      username,
      region,
      password,
      database,
      spreadSheetID,
    } = configArgs

    const content = {
      SNOWFLAKE_ACCOUNT: account,
      SNOWFLAKE_USERNAME: username,
      SNOWFLAKE_PASSWORD: password,
      SNOWFLAKE_REGION: region,
      SNOWFLAKE_DATABASE: database,
      SNOWFLAKE_WAREHOUSE: warehouse,
      GOOGLE_SPREADSHEET_ID: spreadSheetID,
    }

    fs.ensureFileSync(configPath)
    fs.writeJsonSync(configPath, content)
    this.log('Config file successfully created at' + configPath)
  }
}
