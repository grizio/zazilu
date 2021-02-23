<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import type { Text } from "../../model/Page"
  import type { Move, OnMoveDetail, OnNewDetail, PageEditEventDispatcher } from "../types"
  import {
    createCollapsedRange,
    createCursorRangeAtBottom,
    createCursorRangeAtTop,
    getCurrentSelection,
    isOnFirstCharacterOf,
    isOnFirstLineOf,
    isOnLastCharacterOf,
    isOnLastLineOf,
    replaceSelection
  } from "../../utils/dom"

  export let bloc: Text
  export let index: number
  let previousBloc: Text | undefined = undefined

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

{#if bloc.type === "p"}
  <p
    contenteditable="true"
    bind:this={element}
    on:input={update}
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></p>
{:else if bloc.type === "h1"}
  <h1
    contenteditable="true"
    bind:this={element}
    on:input={update}
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h1>
{:else if bloc.type === "h2"}
  <h2
    contenteditable="true"
    bind:this={element}
    on:input={update}
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h2>
{:else if bloc.type === "h3"}
  <h3
    contenteditable="true"
    bind:this={element}
    on:input={update}
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h3>
{:else if bloc.type === "h4"}
  <h4
    contenteditable="true"
    bind:this={element}
    on:input={update}
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h4>
{:else if bloc.type === "h5"}
  <h5
    contenteditable="true"
    bind:this={element}
    on:input={update}
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h5>
{:else if bloc.type === "h6"}
  <h6
    contenteditable="true"
    bind:this={element}
    on:input={update}
    on:keypress={keypress}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h6>
{/if}