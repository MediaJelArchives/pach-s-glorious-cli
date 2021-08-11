import * as snowflake from 'snowflake-sdk'

export interface SnowflakeBase {
  connection: Promise<snowflake.Connection>
}
