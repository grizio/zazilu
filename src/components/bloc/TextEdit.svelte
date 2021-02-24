<script lang="ts">
  import { afterUpdate, createEventDispatcher, tick } from "svelte"
  import type { Text } from "../../model/Page"
  import type { Move, OnMoveDetail, OnNewDetail, PageEditEventDispatcher } from "../types"
  import {
    clearElement, createCollapsedRange,
    createCursorRangeAtBottom,
    createCursorRangeAtTop,
    getCurrentCaretPosition,
    getCurrentSelection,
    isOnFirstCharacterOf,
    isOnFirstLineOf,
    isOnLastCharacterOf,
    isOnLastLineOf,
    replaceSelection
  } from "../../utils/dom"
  import { contentToDom, domToContent, wasUpdated } from "./TextEditLogic"

  export let bloc: Text
  export let index: number
  let previousBloc: Text | undefined = undefined

  let element: HTMLParagraphElement

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
        replaceSelection(range)
      } else if (move.type === "bottom-relative") {
        const range = createCursorRangeAtBottom(element, move.x)
        replaceSelection(range)
      } else if (move.type === "offset-start") {
        const range = createCollapsedRange(element.firstChild ?? element, move.at)
        replaceSelection(range)
      } else if (move.type === "offset-end") {
        const range = createCollapsedRange(element.firstChild ?? element, element.textContent.length - move.at)
        replaceSelection(range)
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

  async function keydown(event: KeyboardEvent) {
    if (event.key === "ArrowUp" && isOnFirstLineOf(element)) {
      event.preventDefault()
      dispatch("move", {
        index: index - 1,
        move: { type: "bottom-relative", x: getCurrentSelection().getBoundingClientRect().x }
      } as OnMoveDetail)
    } else if (event.key === "ArrowDown" && isOnLastLineOf(element)) {
      event.preventDefault()
      dispatch("move", {
        index: index + 1,
        move: { type: "top-relative", x: getCurrentSelection().getBoundingClientRect().x }
      } as OnMoveDetail)
    } else if (event.key === "ArrowLeft" && isOnFirstCharacterOf(element)) {
      event.preventDefault()
      dispatch("move", {
        index: index - 1,
        move: { type: "end" }
      } as OnMoveDetail)
    } else if (event.key === "ArrowRight" && isOnLastCharacterOf(element)) {
      event.preventDefault()
      dispatch("move", {
        index: index + 1,
        move: { type: "start" }
      } as OnMoveDetail)
    } else if (event.key === "Backspace" && isOnFirstCharacterOf(element)) {
      event.preventDefault()
      blur()
      dispatch("merge", {
        firstIndex: index - 1,
        secondIndex: index,
        move: { type: "offset-end", at: element.textContent.length }
      } as OnMoveDetail)
    } else if (event.key === "Delete" && isOnLastCharacterOf(element)) {
      event.preventDefault()
      blur()
      dispatch("merge", {
        firstIndex: index,
        secondIndex: index + 1,
        move: { type: "offset-start", at: element.textContent.length }
      } as OnMoveDetail)
    } else if (event.key === " ") {
      const currentCaretPosition = getCurrentCaretPosition()
      if (currentCaretPosition !== undefined) {
        const textContent = (element.firstChild?.textContent ?? "")
        const blocCode = textContent.substring(0, currentCaretPosition.startOffset)
        const blocType = blocCodeMapping[blocCode]
        if (blocType !== undefined) {
          event.preventDefault()
          bloc = {
            ...bloc,
            type: blocType,
            content: [{ type: "text", content: textContent.substring(blocCode.length) }]
          }
          await tick()
          move({ type: "start" })
        }
      }
    }
  }

  function keypress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      const selection = window.getSelection()
      if (selection.rangeCount === 1) {
        event.preventDefault()
        const currentSelection = selection.getRangeAt(0)
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
      // else ignore
    }
  }

  function extractNextTexts() {
    const selection = window.getSelection()
    if (selection.rangeCount === 1) {
      const currentSelection = selection.getRangeAt(0)
      const leftRange = document.createRange()
      leftRange.setStart(element.firstChild, 0)
      leftRange.setEnd(currentSelection.startContainer, currentSelection.startOffset)

      const rightRange = document.createRange()
      rightRange.setStart(currentSelection.endContainer, currentSelection.endOffset)
      rightRange.setEnd(element.lastChild, element.lastChild.textContent.length)


      const rangeBeforeCaret = document.createRange()
      rangeBeforeCaret.selectNodeContents(element)
      rangeBeforeCaret.collapse(true)
      rangeBeforeCaret.setEnd(currentSelection.startContainer, currentSelection.startOffset)
      const textBeforeCaret = rangeBeforeCaret.cloneContents().textContent

      const rangeAfterCaret = document.createRange()
      rangeAfterCaret.selectNodeContents(element)
      rangeBeforeCaret.collapse(false)
      rangeAfterCaret.setStart(currentSelection.endContainer, currentSelection.endOffset)
      const textAfterCaret = rangeAfterCaret.cloneContents().textContent

      return [textBeforeCaret, textAfterCaret]
    } else {
      return [element.textContent, ""]
    }
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
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></p>
{:else if bloc.type === "h1"}
  <h1
    contenteditable="true"
    bind:this={element}
    on:blur={blur}
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h1>
{:else if bloc.type === "h2"}
  <h2
    contenteditable="true"
    bind:this={element}
    on:blur={blur}
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h2>
{:else if bloc.type === "h3"}
  <h3
    contenteditable="true"
    bind:this={element}
    on:blur={blur}
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h3>
{:else if bloc.type === "h4"}
  <h4
    contenteditable="true"
    bind:this={element}
    on:blur={blur}
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h4>
{:else if bloc.type === "h5"}
  <h5
    contenteditable="true"
    bind:this={element}
    on:blur={blur}
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h5>
{:else if bloc.type === "h6"}
  <h6
    contenteditable="true"
    bind:this={element}
    on:blur={blur}
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h6>
{/if}