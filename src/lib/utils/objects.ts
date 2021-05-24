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

export function omit<K extends keyof any, T extends Record<K, any>>(value: T, ...keys: Array<K>): Omit<T, K> {
  const result = { ...value }
  keys.forEach(key => delete result[key])
  return result
}
