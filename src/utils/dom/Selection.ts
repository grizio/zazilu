import { XNode } from "./XNode"
import { equalsWithMargin } from "../numbers"
import { replaceSelection } from "../dom"

export class UniqueSelection {
  private readonly range: Range

  constructor(range: Range) {
    this.range = range
  }

  get startContainer(): XNode {
    return new XNode<Node>(this.range.startContainer)
  }

  get startOffset(): number {
    return this.range.startOffset
  }

  get endContainer(): XNode {
    return new XNode(this.range.endContainer)
  }

  get endOffset(): number {
    return this.range.endOffset
  }

  get commonAncestorContainer(): XNode | undefined {
    return this.range.commonAncestorContainer !== undefined
      ? new XNode(this.range.commonAncestorContainer)
      : undefined
  }

  getBoundingClientRect = (): DOMRect => {
    return this.range.getBoundingClientRect()
  }

  cloneContents = (): XNode<DocumentFragment> => {
    return new XNode(this.range.cloneContents())
  }

  extractContents = (): XNode<DocumentFragment> => {
    return new XNode(this.range.extractContents())
  }

  selectNode = (node: XNode): void => {
    this.range.selectNode(node.node)
  }

  containsNodeType = (nodeName: string): boolean => {
    return this.cloneContents().hasNodeType(nodeName)
      || this.startContainer.hasParentType(nodeName)
      || this.endContainer.hasParentType(nodeName)
  }
}

export class Caret {
  readonly range: XRange

  constructor(range: XRange) {
    this.range = range
  }

  static create(): Caret {
    return new Caret(XRange.create())
  }

  static at(node: XNode, offset: number): Caret {
    return new Caret(
      XRange.create()
        .setStart(node, offset)
        .setEnd(node, offset)
    )
  }

  static startOf(node: Node): Caret {
    return new Caret(
      XRange.create()
        .selectNodeContents(node)
        .collapse(true)
    )
  }

  static endOf(node: Node): Caret {
    return new Caret(
      XRange.create()
        .selectNodeContents(node)
        .collapse(false)
    )
  }

  get offset() {
    return this.range.startOffset
  }

  getBoundingClientRect = (): DOMRect => {
    return this.range.getBoundingClientRect()
  }

  update = (container: Node, offset: number): this => {
    this.range
      .setStart(container, offset)
      .setEnd(container, offset)
    return this
  }

  getXPosition = (): number => {
    return this.range.getBoundingClientRect().x
  }

  getYPosition = (): number => {
    return this.range.getBoundingClientRect().y
  }

  isOnYPosition = (expectedY: number): boolean => {
    return equalsWithMargin(this.range.getBoundingClientRect().y, expectedY, 1)
  }

  isOnXPosition = (expectedX: number): boolean => {
    return equalsWithMargin(this.range.getBoundingClientRect().x, expectedX, 2)
  }

  getRange(): Range {
    return this.range.range
  }
}

export class XRange {
  readonly range: Range

  constructor(range: Range) {
    this.range = range
  }

  static create() {
    return new XRange(document.createRange())
  }

  static from(node: XNode, startOffset: number, endOffset: number): XRange | undefined {
    const start = XRange.findOffset(node, startOffset)
    const end = XRange.findOffset(node, endOffset)
    if (start !== undefined && end !== undefined) {
      return XRange.create()
        .setStart(start[0], start[1])
        .setEnd(end[0], end[1])
    } else {
      return undefined
    }
  }

  static findOffset(node: XNode, offset: number): [XNode, number] | undefined {
    if (0 <= offset && offset < node.textContentLength) {
      if (node.nodeName === "#text") {
        return [node, offset]
      } else {
        let previousOffset = 0
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes.item(i)
          const foundOffset = XRange.findOffset(new XNode(child), offset - previousOffset)
          if (foundOffset !== undefined) {
            return foundOffset
          }
          previousOffset = previousOffset + (child.textContent?.length ?? 0)
        }
        return undefined
      }
    } else {
      return undefined
    }
  }

  get startOffset(): number {
    return this.range.startOffset
  }

  getBoundingClientRect = (): DOMRect => {
    return this.range.getBoundingClientRect()
  }

  collapse = (toStart: boolean): this => {
    this.range.collapse(toStart)
    return this
  }

  selectNode = (node: XNode | Node | undefined | null): this => {
    if (node !== undefined && node !== null) {
      this.range.selectNode((node as XNode).node ?? node)
    }
    return this
  }

  selectNodeContents = (node: XNode | Node | undefined | null): this => {
    if (node !== undefined && node !== null) {
      this.range.selectNodeContents((node as XNode).node ?? node)
    }
    return this
  }

  setStart = (node: Node | XNode, offset: number): this => {
    this.range.setStart((node as XNode).node ?? node, offset)
    return this
  }

  setEnd = (node: Node | XNode, offset: number): this => {
    this.range.setEnd((node as XNode).node ?? node, offset)
    return this
  }

  setStartAtSelectionEnd = (selection: UniqueSelection): this => {
    return this.setStart(selection.endContainer, selection.endOffset)
  }

  setEndAtSelectionStart = (selection: UniqueSelection): this => {
    return this.setEnd(selection.startContainer, selection.startOffset)
  }

  cloneContents = (): XNode<DocumentFragment> => {
    return new XNode(this.range.cloneContents())
  }
}