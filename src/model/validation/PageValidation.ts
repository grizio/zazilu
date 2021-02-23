import { array, literal, object, string, union, Validator } from "idonttrustlikethat"
import type { Bloc, Page, Text } from "../Page"
import { nonEmptyString } from "../../utils/validators"
import { uniqueBy } from "../../utils/arrays"

const textValidator: Validator<Text> = object({
  type: union(literal("p"), literal("h1"), literal("h2"), literal("h3"), literal("h4"), literal("h5"), literal("h6")),
  id: nonEmptyString,
  content: string,
})

const blocValidator: Validator<Bloc> = textValidator

export const pageValidation: Validator<Page> = object({
  key: nonEmptyString,
  title: nonEmptyString,
  content: array(blocValidator).filter(content => uniqueBy(content, _ => _.id)),
})
