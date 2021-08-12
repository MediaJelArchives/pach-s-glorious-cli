import Command from '../helpers/shared/base'

export default class Abort extends Command {
  static description = 'Abourt any queries that are currently running for your snowflake user'

  async run() {
    const config = this.getConfigFile()
    const user = config.SNOWFLAKE_USERNAME
    const attemptMessage = `Attempting to abort all running queries for ${user}`
    this.task.initiateTask(attemptMessage)

    try {
      const sqlText = `ALTER USER ${user} ABORT ALL QUERIES`
      const successMessage = `Successfully aborted all running queries for ${user}`
      const connection = await this.snowflake.connection
      await this.snowflake.query({ connection, sqlText })
      this.chalk.successLog(successMessage)
    }
    catch (err) {
      this.chalk.errorLog(err)
    }
  }
}
