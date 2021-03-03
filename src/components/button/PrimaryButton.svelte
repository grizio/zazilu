<script lang="ts">
  export let label: string
  export let dataTestId: string | undefined = undefined
</script>

<button class="primary" data-test-id={dataTestId} on:click>{label}</button>