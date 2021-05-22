import { Err, Ok, Validator } from "idonttrustlikethat"
import { string } from "idonttrustlikethat"

export const nonEmptyString: Validator<string> = string.filter(_ => _ !== "")

export const dateTime: Validator<Date> = string.and(dateString => {
  const dateNumber = Date.parse(dateString)
  if (isNaN(dateNumber)) {
    return { ok: false, errors: `Date expected, got: ${dateString}` }
  } else {
    return { ok: true, value: new Date(dateNumber) }
  }
})

export const permissiveInt: Validator<number> = new Validator((value, _c, path) => {
  if (typeof value === "number") {
    return Ok(value)
  } else if (typeof value === "string") {
    return Ok(parseInt(value, 10))
  } else {
    return Err([{ path: path, message: "Expected int, got " + typeof value }])
  }
});