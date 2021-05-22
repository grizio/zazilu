export type Page = {
  key: string
  title: string
  content: Array<Bloc>
}

export type Bloc = Text | Meet | Meets | Image

export type Text = {
  type: "p" | `h${1 | 2 | 3 | 4 | 5 | 6}`
  id: string
  content: Array<TextPart>
}

export type TextPart = PlainText | Strong | Emphasis | Link

export type PlainText = {
  type: "text"
  content: string
}

export type Strong = {
  type: "strong"
  content: Array<TextPart>
}

export type Emphasis = {
  type: "em"
  content: Array<TextPart>
}

export type Link = {
  type: "link"
  link: string
  content: Array<TextPart>
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

export function strong(value: Omit<Strong, "type">): Strong {
  return {
    ...value,
    type: "strong"
  }
}

export function em(value: Omit<Strong, "type">): Emphasis {
  return {
    ...value,
    type: "em"
  }
}

export function link(value: Omit<Link, "type">): Link {
  return {
    ...value,
    type: "link"
  }
}

export type Meet = {
  type: "meet"
  id: string
  date: Date
  members: Array<string>
}

export type Meets = {
  type: "meets"
  id: string
  meets: Array<Meet>
}

export type Image = {
  type: "img"
  id: string
  src: string
  alt?: string
  caption?: string
}