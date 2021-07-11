export default function handleResults(err: Error, result: any): any {
  if (err) {
    console.error(
      'Failed to execute statement due to the following error: ' + err.message
    )
  } else {
    return result
  }
}
