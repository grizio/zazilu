export function removeUndefinedKeys<Value>(record: { [key: string]: Value | undefined }): { [key: string]: Value } {
  const result: { [key: string]: Value } = {}

  Object.keys(record).forEach(key => {
    const value = record[key]
    if (value !== null && value !== undefined) {
      result[key] = value
    }
  })

  return result
}