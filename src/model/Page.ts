export type Page = {
  key: string
  title: string
  content: Array<Bloc>
}

export type Bloc = Text

export type Text = {
  type: "p" | `h${1 | 2 | 3 | 4 | 5 | 6}`
  id: string
  content: Array<TextPart>
}

export type TextPart = PlainText

export type PlainText = {
  type: "text"
  content: string
}

const isTextTypes = ["p", "h1", "h2", "h3", "h4", "h5", "h6"]
export function isText(bloc: Bloc): bloc is Text {
  return isTextTypes.includes(bloc.type)
}

export function plainText(value: Omit<PlainText, "type">): PlainText {
  return {
    ...value,
    type: "text"
  }
}
