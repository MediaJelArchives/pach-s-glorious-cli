import Command from '@oclif/command'
import { cli } from 'cli-ux'
import * as notifier from 'node-notifier'
import * as snowflake from 'snowflake-sdk'
import * as fs from 'fs-extra'
import { exec } from 'child_process'
import chalk = require('chalk')
// JSDOC
import { hook } from '../../hooks/init'

/**
 * This class serves as the main base class to be
 * extended for all Commands. This ensures that commands
 * inherit the necessary properties & methods that
 * are required for the pach-cli to function properly.
 *
 * It is absolutely necessary that the `configPath`
 * within this base class is the same as the `configPath`
 * located at the `init hook`
 *
 * @abstract
 * @class
 * @classdesc Base class to be used for all commands
 * @see hook
 *
 */
export default abstract class extends Command {
  /**
   *
   * Name of the config file to be used to store
   * User defined credentials and/or configurations
   *
   * @protected
   * @type {string}
   */

  protected configFileName: string = '/config.json'

  /**
   *
   * Full path of the config directory appended
   * by the config file name
   *
   * @protected
   * @type {string}
   */

  protected configPath: string = this.config.configDir + this.configFileName

  /**
   *
   * Instantiates the Snowflake connection only
   * if a config file exists. If a config file
   * exists, we will read it and use the credentials
   * for authenticating to Snowflake
   *
   * @async
   * @protected
   * @returns {snowflake.Connection}
   *
   */

  protected snowflakeConnection: Promise<snowflake.Connection> = new Promise(
    (resolve, reject) => {
      const configExists = fs.pathExistsSync(this.configPath)

      if (configExists) {
        const configSync = fs.readFileSync(this.configPath, 'utf8')
        const config: ConfigJSON = JSON.parse(configSync)
        const account = config.SNOWFLAKE_ACCOUNT
        const username = config.SNOWFLAKE_USERNAME
        const password = config.SNOWFLAKE_PASSWORD
        const region = config.SNOWFLAKE_REGION
        const database = config.SNOWFLAKE_DATABASE
        const warehouse = config.SNOWFLAKE_WAREHOUSE
        const connection = snowflake.createConnection({
          account,
          username,
          password,
          region,
          database,
          warehouse,
        })
        connection.connect(function (err: Error, conn: snowflake.Connection) {
          if (err) {
            console.error('Unable to connect: ' + err.message)
            reject(err)
          } else {
            resolve(conn)
          }
        })
      }
    }
  )

  /**
   *
   * Returns a string in chalk color
   *
   * @protected
   * @void
   *
   */

  protected chalk = {
    primary(log: any): string {
      return chalk.cyanBright.bold(log)
    },
    secondary(log: any): string {
      return chalk.magentaBright(log)
    },
  }

  /**
   *
   * Property to store all Task related
   * helper properties & methods.
   *
   * @protected
   * @memberof base
   *
   */

  protected task = {
    /**
     *
     * Prints message to stdout
     *
     * @param {string} message - Message to print to stdout
     * @void
     *
     */
    initiateTask(message: string): void {
      const chalkMessage = chalk.cyanBright(message)
      cli.action.start(chalkMessage, '', { stdout: true })
    },

    /**
     *
     * Takes in an error message and result.
     * Returns result if no errors take place
     *
     * @param {Error} err - Error object to return
     * @param {result} any - Result to return
     * @returns {any}
     *
     */
    tryTask(err: Error, result: any): any {
      if (err) {
        throw new Error(
          'Failed to execute statement due to the following error: ' +
            err.message
        )
      } else {
        return result
      }
    },

    /**
     *
     * Sends notification to the desktop
     * that a task has finished
     *
     * @param {string} message - Message to notify
     * @void
     *
     */
    finishTask(message: string): void {
      const chalkMessage = chalk.magentaBright(message)
      cli.action.stop(chalkMessage)
      notifier.notify({
        title: 'Task completed!',
        message: chalkMessage,
        sound: true,
        wait: true,
      })
    },

    /**
     *
     * Executes CLI commands within Node
     *
     * @async
     * @param {string} command - Command to be executed
     * @void
     *
     */
    executeCLI(command: string): void {
      exec(command, (error, stdout, stderr) => {
        error && console.log(`error: ${error.message}`)
        stderr && console.log(`${stderr}`)
        console.log(`${stdout}`)
      })
    },
  }
}
