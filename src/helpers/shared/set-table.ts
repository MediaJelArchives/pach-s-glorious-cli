// import cli from 'cli-ux'

// In construction
// Returns and parses columns of table to be used for cli.table
export default function parseColumns(data: any[]) {
  const sample = data[0] // Takes first index as samples
  const properties = Object.getOwnPropertyNames(sample)
  const columns = properties.map((property) => {
    const tableColumn = {
      [property]: {
        header: property,
        get: (row: any) => row[property],
      },
    }
    return tableColumn
  })
  return columns
}
