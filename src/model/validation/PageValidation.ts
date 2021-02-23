import { array, literal, object, string, union, Validator } from "idonttrustlikethat"
import type { Bloc, Page, Paragraph } from "../Page"
import { nonEmptyString } from "../../utils/validators"
import { uniqueBy } from "../../utils/arrays"

const paragraphValidator: Validator<Paragraph> = object({
  type: literal("p"),
  id: nonEmptyString,
  content: string,
})

const blocValidator: Validator<Bloc> = union(paragraphValidator)

export const pageValidation: Validator<Page> = object({
  key: nonEmptyString,
  title: nonEmptyString,
  content: array(blocValidator).filter(content => uniqueBy(content, _ => _.id)),
})
