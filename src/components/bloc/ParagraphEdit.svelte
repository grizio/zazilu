<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import type { Paragraph } from "../../model/Page"
  import type { Move, OnNewDetail } from "../types"

  export let bloc: Paragraph
  export let index: number

  let element: HTMLParagraphElement

  const dispatch = createEventDispatcher()

  onMount(() => {
    element.textContent = bloc.content
  })

  export function moveTo(move: Move) {
    if (element !== undefined) {
      let range = document.createRange()
      range.selectNodeContents(element)
      range.collapse(move === "start")
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  function update() {
    bloc = { ...bloc, content: element.textContent }
  }

  function keypress(event) {
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
        moveTo: "start"
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
  on:paste|preventDefault={paste}
></p>
