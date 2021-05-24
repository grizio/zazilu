import { isDefined } from "./arrays"

export function buildUrl(path: string, query: Record<string, string | number | undefined>): string {
  const queryPart = Object.entries(query)
    .map(([key, value]) => {
      if (value !== undefined) {
        return `${key}=${encodeURIComponent(value.toString())}`
      } else {
        return undefined
      }
    })
    .filter(isDefined)
    .join("&")

  if (queryPart !== "") {
    return `${path}?${queryPart}`
  } else {
    return path
  }
}