import type { Validator } from "idonttrustlikethat"
import { string } from "idonttrustlikethat"

export const nonEmptyString: Validator<string> = string.filter(_ => _ !== "")

export const dateTime: Validator<Date> = string.flatMap(dateString => {
  const dateNumber = Date.parse(dateString)
  if (isNaN(dateNumber)) {
    return { ok: false, errors: `Date expected, got: ${dateString}` }
  } else {
    return { ok: true, value: new Date(dateNumber) }
  }
})