export type Page = {
  key: string
  title: string
  content: Array<Bloc>
}

export type Bloc = Text

export type Text = {
  type: "p" | `h${1 | 2 | 3 | 4 | 5 | 6}`
  id: string
  content: string
}