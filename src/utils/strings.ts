import { oneOf } from "./random"

const acceptedCharacters = Array.from("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
export function generateId(): string {
  let result = ""
  for (let i = 0; i < 20; i++) {
    result = result + oneOf(acceptedCharacters)
  }
  return result
}