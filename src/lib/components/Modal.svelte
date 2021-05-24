<script lang="ts">
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  function onkeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      dispatch("close")
    }
  }
</script>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.25);
    background-blend-mode: color;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background-color: white;
    padding: 8px;
    box-shadow: 0 0 200px #000000, 0 0 5px #aaaaaa;
    border-radius: 4px;
    width: 90vw;
    height: 90vh;
  }
</style>

<svelte:window on:keydown={onkeydown} />

<div class="overlay" on:click={() => dispatch("close")}>
  <div class="modal" on:click|stopPropagation>
    <slot />
  </div>
</div>
