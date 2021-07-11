import * as snowflake from 'snowflake-sdk'

const getConnection: Promise<snowflake.Connection> = new Promise(function (
  resolve,
  reject
) {
  snowflake.configure({ ocspFailOpen: false })
  const account = process.env.SNOWFLAKE_ACCOUNT!
  const username = process.env.SNOWFLAKE_USERNAME!
  const password = process.env.SNOWFLAKE_PASSWORD!
  const region = process.env.SNOWFLAKE_REGION!
  const database = process.env.SNOWFLAKE_DATABASE!
  const warehouse = process.env.SNOWFLAKE_WAREHOUSE!

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
})

export default getConnection
