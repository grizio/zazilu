<script lang="ts">
  import { afterUpdate, createEventDispatcher } from "svelte"
  import type { Text } from "../../model/Page"
  import type { Move, PageEditEventDispatcher } from "../types"
  import { createCursorRangeAtBottom, createCursorRangeAtTop, getCurrentSelection } from "../../utils/dom"
  import { contentToDom, domToContent, wasUpdated } from "./helpers/TextEditAdapters"
  import { keyboardActions, toggleBold, toggleItalic } from "./helpers/TextEditKeyboardActions"
  import { XNode } from "../../utils/dom/XNode"
  import { Caret, UniqueSelection, XRange } from "../../utils/dom/Selection"
  import TextEditToolbox from "./TextEditToolbox.svelte"

  const dispatch = createEventDispatcher<PageEditEventDispatcher>()

  export let bloc: Text
  export let index: number

  let previousBloc: Text | undefined = undefined
  let element: HTMLElement
  let hasFocus: boolean = false

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
        Caret.startOf(element).persistOnDOM()
      } else if (move.type === "end") {
        Caret.endOf(element).persistOnDOM()
      } else if (move.type === "top-relative") {
        createCursorRangeAtTop(element, move.x)?.persistOnDOM()
      } else if (move.type === "bottom-relative") {
        createCursorRangeAtBottom(element, move.x)?.persistOnDOM()
      } else if (move.type === "offset-start") {
        Caret.at(new XNode(element), move.at)?.persistOnDOM()
      } else if (move.type === "offset-end") {
        const xnode = new XNode(element)
        Caret.at(xnode, xnode.textContentLength - move.at)?.persistOnDOM()
      } else if (move.type === "selection") {
        XRange.from(new XNode(element), move.start, move.end)?.persistOnDOM()
      }
    }
  }

  function focus() {
    hasFocus = true
  }

  function blur() {
    hasFocus = false
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

  function onBold() {
    const selection = getCurrentSelection()
    if (selection !== undefined) {
      toggleBold({ element, index, dispatch, selection: new UniqueSelection(selection) })
    }
  }

  function onItalic() {
    const selection = getCurrentSelection()
    if (selection !== undefined) {
      toggleItalic({ element, index, dispatch, selection: new UniqueSelection(selection) })
    }
  }
</script>

{#if hasFocus}
  <TextEditToolbox
    on:bold={onBold}
    on:italic={onItalic}
  />
{/if}

{#if bloc.type === "p"}
  <p
    contenteditable="true"
    bind:this={element}
    on:focus={focus}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></p>
{:else if bloc.type === "h1"}
  <h1
    contenteditable="true"
    bind:this={element}
    on:focus={focus}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h1>
{:else if bloc.type === "h2"}
  <h2
    contenteditable="true"
    bind:this={element}
    on:focus={focus}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h2>
{:else if bloc.type === "h3"}
  <h3
    contenteditable="true"
    bind:this={element}
    on:focus={focus}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h3>
{:else if bloc.type === "h4"}
  <h4
    contenteditable="true"
    bind:this={element}
    on:focus={focus}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h4>
{:else if bloc.type === "h5"}
  <h5
    contenteditable="true"
    bind:this={element}
    on:focus={focus}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h5>
{:else if bloc.type === "h6"}
  <h6
    contenteditable="true"
    bind:this={element}
    on:focus={focus}
    on:blur={blur}
    on:keydown={keydown}
    on:paste|preventDefault={paste}
    data-test-id={bloc.id}
  ></h6>
{/if}