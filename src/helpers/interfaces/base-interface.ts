import * as snowflake from 'snowflake-sdk'

export interface SnowflakeBase {
  connection: Promise<snowflake.Connection>
  query: any //Promise<any[]>
}

export interface SnowflakeQueryArgs {
  connection: snowflake.Connection
  sqlText: string
}
