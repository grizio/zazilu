<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import type { Meet } from "$model/Page"
  import type { PageEditEventDispatcher } from "$lib/components/types"
  import { menuAction } from "$lib/components/page/MenuAction"
  import TagList from "$lib/components/tag/TagList.svelte"
  import EditableDate from "$lib/components/form/EditableDate.svelte"

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
    <EditableDate date={bloc.date} id={bloc.id} dataTestId={bloc.id} on:change={onChange} />
  </div>

  <div class="content">
    {#if bloc.members.length > 0}
      <TagList tags={bloc.members} />
    {:else}
      <p class="info">No people currently registered</p>
    {/if}
  </div>
</div>
