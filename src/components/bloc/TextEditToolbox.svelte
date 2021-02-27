<script lang="ts">
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  function ignore() {}
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
  </div>
</div>