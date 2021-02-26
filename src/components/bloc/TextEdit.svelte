<script lang="ts">
  import { afterUpdate, createEventDispatcher } from "svelte"
  import type { Bloc, Text } from "../../model/Page"
  import type { Move, PageEditEventDispatcher } from "../types"
  import {
    clearElement,
    createCollapsedRange,
    createCursorRangeAtBottom,
    createCursorRangeAtTop,
    createRangeFrom,
    replaceSelection
  } from "../../utils/dom"
  import { contentToDom, domToContent, wasUpdated } from "./helpers/TextEditAdapters"
  import { keyboardActions } from "./helpers/TextEditKeyboardActions"

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

  async function keydown(event: KeyboardEvent) {
    keyboardActions.onEvent(event, { dispatch, index, element, bloc })
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