import type { Validator } from "idonttrustlikethat"
import { array, literal, object, recursion, string, union } from "idonttrustlikethat"
import type { Bloc, Emphasis, Image, Link, Meet, Meets, Page, PlainText, Strong, Text, TextPart } from "$model/Page"
import { dateTime, nonEmptyString } from "$lib/utils/validators"
import { uniqueBy } from "$lib/utils/arrays"

const textPartValidator: Validator<TextPart> = recursion(self => {
  const plainTextValidation: Validator<PlainText> = object({
    type: literal("text"),
    content: string
  })

  const strongValidation: Validator<Strong> = object({
    type: literal("strong"),
    content: array(self)
  })

  const emphasisValidation: Validator<Emphasis> = object({
    type: literal("em"),
    content: array(self)
  })

  const linkValidation: Validator<Link> = object({
    type: literal("link"),
    link: string,
    content: array(self)
  })

  return union(plainTextValidation, strongValidation, emphasisValidation, linkValidation)
})

const textValidator: Validator<Text> = object({
  type: union(literal("p"), literal("h1"), literal("h2"), literal("h3"), literal("h4"), literal("h5"), literal("h6")),
  id: nonEmptyString,
  content: array(textPartValidator),
})

const meetValidator: Validator<Meet> = object({
  type: literal("meet"),
  id: nonEmptyString,
  date: dateTime,
  members: array(nonEmptyString),
})

const meetsValidator: Validator<Meets> = object({
  type: literal("meets"),
  id: nonEmptyString,
  meets: array(meetValidator)
})

const imageValidator: Validator<Image> = object({
  type: literal("img"),
  id: nonEmptyString,
  key: nonEmptyString,
  alt: string.optional(),
  caption: string.optional()
})

const blocValidator: Validator<Bloc> = union(textValidator, meetValidator, meetsValidator, imageValidator)

export const pageValidation: Validator<Page> = object({
  key: nonEmptyString,
  title: nonEmptyString,
  content: array(blocValidator).filter(content => uniqueBy(content, _ => _.id)),
})
