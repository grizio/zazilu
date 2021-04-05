<script lang="ts">
  export let label: string
  export let value: string
  export let id: string
  export let name: string
  export let dataTestId: string | undefined
</script>

<label for={id}>{label}</label>
<input
  type="text"
  name={name}
  id={id}
  data-test-id={dataTestId}
  bind:value={value}
/>
