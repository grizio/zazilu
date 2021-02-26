export class UniqueSelection {
  private readonly range: Range

  constructor(range: Range) {
    this.range = range
  }

  get startContainer() {
    return this.range.startContainer
  }

  get startOffset() {
    return this.range.startOffset
  }

  get endContainer() {
    return this.range.endContainer
  }

  get endOffset() {
    return this.range.endOffset
  }

  get commonAncestorContainer() {
    return this.range.commonAncestorContainer
  }

  getBoundingClientRect = (): DOMRect => {
    return this.range.getBoundingClientRect()
  }

  cloneContents = (): DocumentFragment => {
    return this.range.cloneContents()
  }

  extractContents = (): DocumentFragment => {
    return this.range.extractContents()
  }

  selectNode = (node: Node): void => {
    this.range.selectNode(node)
  }
}

export class Caret {
  private readonly range: Range

  constructor(range: Range) {
    this.range = range
  }

  get container() {
    return this.range.startContainer
  }

  get offset() {
    return this.range.startOffset
  }

  getBoundingClientRect = (): DOMRect => {
    return this.range.getBoundingClientRect()
  }

  update = (container: Node, offset: number): this => {
    this.range.setStart(container, offset)
    this.range.setEnd(container, offset)
    return this
  }
}