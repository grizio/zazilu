<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import type { Paragraph } from "../../model/Page"
  import type { Move, OnMoveDetail, OnNewDetail, PageEditEventDispatcher } from "../types"
  import {
    createCollapsedRange,
    createCursorRangeAtBottom,
    createCursorRangeAtTop,
    getCurrentSelection, isOnFirstCharacterOf,
    isOnFirstLineOf, isOnLastCharacterOf,
    isOnLastLineOf,
    replaceSelection
  } from "../../utils/dom"

  export let bloc: Paragraph
  export let index: number
  let previousBloc: Paragraph | undefined = undefined

  let element: HTMLParagraphElement

  const dispatch = createEventDispatcher<PageEditEventDispatcher>()

  onMount(() => {
    element.textContent = bloc.content
  })

  $: {
    if (bloc !== previousBloc) {
      const previousContent = previousBloc?.content
      previousBloc = bloc
      if (bloc?.content !== previousContent && element !== undefined) {
        const range = document.createRange()
        range.selectNodeContents(element.firstChild ?? element)
        range.collapse(false)
        const initialOffset = range.endOffset
        element.textContent = bloc.content
        replaceSelection(createCollapsedRange(element.firstChild ?? element, initialOffset))
      }
    }
  }

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
      }
    }
  }

  function update() {
    previousBloc = bloc = { ...bloc, content: element.textContent }
  }

  function keydown(event: KeyboardEvent) {
    console.log(event)
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
      dispatch("merge", {
        firstIndex: index - 1,
        secondIndex: index
      } as OnMoveDetail)
    } else if (event.key === "Delete" && isOnLastCharacterOf(element)) {
      event.preventDefault()
      dispatch("merge", {
        firstIndex: index,
        secondIndex: index + 1
      } as OnMoveDetail)
    }
  }

  function keypress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault()
      const [textToKeep, textForNextParagraph] = extractNextTexts()
      element.textContent = textToKeep
      update()

      dispatch("new", {
        index: index + 1,
        bloc: {
          type: "p",
          content: textForNextParagraph,
        },
        moveTo: { type: "start" }
      } as OnNewDetail)
    }
  }

  function extractNextTexts() {
    const selection = window.getSelection()
    if (selection.rangeCount === 1) {
      const currentSelection = selection.getRangeAt(0)

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

<p
  contenteditable="true"
  bind:this={element}
  on:input={update}
  on:keypress={keypress}
  on:keydown={keydown}
  on:paste|preventDefault={paste}
></p>
