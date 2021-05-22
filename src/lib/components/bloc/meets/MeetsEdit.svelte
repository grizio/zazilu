<script lang="ts">
  import type { Meet, Meets } from "$model/Page"
  import TagList from "$lib/components/tag/TagList.svelte"
  import SimpleTextForm from "$lib/components/form/SimpleTextForm.svelte"
  import { menuAction } from "$lib/components/page/MenuAction"
  import EditableDate from "$lib/components/form/EditableDate.svelte"
  import DangerButton from "$lib/components/button/DangerButton.svelte"
  import { createEventDispatcher } from "svelte"
  import type { PageEditEventDispatcher } from "$lib/components/types"
  import PrimaryButton from "$lib/components/button/PrimaryButton.svelte"
  import { generateId } from "$lib/utils/strings"

  export let bloc: Meets
  export let index: number

  const dispatch = createEventDispatcher<PageEditEventDispatcher>()

  export function deleteMeet(event: MouseEvent, id: string) {
    event.preventDefault()
    dispatch("update", {
      index,
      bloc: {
        ...bloc,
        meets: bloc.meets.filter((meet) => meet.id !== id),
      },
    })
  }

  export function addMeet(event: MouseEvent) {
    event.preventDefault()

    const newMeet: Meet = {
      type: "meet",
      id: generateId(),
      date: new Date(),
      members: [],
    }
    dispatch("update", {
      index,
      bloc: {
        ...bloc,
        meets: [...bloc.meets, newMeet],
      },
    })
  }

</script>

<style>
  .meets {
    display: grid;
    gap: 16px;
    grid-template-columns: auto auto 1fr auto;
  }

  .header {
    font-weight: bold;
  }

  .form {
    grid-column-start: 1;
    grid-column-end: 3;
  }

</style>

<div class="meets" data-test-id={bloc.id} use:menuAction={index}>
  <div class="header">Date</div>
  <div class="header">Register</div>
  <div class="header">Participants</div>
  <div class="header" />

  {#each bloc.meets as meet, index}
    <div>
      <EditableDate bind:date={meet.date} id={meet.id} dataTestId={`${bloc.id}-meet-${index}-date`} />
    </div>
    <input
      type="checkbox"
      id={`${bloc.id}-meet-${index}-select`}
      form={`meets-${bloc.id}`}
      disabled
    />
    <TagList tags={meet.members} />
    <DangerButton
      label="Delete"
      on:click={(event) => deleteMeet(event, meet.id)}
      dataTestId={`${bloc.id}-meet-${index}-delete`}
    />
  {/each}

  <div class="form">
    <SimpleTextForm
      label="Your name"
      id={`meets-${bloc.id}-register`}
      name="name"
      submitLabel="Register"
      formName={`meets-${bloc.id}`}
      disabled
    />
  </div>
  <div />
  <PrimaryButton label="Add" on:click={addMeet} dataTestId={`${bloc.id}-add`} />
</div>
