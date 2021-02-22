import { equalsWithMargin, median } from "./numbers"

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

export function isOnFirstLineOf(node: Node): boolean {
  if (!node.hasChildNodes()) {
    return true
  } else {
    const firstLineDOMRect = getFirstLineDOMRect(node)
    const selection = getCurrentSelection()?.getBoundingClientRect()
    return firstLineDOMRect !== undefined
      && selection !== undefined
      && equalsWithMargin(firstLineDOMRect.top, selection.top, 1)
  }
}

export function isOnLastLineOf(node: Node): boolean {
  if (!node.hasChildNodes()) {
    return true
  } else {
    const lastLineDOMRect = getLastLineDOMRect(node)
    const selection = getCurrentSelection()?.getBoundingClientRect()
    return lastLineDOMRect !== undefined
      && selection !== undefined
      && equalsWithMargin(lastLineDOMRect.bottom, selection.bottom, 1)
  }
}

export function isOnFirstCharacterOf(node: Node): boolean {
  if (!node.hasChildNodes()) {
    return true
  } else {
    const firstLineDOMRect = getFirstLineDOMRect(node)
    const selection = getCurrentSelection()?.getBoundingClientRect()
    return firstLineDOMRect !== undefined
      && selection !== undefined
      && equalsWithMargin(firstLineDOMRect.left, selection.left, 1)
  }
}

export function isOnLastCharacterOf(node: Node): boolean {
  if (!node.hasChildNodes()) {
    return true
  } else {
    const lastLineDOMRect = getLastLineDOMRect(node)
    const selection = getCurrentSelection()?.getBoundingClientRect()
    return lastLineDOMRect !== undefined
      && selection !== undefined
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

export function createCursorRangeAtTop(parentElement: Node, x: number): Range {
  if (parentElement instanceof Text) {
    const baseY = getFirstLineDOMRect(parentElement)?.y ?? 0
    return findRangeAt(parentElement, x, baseY)
  } else {
    if (parentElement.childNodes.length > 0) {
      const firstElement = parentElement.childNodes.item(0)
      return createCursorRangeAtTop(firstElement, x)
    } else {
      return createCollapsedRange(parentElement, 0)
    }
  }
}

export function createCursorRangeAtBottom(parentElement: Node, x: number): Range {
  if (parentElement instanceof Text) {
    const baseY = getLastLineDOMRect(parentElement)?.y ?? 0
    return findRangeAt(parentElement, x, baseY)
  } else {
    if (parentElement.childNodes.length > 0) {
      const firstElement = parentElement.childNodes.item(0)
      return createCursorRangeAtBottom(firstElement, x)
    } else {
      return createCollapsedRange(parentElement, 0)
    }
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

// binary search
function findRangeAt(element: Node, expectedX: number, requiredY: number): Range {
  let security = 0 // Security to avoid infinite loop
  let collapsedRange = new CollapsedRange()
  let min = 0
  let max = element.textContent?.length ?? 0
  while (min + 1 < max && security < 100) {
    security++
    const testingPosition = median(min, max)
    collapsedRange.setPosition(element, testingPosition)
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
    const minPosition = createCollapsedRange(element, min)
    const maxPosition = createCollapsedRange(element, max)
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