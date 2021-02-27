import { KeyboardListener } from "./KeyboardListener"
import { isOnFirstCharacterOf, isOnFirstLineOf, isOnLastCharacterOf, isOnLastLineOf, } from "../../../utils/dom"
import { tick } from "svelte"
import { domToContent } from "./TextEditAdapters"
import type { PageEditEventDispatcher } from "../../types"
import type { Bloc } from "../../../model/Page"
import type { UniqueSelection } from "../../../utils/dom/Selection"
import { XRange } from "../../../utils/dom/Selection"
import { XNode } from "../../../utils/dom/XNode"

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
export const toggleBold = createToggleElementSelection("STRONG", () => XNode.create("strong"))
export const toggleItalic = createToggleElementSelection("EM", () => XNode.create("em"))

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
  .process(toggleBold)

  .on("ctrl+i")
  .withUniqueSelection()
  .process(toggleItalic)

  .on("Enter")
  .withUniqueSelection()
  .process(({ element, selection, dispatch, index, bloc }) => {
    const leftPart = XRange.create()
      .selectNode(element.firstChild)
      .setEndAtSelectionStart(selection)
      .cloneContents()

    const rightPart = XRange.create()
      .selectNode(element.lastChild)
      .setStartAtSelectionEnd(selection)
      .cloneContents()

    new XNode(element)
      .clear()
      .append(leftPart)
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

type ToggleElementSelectionParams = Pick<RequiredDetail, "element" | "dispatch" | "index"> & { selection: UniqueSelection }

export function createToggleElementSelection(nodeName: string, elementBuilder: () => XNode): (params: ToggleElementSelectionParams) => void {
  return (params) => {
    if (params.selection.containsNodeType(nodeName)) {
      removeElementSelection(nodeName, params)
    } else {
      addElementSelection(elementBuilder, params)
    }
  }
}

function addElementSelection(elementBuilder: () => XNode, { selection, element }: ToggleElementSelectionParams) {
  const leftFragment = XRange.create()
    .selectNode(element.firstChild)
    .setEndAtSelectionStart(selection)
    .cloneContents()

  const rightFragment = XRange.create()
    .selectNode(element.lastChild)
    .setStartAtSelectionEnd(selection)
    .cloneContents()

  const middleFragment = selection.extractContents()

  const middleLeafContainer = elementBuilder().append(middleFragment)
  const middleContainer = wrapWithCurrentAncestors(middleLeafContainer, selection, element)

  new XNode(element)
    .clear()
    .append(leftFragment, middleContainer, rightFragment)
    .clean()
  selection.selectNode(middleLeafContainer)
}

function wrapWithCurrentAncestors(node: XNode, currentSelection: UniqueSelection, element: HTMLElement, exceptNodeName?: string): XNode {
  let current = currentSelection.commonAncestorContainer
  let childNode: XNode = node
  while (current !== undefined && current.node !== element) {
    if (current.nodeName !== "#text" && current.nodeName !== exceptNodeName) {
      childNode = XNode.create(current.nodeName).append(childNode)
    }
    current = current.parentNode
  }
  return childNode
}

function removeElementSelection(
  nodeName: string,
  { selection, dispatch, element, index }: ToggleElementSelectionParams
) {
  const leftFragment = XRange.create()
    .selectNode(element.firstChild)
    .setEndAtSelectionStart(selection)
    .cloneContents()

  const rightFragment = XRange.create()
    .selectNode(element.lastChild)
    .setStartAtSelectionEnd(selection)
    .cloneContents()

  const middleFragment = selection
    .extractContents()
    .removeNodeType(nodeName)

  const startOffset = leftFragment.textContentLength
  const endOffset = startOffset + middleFragment.textContentLength

  const middleLeafContainer = wrapWithCurrentAncestors(middleFragment, selection, element, nodeName)

  new XNode(element)
    .clear()
    .append(leftFragment, middleLeafContainer, rightFragment)
    .clean()
  dispatch("move", { index, move: { type: "selection", start: startOffset, end: endOffset } })
}