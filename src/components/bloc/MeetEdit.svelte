<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import type { Meet } from "../../model/Page"
  import InputDateTime from "../form/InputDateTime.svelte"
  import type { PageEditEventDispatcher } from "../types"

  export let bloc: Meet
  export let index: number

  const dispatch = createEventDispatcher<PageEditEventDispatcher>()

  function onChange(event: CustomEvent<Date>) {
    dispatch("update", {
      index,
      bloc: {
        ...bloc,
        date: event.detail
      }
    })
  }
</script>

<div data-test-id={bloc.id}>
  <InputDateTime
    id={`${bloc.id}-date`}
    name={`${bloc.id}.date`}
    dataTestId={`${bloc.id}.date`}
    value={bloc.date}
    on:change={onChange}
  />
</div>