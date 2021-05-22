<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import type { Meet } from "$model/Page"
  import InputDateTime from "$lib/components/form/InputDateTime.svelte"
  import type { PageEditEventDispatcher } from "$lib/components/types"
  import PrimaryButton from "$lib/components/button/PrimaryButton.svelte"
  import { menuAction } from "$lib/components/page/MenuAction"
import TagList from "$lib/components/tag/TagList.svelte"

  export let bloc: Meet
  export let index: number

  let editingDate: boolean = false

  const dispatch = createEventDispatcher<PageEditEventDispatcher>()

  function onChange(event: CustomEvent<Date>) {
    dispatch("update", {
      index,
      bloc: {
        ...bloc,
        date: event.detail,
      },
    })
  }
</script>

<style>
  .meet {
    border: 1px solid #666666;
    margin-bottom: 16px;
  }

  .meet .header {
    background-color: #333333;
    font-weight: 700;
    padding: 4px 8px;
  }

  .meet .header:not(.edit) {
    display: block;
  }

  .meet .header.edit {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 40px;
    gap: 16px;
  }

  .meet .header {
    color: #ffffff;
  }

  .meet .content {
    padding: 8px;
  }

  .info {
    font-style: italic;
    font-weight: 400;
  }
</style>

<div class="meet" data-test-id={bloc.id} use:menuAction={index}>
  <div class="header" class:edit={editingDate}>
    {#if editingDate}
      <InputDateTime
        id={`${bloc.id}-date`}
        name={`${bloc.id}.date`}
        dataTestId={`${bloc.id}.date`}
        value={bloc.date}
        on:change={onChange}
      />
      <PrimaryButton label="✔️" on:click={() => (editingDate = false)} dataTestId={`${bloc.id}-validButton`} />
    {:else}
      <time datetime={bloc.date.toISOString()}>
        {new Intl.DateTimeFormat([], { dateStyle: "full", timeStyle: "short" }).format(bloc.date)}
      </time>
      <PrimaryButton label="🖊" on:click={() => (editingDate = true)} dataTestId={`${bloc.id}-editButton`} />
    {/if}
  </div>

  <div class="content">
    {#if bloc.members.length > 0}
      <TagList tags={bloc.members} />
    {:else}
      <p class="info">No people currently registered</p>
    {/if}
  </div>
</div>
