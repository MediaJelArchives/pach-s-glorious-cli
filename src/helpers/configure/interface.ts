interface Config {
  account: string
  username: string
  password: string
  region: string
  database: string
  warehouse: string
}

interface ConfigJSON {
  SNOWFLAKE_ACCOUNT: string
  SNOWFLAKE_USERNAME: string
  SNOWFLAKE_PASSWORD: string
  SNOWFLAKE_REGION: string
  SNOWFLAKE_DATABASE: string
  SNOWFLAKE_WAREHOUSE: string
}
