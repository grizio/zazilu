<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import type { Bloc } from "$model/Page"
  import type { NewBloc, PageEditEventDispatcher } from "$lib/components/types"
  import { generateId } from "$lib/utils/strings"
  import Menu from "$lib/components/menu/Menu.svelte"
  import MenuItem from "$lib/components/menu/MenuItem.svelte"

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
    { key: "meets", label: "Meets" },
  ]

  const blocBuilder: Record<Bloc["type"], () => NewBloc> = {
    p: () => ({ type: "p", content: [] }),
    h1: () => ({ type: "h1", content: [] }),
    h2: () => ({ type: "h2", content: [] }),
    h3: () => ({ type: "h3", content: [] }),
    h4: () => ({ type: "h4", content: [] }),
    h5: () => ({ type: "h5", content: [] }),
    h6: () => ({ type: "h6", content: [] }),
    img: () => ({ type: "img", key: "" }),
    meet: () => ({ type: "meet", date: new Date(Date.now()), members: [] }),
    meets: () => ({
      type: "meets",
      meets: [{ type: "meet", id: generateId(), date: new Date(Date.now()), members: [] }],
    }),
  }

  function toggleMenu() {
    showMenu = !showMenu
  }

  function transform(target: Bloc["type"]): void {
    showMenu = false
    dispatch("transform", {
      index: parseInt(menu.dataset.index ?? "0", 10),
      type: target,
    })
  }

  function insertBefore(target: Bloc["type"]): void {
    showMenu = false
    dispatch("new", {
      index: parseInt(menu.dataset.index ?? "0", 10),
      bloc: blocBuilder[target](),
      moveTo: { type: "start" },
    })
  }

  function insertAfter(target: Bloc["type"]): void {
    showMenu = false
    dispatch("new", {
      index: parseInt(menu.dataset.index ?? "0", 10) + 1,
      bloc: blocBuilder[target](),
      moveTo: { type: "start" },
    })
  }

  function remove(): void {
    showMenu = false
    dispatch("remove", {
      index: parseInt(menu.dataset.index ?? "0", 10),
    })
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
</style>

<div class="bloc-action" id="pageForm-menu" bind:this={menu}>
  <button on:click|preventDefault={toggleMenu} data-test-id="menuButton">⚙</button>
  {#if showMenu}
    <Menu>
      <MenuItem label="Modify into" dataTestId="modify-into">
        {#each items as item}
          <MenuItem
            label={item.label}
            dataTestId={`menuItem-transform-${item.key}`}
            on:click={() => transform(item.key)}
          />
        {/each}
      </MenuItem>

      <MenuItem label="Insert before" dataTestId="insert-before">
        {#each items as item}
          <MenuItem
            label={item.label}
            dataTestId={`menuItem-insertBefore-${item.key}`}
            on:click={() => insertBefore(item.key)}
          />
        {/each}
      </MenuItem>

      <MenuItem label="Insert after" dataTestId="insert-after">
        {#each items as item}
          <MenuItem
            label={item.label}
            dataTestId={`menuItem-insertAfter-${item.key}`}
            on:click={() => insertAfter(item.key)}
          />
        {/each}
      </MenuItem>

      <MenuItem label="Remove" dataTestId="remove" on:click={remove} />
    </Menu>
  {/if}
</div>
