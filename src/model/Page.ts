export type Page = {
  key: string
  title: string
  content: Array<Bloc>
}

export type Bloc = Paragraph

export type Paragraph = {
  type: "p"
  content: string
}