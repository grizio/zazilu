<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import type { Page, Text } from "../../model/Page"
  import BlocEdit from "../bloc/BlocEdit.svelte"
  import { insert, remove, replace } from "../../utils/arrays"
  import { generateId } from "../../utils/strings"
  import type { BlocEditComponent, OnMergeDetail, OnMoveDetail, OnNewDetail } from "../types"

  export let page: Page
  let blocs: Array<BlocEditComponent> = []

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
    if (0 <= index && index < blocs.length && blocs[index] !== undefined && blocs[index] !== null) {
      setTimeout(() => blocs[index].move(move))
    }
  }

  function onMerge(event: CustomEvent<OnMergeDetail>) {
    const { firstIndex, secondIndex } = event.detail
    if (0 <= firstIndex && firstIndex < blocs.length && 0 <= secondIndex && secondIndex < blocs.length) {
      const firstBloc = page.content[firstIndex]
      const secondBloc = page.content[secondIndex]
      if (firstBloc.type === "p" && secondBloc.type === "p") {
        blocs[firstIndex].move({ type: "end" })

        const newBloc: Text = {
          type: "p",
          id: firstBloc.id,
          content: firstBloc.content + secondBloc.content
        }
        page = {
          ...page,
          content: remove(replace(page.content, firstIndex, newBloc), secondIndex)
        }
      }
      // else: ignore
    }
  }

  function submit() {
    dispatchEvent("submit", page)
  }
</script>

<div>
  <label for="title">Title</label>
  <input type="text" name="title" id="title" bind:value={page.title}/>
</div>

<div>
  <label for="key">Key (authorized characters: alphanumeric, "_" and "-")</label>
  <input type="text" name="key" id="key" bind:value={page.key} pattern="^[0-9A-Za-z_-]+$"/>
</div>

{#each page.content as bloc, index (bloc.id)}
  <BlocEdit
    bind:bloc={bloc}
    bind:this={blocs[index]}
    index={index}
    on:new={onNewBloc}
    on:move={onMove}
    on:merge={onMerge}
  />
{/each}

<button on:click={submit}>Save</button>