<script lang="ts">
  export let label: string
  export let dataTestId: string | undefined = undefined
  export let disabled: boolean = false
</script>

<button class="primary" data-test-id={dataTestId} disabled={disabled} on:click>{label}</button>