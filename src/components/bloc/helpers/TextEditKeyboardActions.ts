import { KeyboardListener } from "./KeyboardListener"
import {
  cleanDom,
  clearElement,
  containsNodeType,
  isOnFirstCharacterOf,
  isOnFirstLineOf,
  isOnLastCharacterOf,
  isOnLastLineOf,
  removeNodeType
} from "../../../utils/dom"
import { tick } from "svelte"
import { domToContent } from "./TextEditAdapters"
import type { PageEditEventDispatcher } from "../../types"
import type { Bloc } from "../../../model/Page"
import type { UniqueSelection } from "./Selection"

type RequiredDetail = {
  dispatch: <EventKey extends keyof PageEditEventDispatcher>(type: EventKey, detail?: PageEditEventDispatcher[EventKey]) => void
  element: HTMLElement
  index: number
  bloc: Bloc
}

const blocCodeMapping = {
  "#": "h1",
  "##": "h2",
  "###": "h3",
  "####": "h4",
  "#####": "h5",
  "######": "h6",
  "!#": "p",
}
export const keyboardActions = new KeyboardListener<RequiredDetail>()
  .on("ArrowUp")
  .withUniqueSelection()
  .filter(({ element, selection }) => isOnFirstLineOf(element, selection))
  .process(({ dispatch, index, selection }) => {
    dispatch("move", {
      index: index - 1,
      move: { type: "bottom-relative", x: selection.getBoundingClientRect().x }
    })
  })

  .on("ArrowDown")
  .withUniqueSelection()
  .filter(({ element, selection }) => isOnLastLineOf(element, selection))
  .process(({ dispatch, index, selection }) => {
    dispatch("move", {
      index: index + 1,
      move: { type: "top-relative", x: selection.getBoundingClientRect().x }
    })
  })

  .on("ArrowLeft")
  .withCaret()
  .filter(({ element, caret }) => isOnFirstCharacterOf(element, caret))
  .process(({ dispatch, index }) => {
    dispatch("move", {
      index: index - 1,
      move: { type: "end" }
    })
  })

  .on("ArrowRight")
  .withCaret()
  .filter(({ element, caret }) => isOnLastCharacterOf(element, caret))
  .process(({ dispatch, index }) => {
    dispatch("move", {
      index: index + 1,
      move: { type: "start" }
    })
  })

  .on("Backspace")
  .withCaret()
  .filter(({ element, caret }) => isOnFirstCharacterOf(element, caret))
  .process(({ dispatch, index, element, bloc }) => {
    dispatch("update", { index, bloc: { ...bloc, content: domToContent(element.childNodes) } })
    dispatch("merge", {
      firstIndex: index - 1,
      secondIndex: index,
      move: { type: "offset-end", at: (element.textContent ?? "").length }
    })
  })

  .on("Delete")
  .withCaret()
  .filter(({ element, caret }) => isOnLastCharacterOf(element, caret))
  .process(({ dispatch, index, element, bloc }) => {
    dispatch("update", { index, bloc: { ...bloc, content: domToContent(element.childNodes) } })
    dispatch("merge", {
      firstIndex: index,
      secondIndex: index + 1,
      move: { type: "offset-start", at: (element.textContent ?? "").length }
    })
  })

  .on(" ")
  .withCaret()
  .tryProcess(({ element, caret, dispatch, index, bloc }) => {
    const textContent = (element.firstChild?.textContent ?? "")
    const blocCode = textContent.substring(0, caret.offset)
    // @ts-ignore
    const blocType = blocCodeMapping[blocCode]
    if (blocType !== undefined) {
      dispatch("update", {
        index: index,
        bloc: {
          ...bloc,
          type: blocType,
          content: [{ type: "text", content: textContent.substring(blocCode.length) }]
        }
      })
      tick().then(() => dispatch("move", { index, move: { type: "start" } }))
      return true
    } else {
      return false
    }
  })

  .on("ctrl+b")
  .withUniqueSelection()
  .process((detail) => tryToggleElementSelection(detail.selection, "STRONG", () => document.createElement("strong"), detail))

  .on("ctrl+i")
  .withUniqueSelection()
  .process((detail) => tryToggleElementSelection(detail.selection, "EM", () => document.createElement("em"), detail))

  .on("Enter")
  .withUniqueSelection()
  .process(({ element, selection, dispatch, index, bloc }) => {
    const leftRange = document.createRange()
    if (element.firstChild !== null) {
      leftRange.setStart(element.firstChild, 0)
    }
    leftRange.setEnd(selection.startContainer, selection.startOffset)

    const rightRange = document.createRange()
    rightRange.setStart(selection.endContainer, selection.endOffset)
    if (element.lastChild !== null) {
      rightRange.setEnd(element.lastChild, (element.lastChild.textContent ?? "").length)
    }

    const leftPart = leftRange.extractContents()
    const rightPart = rightRange.extractContents()

    clearElement(element)
    element.appendChild(leftPart)
    dispatch("update", { index, bloc: { ...bloc, content: domToContent(element.childNodes) } })
    dispatch("new", {
      index: index + 1,
      bloc: {
        type: "p",
        content: domToContent(rightPart.childNodes)
      },
      moveTo: { type: "start" }
    })
  })

function tryToggleElementSelection(selection: UniqueSelection, nodeName: string, elementBuilder: () => Element, detail: RequiredDetail) {
  if (containsNodeType(selection, nodeName)) {
    removeElementSelection(selection, nodeName, detail)
  } else {
    addElementSelection(selection, elementBuilder, detail)
  }
}

function addElementSelection(currentSelection: UniqueSelection, elementBuilder: () => Element, { element }: RequiredDetail) {
  const leftRange = document.createRange()
  if (element.firstChild !== null) {
    leftRange.selectNode(element.firstChild)
  }
  leftRange.setEnd(currentSelection.startContainer, currentSelection.startOffset)

  const rightRange = document.createRange()
  if (element.lastChild !== null) {
    rightRange.selectNode(element.lastChild)
  }
  rightRange.setStart(currentSelection.endContainer, currentSelection.endOffset)

  const leftFragment = leftRange.extractContents()
  const middleFragment = currentSelection.extractContents()
  const rightFragment = rightRange.extractContents()

  const middleLeafContainer = elementBuilder()
  middleLeafContainer.appendChild(middleFragment)
  const middleContainer = wrapWithCurrentAncestors(middleLeafContainer, currentSelection, element)

  clearElement(element)
  element.appendChild(leftFragment)
  element.appendChild(middleContainer)
  element.appendChild(rightFragment)
  cleanDom(element)
  currentSelection.selectNode(middleLeafContainer)
}

function wrapWithCurrentAncestors(node: Node, currentSelection: UniqueSelection, element: HTMLElement, exceptNodeName?: string): Node {
  let current: Node | undefined | null = currentSelection.commonAncestorContainer
  let childNode = node
  while (current !== undefined && current !== null && current !== element) {
    if (current.nodeName !== "#text" && current.nodeName !== exceptNodeName) {
      const newParent = document.createElement(current.nodeName)
      newParent.appendChild(childNode)
      childNode = newParent
    }
    current = current.parentNode
  }
  return childNode
}

function removeElementSelection(
  currentSelection: UniqueSelection,
  nodeName: string,
  { dispatch, element, index }: RequiredDetail
) {
  const leftRange = document.createRange()
  if (element.firstChild !== null) {
    leftRange.selectNode(element.firstChild)
  }
  leftRange.setEnd(currentSelection.startContainer, currentSelection.startOffset)

  const rightRange = document.createRange()
  if (element.lastChild !== null) {
    rightRange.selectNode(element.lastChild)
  }
  rightRange.setStart(currentSelection.endContainer, currentSelection.endOffset)

  const leftFragment = leftRange.extractContents()
  const middleFragment = currentSelection.extractContents()
  const rightFragment = rightRange.extractContents()
  removeNodeType(middleFragment, nodeName)

  const startOffset = (leftFragment.textContent ?? "").length
  const endOffset = startOffset + (middleFragment.textContent ?? "").toString().length

  const middleLeafContainer = wrapWithCurrentAncestors(middleFragment, currentSelection, element, nodeName)

  clearElement(element)
  element.appendChild(leftFragment)
  element.appendChild(middleLeafContainer)
  element.appendChild(rightFragment)
  cleanDom(element)
  dispatch("move", { index, move: { type: "selection", start: startOffset, end: endOffset } })
}