import { equalsWithMargin, median } from "./numbers"
import type { Caret, UniqueSelection } from "../components/bloc/helpers/Selection"

export type CustomEvent<A> = Event & {
  detail: A
}

export function getFirstLineDOMRect(element: Node): DOMRect | undefined {
  const elementRange = document.createRange()
  elementRange.selectNodeContents(element)
  return getFirstClientRect(elementRange)
}

export function getLastLineDOMRect(element: Node): DOMRect | undefined {
  const elementRange = document.createRange()
  elementRange.selectNodeContents(element)
  return getLastClientRect(elementRange)
}

export function getCurrentSelection(): Range | undefined {
  const selection = window.getSelection()
  if (selection === null || selection.rangeCount !== 1) {
    return undefined
  } else {
    return selection.getRangeAt(0)
  }
}

export function getCurrentCaretPosition(): Range | undefined {
  const currentSelection = getCurrentSelection()
  if (currentSelection?.collapsed === true) {
    return currentSelection
  } else {
    return undefined
  }
}

export function isOnFirstLineOf(node: Node, selection: UniqueSelection): boolean {
  if (!node.hasChildNodes()) {
    return true
  } else {
    const firstLineDOMRect = getFirstLineDOMRect(node)
    const selectionDOMRect = selection.getBoundingClientRect()
    return firstLineDOMRect !== undefined
      && equalsWithMargin(firstLineDOMRect.top, selectionDOMRect.top, 1)
  }
}

export function isOnLastLineOf(node: Node, selection: UniqueSelection): boolean {
  if (!node.hasChildNodes()) {
    return true
  } else {
    const lastLineDOMRect = getLastLineDOMRect(node)
    const selectionDOMRect = selection.getBoundingClientRect()
    return lastLineDOMRect !== undefined
      && equalsWithMargin(lastLineDOMRect.bottom, selectionDOMRect.bottom, 1)
  }
}

export function isOnFirstCharacterOf(node: Node, caret: Caret): boolean {
  if (!node.hasChildNodes()) {
    return true
  } else {
    const firstLineDOMRect = getFirstLineDOMRect(node)
    const selection = caret.getBoundingClientRect()
    return firstLineDOMRect !== undefined
      && equalsWithMargin(firstLineDOMRect.left, selection.left, 1)
  }
}

export function isOnLastCharacterOf(node: Node, caret: Caret): boolean {
  if (!node.hasChildNodes()) {
    return true
  } else {
    const lastLineDOMRect = getLastLineDOMRect(node)
    const selection = caret.getBoundingClientRect()
    return lastLineDOMRect !== undefined
      && equalsWithMargin(lastLineDOMRect.right, selection.right, 1)
  }
}

export function getFirstClientRect(range: Range | undefined): DOMRect | undefined {
  return range?.getClientRects()?.item(0) ?? undefined
}

export function getLastClientRect(range: Range | undefined): DOMRect | undefined {
  const clientRects = range?.getClientRects()
  return clientRects?.item(clientRects.length - 1) ?? undefined
}

export function replaceSelection(range: Range): void {
  const selection = window.getSelection()
  if (selection !== null) {
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

export function createCursorRangeAtTop(node: Node, x: number): Range | undefined {
  const firstTextNode = getFirstTextNode(node)
  if (firstTextNode !== undefined) {
    const range = document.createRange()
    range.selectNode(firstTextNode)
    const requiredY = getFirstClientRect(range)?.y
    if (requiredY !== undefined) {
      return findRangeAt(node, x, requiredY)
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}

export function createCursorRangeAtBottom(node: Node, x: number): Range | undefined {
  const lastTextNode = getLastTextNode(node)
  if (lastTextNode !== undefined) {
    const range = document.createRange()
    range.selectNode(lastTextNode)
    const requiredY = getLastClientRect(range)?.y
    if (requiredY !== undefined) {
      return findRangeAt(node, x, requiredY)
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}

export function getFirstTextNode(node: Node): Node | undefined {
  if (node.nodeName === "#text") {
    return node
  } else {
    for (let i = 0; i < node.childNodes.length ; i++) {
      const firstTextNode = getFirstTextNode(node.childNodes.item(i))
      if (firstTextNode !== undefined) {
        return firstTextNode
      }
    }
    return undefined
  }
}

export function getLastTextNode(node: Node): Node | undefined {
  if (node.nodeName === "#text") {
    return node
  } else {
    for (let i = node.childNodes.length - 1; i >= 0 ; i--) {
      const firstTextNode = getLastTextNode(node.childNodes.item(i))
      if (firstTextNode !== undefined) {
        return firstTextNode
      }
    }
    return undefined
  }
}

class CollapsedRange {
  private readonly range: Range

  constructor() {
    this.range = document.createRange()
  }

  setPosition = (element: Node, offset: number): this => {
    this.range.setStart(element, offset)
    this.range.setEnd(element, offset)
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
    return this.range
  }
}

function findRangeAt(node: Node, expectedX: number, requiredY: number): Range | undefined {
  let testingRange = document.createRange()
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes.item(i)
    testingRange.selectNodeContents(child)
    const containsPosition = Array.from(testingRange.getClientRects())
      .some(clientRect => equalsWithMargin(clientRect.y, requiredY, 1) && clientRect.left <= expectedX && expectedX <= clientRect.right)
    if (containsPosition) {
      if (child instanceof Text) {
        return findLeafRangeAt(child, expectedX, requiredY)
      } else {
        return findRangeAt(child, expectedX, requiredY)
      }
    }
  }
  return undefined
}

// binary search
function findLeafRangeAt(textNode: Text, expectedX: number, requiredY: number): Range {
  let security = 100 // Security to avoid infinite loop
  let collapsedRange = new CollapsedRange()
  let min = 0
  let max = textNode.textContent?.length ?? 0
  while (min + 1 < max && security > 0) {
    security--
    const testingPosition = median(min, max)
    collapsedRange.setPosition(textNode, testingPosition)
    if (!collapsedRange.isOnYPosition(requiredY)) {
      if (collapsedRange.getYPosition() < requiredY) {
        min = testingPosition
      } else {
        max = testingPosition
      }
    } else if (collapsedRange.isOnXPosition(expectedX)) {
      min = max = testingPosition
    } else if (collapsedRange.getXPosition() < expectedX) {
      min = testingPosition
    } else {
      max = testingPosition
    }
  }
  if (min === max) {
    return collapsedRange.getRange()
  } else {
    const minPosition = createCollapsedRange(textNode, min)
    const maxPosition = createCollapsedRange(textNode, max)
    let diffMinPosition = Math.abs(minPosition.getBoundingClientRect().x - expectedX)
    let diffMaxPosition = Math.abs(maxPosition.getBoundingClientRect().x - expectedX)
    if (diffMinPosition < diffMaxPosition) {
      return minPosition
    } else {
      return maxPosition
    }
  }
}

export function createCollapsedRange(node: Node, offset: number): Range {
  const range = document.createRange()
  range.setStart(node, offset)
  range.setEnd(node, offset)
  return range
}

export function clearElement(element: Element): void {
  while (element.firstChild !== undefined && element.firstChild !== null) {
    element.firstChild.remove()
  }
}

export function hasNodeType(element: Node, nodeName: string): boolean {
  return element.nodeName === nodeName
    || Array.from(element.childNodes).some(child => hasNodeType(child, nodeName))
}

export function containsNodeType(selection: UniqueSelection, nodeName: string): boolean {
  return hasNodeType(selection.cloneContents(), nodeName)
    || hasParentType(selection.startContainer, nodeName)
    || hasParentType(selection.endContainer, nodeName)
}

function hasParentType(element: Node | undefined, nodeName: string): boolean {
  return element !== undefined && (element.nodeName === nodeName || hasParentType(element.parentNode ?? undefined, nodeName))
}

/** Not pure, update the node directly */
export function removeNodeType(node: Node, nodeName: string): void {
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes.item(i)
    if (child.nodeName === nodeName) {
      const numberOfChildren = child.childNodes.length
      while (child.firstChild !== null) {
        node.insertBefore(child.firstChild, child)
      }
      child.remove()
      i = i + numberOfChildren - 1
    }
  }
}

/** Not pure, update the node directly */
export function cleanDom(node: Node): void {
  for (let i = 1; i < node.childNodes.length; i++) {
    const previousNode = node.childNodes.item(i - 1)
    const currentNode = node.childNodes.item(i)
    if (previousNode.nodeName === "#text" && currentNode.nodeName === "#text") {
      previousNode.textContent = (previousNode.textContent ?? "") + (currentNode.textContent ?? "")
      currentNode.remove()
      i--
    } else if (previousNode.nodeName === "STRONG" && currentNode.nodeName === "STRONG") {
      currentNode.childNodes.forEach(_ => previousNode.appendChild(_))
      currentNode.remove()
      i--
    }
  }
  node.childNodes.forEach(_ => cleanDom(_))
}

export function createRangeFrom(element: Element, startOffset: number, endOffset: number): Range | undefined {
  const range = document.createRange()
  const start = findOffset(element, startOffset)
  const end = findOffset(element, endOffset)
  if (start !== undefined && end !== undefined) {
    range.setStart(start[0], start[1])
    range.setEnd(end[0], end[1])
    return range
  } else {
    return undefined
  }
}

export function findOffset(node: Node, offset: number): [Node, number] | undefined {
  if (0 <= offset && offset < (node.textContent ?? "").length) {
    if (node.nodeName === "#text") {
      return [node, offset]
    } else {
      let previousOffset = 0
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes.item(i)
        const foundOffset = findOffset(child, offset - previousOffset)
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