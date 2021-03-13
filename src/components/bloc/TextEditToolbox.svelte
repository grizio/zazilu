<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { getCurrentSelection } from "~/utils/dom"

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
    background-color: #ffffff;
    border: 1px solid #999999;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(102, 102, 102, 0.5);
    padding: 4px;
  }

  button {
    background-color: #ffffff;
    border: 1px solid #999999;
    padding: 4px 8px;
    transition: all ease-in-out 250ms;
    cursor: pointer;
  }

  button:hover {
    background-color: #cccccc;
  }

  .bold {
    font-weight: 700;
  }

  .italic {
    font-style: italic;
  }

  .link {
    text-decoration: underline;
  }
</style>

<div class="toolbox-wrapper">
  <div class="toolbox">
    <button class="bold" on:mousedown|preventDefault={ignore} on:click|preventDefault={() => dispatch("bold")} data-test-id="toolbox-bold">
      Bold
    </button>
    <button class="italic" on:mousedown|preventDefault={ignore} on:click|preventDefault={() => dispatch("italic")} data-test-id="toolbox-italic">
      Italic
    </button>
    <button class="link" on:mousedown|preventDefault={ignore} on:click|preventDefault={onLink} data-test-id="toolbox-link">
      Link
    </button>
  </div>
</div>