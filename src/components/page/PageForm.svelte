<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import type { Page } from "../../model/Page"
  import BlocEdit from "../bloc/BlocEdit.svelte"
  import { insert } from "../../utils/arrays"
  import { generateId } from "../../utils/strings"
  import type { OnMoveDetail, OnNewDetail } from "../types"

  export let page: Page
  let blocs: Array<any> = []

  const dispatchEvent = createEventDispatcher()

  function onNewBloc(event: CustomEvent<OnNewDetail>) {
    const { index, bloc, moveTo } = event.detail
    page = {
      ...page,
      content: insert(page.content, index, { ...bloc, id: generateId() })
    }
    if (moveTo !== undefined) {
      setTimeout(() => blocs[index].move(moveTo), 0)
    }
  }

  function onMove(event: CustomEvent<OnMoveDetail>) {
    const { index, move } = event.detail
    if (0 <= index && index < blocs.length) {
      setTimeout(() => blocs[index].move(move))
    }
  }

  function submit() {
    dispatchEvent("submit", page)
  }
</script>

<h1>Edit page</h1>

<label for="title">Title</label>
<input type="text" name="title" id="title" bind:value={page.title}/>

{#each page.content as bloc, index (bloc.id)}
  <BlocEdit
    bind:bloc={bloc}
    bind:this={blocs[index]}
    index={index}
    on:new={onNewBloc}
    on:move={onMove}
  />
{/each}

<button on:click={submit}>Save</button>