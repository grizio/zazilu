import { oneOf } from "./random"

const acceptedCharacters = Array.from("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
export function generateId(): string {
  let result = ""
  for (let i = 0; i < 20; i++) {
    result = result + oneOf(acceptedCharacters)
  }
  return result
}

export function repeat(str: string, times: number): string {
  if (times === 0) {
    return ""
  } else {
    let result = str
    for (let i = 1 ; i < times ; i++) {
      result += str
    }
    return result
  }
}