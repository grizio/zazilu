<script lang="ts">
  import { afterUpdate, createEventDispatcher, tick } from "svelte"
  import type { Text } from "../../model/Page"
  import type { Move, OnMoveDetail, OnNewDetail, PageEditEventDispatcher } from "../types"
  import {
    cleanDom,
    clearElement,
    containsNodeType,
    createCollapsedRange,
    createCursorRangeAtBottom,
    createCursorRangeAtTop,
    createRangeFrom,
    getCurrentCaretPosition,
    getCurrentSelection,
    isOnFirstCharacterOf,
    isOnFirstLineOf,
    isOnLastCharacterOf,
    isOnLastLineOf,
    removeNodeType,
    replaceSelection
  } from "../../utils/dom"
  import { contentToDom, domToContent, wasUpdated } from "./helpers/TextEditAdapters"
  import { KeyboardListener } from "./helpers/KeyboardListener"

  export let bloc: Text
  export let index: number
  let previousBloc: Text | undefined = undefined

  export let element: HTMLElement

  const dispatch = createEventDispatcher<PageEditEventDispatcher>()

  afterUpdate(() => {
    if (wasUpdated(bloc, previousBloc)) {
      previousBloc = bloc
      clearElement(element)
      contentToDom(bloc.content).forEach(node => element.appendChild(node))
    }
  })

  export function move(move: Move) {
    if (element !== undefined) {
      if (move.type === "start") {
        let range = document.createRange()
        range.selectNodeContents(element.firstChild ?? element)
        range.collapse(true)
        replaceSelection(range)
      } else if (move.type === "end") {
        let range = document.createRange()
        range.selectNodeContents(element.lastChild ?? element)
        range.collapse(false)
        replaceSelection(range)
      } else if (move.type === "top-relative") {
        const range = createCursorRangeAtTop(element, move.x)
        if (range !== undefined) {
          replaceSelection(range)
        }
      } else if (move.type === "bottom-relative") {
        const range = createCursorRangeAtBottom(element, move.x)
        if (range !== undefined) {
          replaceSelection(range)
        }
      } else if (move.type === "offset-start") {
        const range = createCollapsedRange(element.firstChild ?? element, move.at)
        replaceSelection(range)
      } else if (move.type === "offset-end") {
        const range = createCollapsedRange(element.firstChild ?? element, element.textContent.length - move.at)
        replaceSelection(range)
      } else if (move.type === "selection") {
        const range = createRangeFrom(element, move.start, move.end)
        if (range !== undefined) {
          replaceSelection(range)
        }
      }
    }
  }

  function blur() {
    dispatch("update", {
      index,
      bloc: {
        ...bloc,
        content: domToContent(element.childNodes)
      }
    })
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

  const keyboardActions = new KeyboardListener()
    .on("ArrowUp")
    .filter(() => isOnFirstLineOf(element))
    .process(() => {
      dispatch("move", {
        index: index - 1,
        move: { type: "bottom-relative", x: getCurrentSelection().getBoundingClientRect().x }
      } as OnMoveDetail)
    })

    .on("ArrowDown")
    .filter(() => isOnLastLineOf(element))
    .process(() => {
      dispatch("move", {
        index: index + 1,
        move: { type: "top-relative", x: getCurrentSelection().getBoundingClientRect().x }
      } as OnMoveDetail)
    })

    .on("ArrowLeft")
    .filter(() => isOnFirstCharacterOf(element))
    .process(() => {
      dispatch("move", {
        index: index - 1,
        move: { type: "end" }
      } as OnMoveDetail)
    })

    .on("ArrowRight")
    .filter(() => isOnLastCharacterOf(element))
    .process(() => {
      dispatch("move", {
        index: index + 1,
        move: { type: "start" }
      } as OnMoveDetail)
    })

    .on("Backspace")
    .filter(() => isOnFirstCharacterOf(element))
    .process(() => {
      blur()
      dispatch("merge", {
        firstIndex: index - 1,
        secondIndex: index,
        move: { type: "offset-end", at: element.textContent.length }
      } as OnMoveDetail)
    })

    .on("Delete")
    .filter(() => isOnLastCharacterOf(element))
    .process(() => {
      blur()
      dispatch("merge", {
        firstIndex: index,
        secondIndex: index + 1,
        move: { type: "offset-start", at: element.textContent.length }
      } as OnMoveDetail)
    })

    .on(" ")
    .tryProcess(() => {
      const currentCaretPosition = getCurrentCaretPosition()
      if (currentCaretPosition !== undefined) {
        const textContent = (element.firstChild?.textContent ?? "")
        const blocCode = textContent.substring(0, currentCaretPosition.startOffset)
        const blocType = blocCodeMapping[blocCode]
        if (blocType !== undefined) {
          bloc = {
            ...bloc,
            type: blocType,
            content: [{ type: "text", content: textContent.substring(blocCode.length) }]
          }
          tick().then(() => move({ type: "start" }))
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    })

    .on("ctrl+b")
    .process(() => tryToggleElementSelection("STRONG", () => document.createElement("strong")))

    .on("ctrl+i")
    .process(() => tryToggleElementSelection("EM", () => document.createElement("em")))

    .on("Enter")
    .process(() => {
      const currentSelection = getCurrentSelection()
      if (currentSelection !== undefined) {
        const leftRange = document.createRange()
        leftRange.setStart(element.firstChild, 0)
        leftRange.setEnd(currentSelection.startContainer, currentSelection.startOffset)

        const rightRange = document.createRange()
        rightRange.setStart(currentSelection.endContainer, currentSelection.endOffset)
        rightRange.setEnd(element.lastChild, element.lastChild.textContent.length)

        const leftPart = leftRange.extractContents()
        const rightPart = rightRange.extractContents()

        clearElement(element)
        element.appendChild(leftPart)
        blur()
        dispatch("new", {
          index: index + 1,
          bloc: {
            type: "p",
            content: domToContent(rightPart.childNodes)
          },
          moveTo: { type: "start" }
        } as OnNewDetail)
      }
    })

  async function keydown(event: KeyboardEvent) {
    keyboardActions.onEvent(event)
  }

  function tryToggleElementSelection(nodeName: string, elementBuilder: () => Element) {
    const currentSelection = getCurrentSelection()
    if (currentSelection !== undefined) {
      if (containsNodeType(currentSelection, nodeName)) {
        removeElementSelection(currentSelection, nodeName)
      } else {
        addElementSelection(currentSelection, elementBuilder)
      }
    }
  }

  function addElementSelection(currentSelection: Range, elementBuilder: () => Element) {
    const leftRange = document.createRange()
    leftRange.selectNode(element.firstChild)
    leftRange.setEnd(currentSelection.startContainer, currentSelection.startOffset)

    const rightRange = document.createRange()
    rightRange.selectNode(element.lastChild)
    rightRange.setStart(currentSelection.endContainer, currentSelection.endOffset)

    const leftFragment = leftRange.extractContents()
    const middleFragment = currentSelection.extractContents()
    const rightFragment = rightRange.extractContents()

    const middleLeafContainer = elementBuilder()
    middleLeafContainer.appendChild(middleFragment)
    const middleContainer = wrapWithCurrentAncestors(middleLeafContainer, currentSelection)

    clearElement(element)
    element.appendChild(leftFragment)
    element.appendChild(middleContainer)
    element.appendChild(rightFragment)
    cleanDom(element)
    currentSelection.selectNode(middleLeafContainer)
  }

  function wrapWithCurrentAncestors(node: Node, currentSelection: Range, exceptNodeName?: string): Node {
    let current = currentSelection.commonAncestorContainer
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

  function removeElementSelection(currentSelection: Range, nodeName: string) {
    const leftRange = document.createRange()
    leftRange.selectNode(element.firstChild)
    leftRange.setEnd(currentSelection.startContainer, currentSelection.startOffset)

    const rightRange = document.createRange()
    rightRange.selectNode(element.lastChild)
    rightRange.setStart(currentSelection.endContainer, currentSelection.endOffset)

    const leftFragment = leftRange.extractContents()
    const middleFragment = currentSelection.extractContents()
    const rightFragment = rightRange.extractContents()
    removeNodeType(middleFragment, nodeName)

    const startOffset = leftFragment.textContent.toString().length
    const endOffset = startOffset + middleFragment.textContent.toString().length

    const middleLeafContainer = wrapWithCurrentAncestors(middleFragment, currentSelection, nodeName)

    clearElement(element)
    element.appendChild(leftFragment)
    element.appendChild(middleLeafContainer)
    element.appendChild(rightFragment)
    cleanDom(element)
    move({ type: "selection", start: startOffset, end: endOffset })
  }

  function paste(event: ClipboardEvent) {
    const pastedContent = event.clipboardData.getData("text/plain")
    if (pastedContent !== undefined) {
      document.execCommand("insertText", false, pastedContent)
    }
  }
</script>

{#if bloc.type === "p"}
  <p
    contenteditable="true"
    bind:this={element}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></p>
{:else if bloc.type === "h1"}
  <h1
    contenteditable="true"
    bind:this={element}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h1>
{:else if bloc.type === "h2"}
  <h2
    contenteditable="true"
    bind:this={element}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h2>
{:else if bloc.type === "h3"}
  <h3
    contenteditable="true"
    bind:this={element}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h3>
{:else if bloc.type === "h4"}
  <h4
    contenteditable="true"
    bind:this={element}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h4>
{:else if bloc.type === "h5"}
  <h5
    contenteditable="true"
    bind:this={element}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h5>
{:else if bloc.type === "h6"}
  <h6
    contenteditable="true"
    bind:this={element}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h6>
{/if}