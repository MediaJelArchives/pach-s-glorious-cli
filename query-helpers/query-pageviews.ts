import getConnection from '../src/data/snowflake'

const querySFPageview = async () => {
  await getConnection()
    .then((res) => console.log(res))
    .catch((error) => console.log(error))
}

export default querySFPageview
