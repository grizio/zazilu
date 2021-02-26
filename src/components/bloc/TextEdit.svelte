<script lang="ts">
  import { afterUpdate, createEventDispatcher } from "svelte"
  import type { Text } from "../../model/Page"
  import type { Move, PageEditEventDispatcher } from "../types"
  import {
    createCursorRangeAtBottom,
    createCursorRangeAtTop,
    replaceSelection
  } from "../../utils/dom"
  import { contentToDom, domToContent, wasUpdated } from "./helpers/TextEditAdapters"
  import { keyboardActions } from "./helpers/TextEditKeyboardActions"
  import { XNode } from "../../utils/dom/XNode"
  import { Caret, XRange } from "../../utils/dom/Selection"

  export let bloc: Text
  export let index: number
  let previousBloc: Text | undefined = undefined

  export let element: HTMLElement

  const dispatch = createEventDispatcher<PageEditEventDispatcher>()

  afterUpdate(() => {
    if (wasUpdated(bloc, previousBloc)) {
      previousBloc = bloc
      new XNode(element)
        .clear()
        .append(...contentToDom(bloc.content))
    }
  })

  export function move(move: Move) {
    if (element !== undefined) {
      if (move.type === "start") {
        replaceSelection(Caret.startOf(element).getRange())
      } else if (move.type === "end") {
        replaceSelection(Caret.endOf(element).getRange())
      } else if (move.type === "top-relative") {
        replaceSelection(createCursorRangeAtTop(element, move.x)?.getRange())
      } else if (move.type === "bottom-relative") {
        replaceSelection(createCursorRangeAtBottom(element, move.x)?.getRange())
      } else if (move.type === "offset-start") {
        replaceSelection(Caret.at(new XNode(element.firstChild ?? element), move.at).getRange())
      } else if (move.type === "offset-end") {
        replaceSelection(Caret.at(new XNode(element.firstChild ?? element), element.textContent.length - move.at).getRange())
      } else if (move.type === "selection") {
        replaceSelection(XRange.from(new XNode(element), move.start, move.end)?.range)
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