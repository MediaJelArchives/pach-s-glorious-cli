export default function handleResults(err: Error, result: any): any {
  if (err) {
    throw new Error(
      'Failed to execute statement due to the following error: ' + err.message
    )
  } else {
    return result
  }
}
