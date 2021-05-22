<script lang="ts">
  import { createEventDispatcher } from "svelte"

  import PrimaryButton from "../button/PrimaryButton.svelte"
  import InputDateTime from "./InputDateTime.svelte"

  export let date: Date
  export let id: string
  export let dataTestId: string | undefined = undefined

  let editing: boolean = false

  const dispatch = createEventDispatcher<{ change: Date }>()

  function onChange(event: CustomEvent<Date>): void {
    date = event.detail
    dispatch("change", event.detail)
  }

</script>

<style>
</style>

{#if editing}
  <InputDateTime
    id={`${id}-date`}
    name={`${id}.date`}
    dataTestId={`${dataTestId}.date`}
    value={date}
    on:change={onChange}
  />
  <PrimaryButton
    label="✔️"
    on:click={() => (editing = false)}
    dataTestId={`${dataTestId}-validButton`}
  />
{:else}
  <time datetime={date.toISOString()} data-test-id={dataTestId}>
    {new Intl.DateTimeFormat([], {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date)}
  </time>
  <PrimaryButton
    label="🖊"
    on:click={() => (editing = true)}
    dataTestId={`${dataTestId}-editButton`}
  />
{/if}
