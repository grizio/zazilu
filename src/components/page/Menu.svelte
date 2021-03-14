<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte"
  import type { Bloc } from "~/model/Page"
  import type { PageEditEventDispatcher } from "~/components/types"

  const dispatch = createEventDispatcher<PageEditEventDispatcher>()

  let menu: HTMLElement
  let showMenu: boolean = false

  const items: Array<{ key: Bloc["type"]; label: string }> = [
    { key: "p", label: "Paragraph" },
    { key: "h1", label: "Title 1" },
    { key: "h2", label: "Title 2" },
    { key: "h3", label: "Title 3" },
    { key: "h4", label: "Title 4" },
    { key: "h5", label: "Title 5" },
    { key: "h6", label: "Title 6" },
    { key: "img", label: "Image" },
    { key: "meet", label: "Meet" },
  ]

  function toggleMenu() {
    showMenu = !showMenu
  }

  function transform(target: Bloc["type"]): () => void {
    return () => {
      showMenu = false
      dispatch("transform", {
        index: parseInt(menu.dataset.index ?? "0", 10),
        type: target,
      })
    }
  }
</script>

<style>
  .bloc-action {
    position: absolute;
    top: -100%;
  }

  .bloc-action > button {
    width: 25px;
    height: 25px;
    font-size: 16px;
    padding: 0 2px;
    right: 100%;
    background-color: #ffffff;
    border: none;
    outline: none;
    cursor: pointer;
    transition: all ease-in-out 250ms;
  }

  .bloc-action > button:hover {
    background-color: #999999;
  }

  .menu {
    position: absolute;
    width: 150px;
    left: 4px;
    background-color: #ffffff;
    border: 1px solid #999999;
    box-shadow: 0 2px 5px rgba(102, 102, 102, 0.5);
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .menu li button {
    display: block;
    width: 100%;
    background-color: transparent;
    border: none;
    padding: 8px 4px;
    cursor: pointer;
    text-align: left;
  }

  .menu li:not(:last-of-type) button {
    border-bottom: 1px solid #999999;
  }

  .menu li button:hover {
    background-color: #cccccc;
  }
</style>

<div class="bloc-action" id="pageForm-menu" bind:this={menu}>
  <button on:click|preventDefault={toggleMenu} data-test-id="menuButton"
    >⚙</button
  >
  {#if showMenu}
    <ul class="menu">
      {#each items as item}
        <li>
          <button
            on:click|preventDefault={transform(item.key)}
            data-test-id={`menuItem-${item.key}`}
          >
            {item.label}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
