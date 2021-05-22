<script lang="ts">
  import { createEventDispatcher, onMount, tick } from "svelte"
  import type { Page, Text } from "$model/Page"
  import { isText } from "$model/Page"
  import BlocEdit from "$lib/components/bloc/bloc/BlocEdit.svelte"
  import PrimaryButton from "$lib/components/button/PrimaryButton.svelte"
  import { insert, remove, replace } from "$lib/utils/arrays"
  import type {
    BlocEditComponent,
    OnMergeDetail,
    OnMoveDetail,
    OnNewDetail,
    OnTransformDetail,
    OnUpdateDetail,
  } from "$lib/components/types"
  import { withGeneratedId } from "$lib/components/types"
  import Menu from "./Menu.svelte"
  import { transformBloc } from "$lib/components/bloc/bloc/BlocTransformer";

  export let page: Page
  let blocs: Array<BlocEditComponent> = []

  const dispatchEvent = createEventDispatcher()

  onMount(() => {
    page = normalize(page)
  })

  function onNewBloc(event: CustomEvent<OnNewDetail>) {
    const { index, bloc, moveTo } = event.detail
    page = normalize({
      ...page,
      content: insert(page.content, index, withGeneratedId(bloc)),
    })
    if (moveTo !== undefined) {
      setTimeout(() => blocs[index].move(moveTo), 0)
    }
  }

  function onMove(event: CustomEvent<OnMoveDetail>) {
    const { index, move } = event.detail
    if (
      0 <= index &&
      index < blocs.length &&
      blocs[index] !== undefined &&
      blocs[index] !== null
    ) {
      setTimeout(() => blocs[index].move(move))
    }
  }

  async function onMerge(event: CustomEvent<OnMergeDetail>) {
    const { firstIndex, secondIndex, move } = event.detail
    if (
      0 <= firstIndex &&
      firstIndex < blocs.length &&
      0 <= secondIndex &&
      secondIndex < blocs.length
    ) {
      const firstBloc = page.content[firstIndex]
      const secondBloc = page.content[secondIndex]
      if (isText(firstBloc) && isText(secondBloc)) {
        const newBloc: Text = {
          type: firstBloc.type,
          id: firstBloc.id,
          content: [...firstBloc.content, ...secondBloc.content],
        }
        page = normalize({
          ...page,
          content: remove(
            replace(page.content, firstIndex, newBloc),
            secondIndex,
          ),
        })
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
      page = normalize({
        ...page,
        content: replace(page.content, index, bloc),
      })
    }
  }

  function normalize(page: Page): Page {
    if (
      page.content.length === 0 ||
      !isText(page.content[page.content.length - 1])
    ) {
      return {
        ...page,
        content: [...page.content, withGeneratedId({ type: "p", content: [] })],
      }
    } else {
      return page
    }
  }

  function transform(event: CustomEvent<OnTransformDetail>) {
    const { index, type } = event.detail
    if (0 <= index && index < page.content.length) {
      page = normalize({
        ...page,
        content: replace(page.content, index, transformBloc(page.content[index], type)),
      })
    }
  }

  function submit() {
    dispatchEvent("submit", page)
  }
</script>

<form on:submit|preventDefault={submit}>
  <label for="title">Title</label>
  <input type="text" name="title" id="title" bind:value={page.title} class="input-component" />

  <label for="key">Key (authorized characters: alphanumeric, "_" and "-")</label
  >
  <input
    type="text"
    name="key"
    id="key"
    bind:value={page.key}
    pattern="^[0-9A-Za-z_-]+$"
    class="input-component"
  />

  {#each page.content as bloc, index (bloc.id)}
    <BlocEdit
      bind:bloc
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

<Menu on:transform={transform} />
