import { equalsWithMargin, median } from "~/utils/numbers"
import { Caret, UniqueSelection } from "~/utils/dom/Selection"
import { XNode } from "~/utils/dom/XNode"

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

export function replaceSelection(range: Range | undefined): void {
  if (range !== undefined) {
    const selection = window.getSelection()
    if (selection !== null) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
}

export function createCursorRangeAtTop(node: Node, x: number): Caret | undefined {
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

export function createCursorRangeAtBottom(node: Node, x: number): Caret | undefined {
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
    for (let i = 0; i < node.childNodes.length; i++) {
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
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      const firstTextNode = getLastTextNode(node.childNodes.item(i))
      if (firstTextNode !== undefined) {
        return firstTextNode
      }
    }
    return undefined
  }
}

function findRangeAt(node: Node, expectedX: number, requiredY: number): Caret | undefined {
  let testingRange = document.createRange()
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes.item(i)
    testingRange.selectNodeContents(child)
    const containsPosition = i === node.childNodes.length - 1
      ? Array.from(testingRange.getClientRects()).some(clientRect => equalsWithMargin(clientRect.y, requiredY, 1))
      : Array.from(testingRange.getClientRects()).some(clientRect => equalsWithMargin(clientRect.y, requiredY, 1) && clientRect.left <= expectedX && expectedX <= clientRect.right)

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
function findLeafRangeAt(textNode: Text, expectedX: number, requiredY: number): Caret {
  let security = 100 // Security to avoid infinite loop
  let caret = Caret.create()
  let min = 0
  let max = textNode.textContent?.length ?? 0
  while (min + 1 < max && security > 0) {
    security--
    const testingPosition = median(min, max)
    caret.update(textNode, testingPosition)
    if (!caret.isOnYPosition(requiredY)) {
      if (caret.getYPosition() < requiredY) {
        min = testingPosition
      } else {
        max = testingPosition
      }
    } else if (caret.isOnXPosition(expectedX)) {
      min = max = testingPosition
    } else if (caret.getXPosition() < expectedX) {
      min = testingPosition
    } else {
      max = testingPosition
    }
  }
  if (min === max) {
    return caret
  } else {
    const minPosition = Caret.at(new XNode(textNode), min)!
    const maxPosition = Caret.at(new XNode(textNode), max)!
    let diffMinPosition = Math.abs(minPosition.getBoundingClientRect().x - expectedX)
    let diffMaxPosition = Math.abs(maxPosition.getBoundingClientRect().x - expectedX)
    if (diffMinPosition < diffMaxPosition) {
      return minPosition
    } else {
      return maxPosition
    }
  }
}
