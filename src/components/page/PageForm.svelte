<script lang="ts">
  import { createEventDispatcher, tick } from "svelte"
  import type { Page, Text } from "~/model/Page"
  import { isText } from "~/model/Page"
  import BlocEdit from "~/components/bloc/BlocEdit.svelte"
  import PrimaryButton from "~/components/button/PrimaryButton.svelte"
  import { insert, remove, replace } from "~/utils/arrays"
  import type { BlocEditComponent, OnMergeDetail, OnMoveDetail, OnNewDetail, OnUpdateDetail } from "~/components/types"
  import { withGeneratedId } from "~/components/types"

  export let page: Page
  let blocs: Array<BlocEditComponent> = []

  const dispatchEvent = createEventDispatcher()

  function onNewBloc(event: CustomEvent<OnNewDetail>) {
    const { index, bloc, moveTo } = event.detail
    page = {
      ...page,
      content: insert(page.content, index, withGeneratedId(bloc))
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

  async function onMerge(event: CustomEvent<OnMergeDetail>) {
    const { firstIndex, secondIndex, move } = event.detail
    if (0 <= firstIndex && firstIndex < blocs.length && 0 <= secondIndex && secondIndex < blocs.length) {
      const firstBloc = page.content[firstIndex]
      const secondBloc = page.content[secondIndex]
      if (isText(firstBloc) && isText(secondBloc)) {
        const newBloc: Text = {
          type: firstBloc.type,
          id: firstBloc.id,
          content: [...firstBloc.content, ...secondBloc.content]
        }
        page = {
          ...page,
          content: remove(replace(page.content, firstIndex, newBloc), secondIndex)
        }
        if (move) {
          await tick()
          blocs[firstIndex].move(move)
        }
      }
      // else: ignore
    }
  }

  function onUpdate(event: CustomEvent<OnUpdateDetail>) {
    const { index, bloc } = event.detail
    if (0 <= index && index < page.content.length) {
      page = {
        ...page,
        content: replace(page.content, index, bloc)
      }
    }
  }

  function submit() {
    dispatchEvent("submit", page)
  }
</script>

<form on:submit|preventDefault={submit}>
  <label for="title">Title</label>
  <input type="text" name="title" id="title" bind:value={page.title}/>

  <label for="key">Key (authorized characters: alphanumeric, "_" and "-")</label>
  <input type="text" name="key" id="key" bind:value={page.key} pattern="^[0-9A-Za-z_-]+$"/>

  {#each page.content as bloc, index (bloc.id)}
    <BlocEdit
      bind:bloc={bloc}
      bind:this={blocs[index]}
      index={index}
      on:new={onNewBloc}
      on:move={onMove}
      on:merge={onMerge}
      on:update={onUpdate}
    />
  {/each}

  <PrimaryButton label="Save" dataTestId="pageForm-submit" />
</form>