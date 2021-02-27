<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { getCurrentSelection } from "../../utils/dom"

  const dispatch = createEventDispatcher()

  function ignore() {}

  function onLink() {
    const selection = getCurrentSelection()
    if (selection !== undefined) {
      const link = prompt("Link")
      if (selection.collapsed) {
        const text = prompt("Text")
        dispatch("link", { link, text })
      } else {
        dispatch("link", { link })
      }
    }
  }
</script>

<style>
  .toolbox-wrapper {
    position: relative;
  }

  .toolbox {
    position: absolute;
    bottom: 0;
  }
</style>

<div class="toolbox-wrapper">
  <div class="toolbox">
    <button on:mousedown|preventDefault={ignore} on:click={() => dispatch("bold")} data-test-id="toolbox-bold">B</button>
    <button on:mousedown|preventDefault={ignore} on:click={() => dispatch("italic")} data-test-id="toolbox-italic">I</button>
    <button on:mousedown|preventDefault={ignore} on:click={onLink} data-test-id="toolbox-link">Link</button>
  </div>
</div>