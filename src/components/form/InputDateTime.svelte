<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { datePart, timePart, toDate } from "~/utils/dates"

  export let dateLabel: string = "Date"
  export let timeLabel: string = "Time"
  export let value: Date
  export let id: string
  export let name: string
  export let dataTestId: string | undefined

  const dispatch = createEventDispatcher()

  function onDateChange(event: Event): void {
    dispatch("change", toDate((event.target as HTMLInputElement).value, timePart(value)))
  }

  function onTimeChange(event: Event): void {
    dispatch("change", toDate(datePart(value), (event.target as HTMLInputElement).value))
  }
</script>

<label for={`${id}-date`}>{dateLabel}</label>
<input
  type="date"
  name={`${name}.date`}
  id={`${id}-date`}
  data-test-id={`${dataTestId}-date`}
  value={datePart(value)}
  on:change={onDateChange}
/>

<label for={`${id}-time`}>{timeLabel}</label>
<input
  type="time"
  name={`${name}.time`}
  id={`${id}-time`}
  data-test-id={`${dataTestId}-time`}
  value={timePart(value)}
  on:change={onTimeChange}
/>