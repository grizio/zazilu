<script lang="ts">
  export let label: string
  export let href: string
  export let dataTestId: string | undefined = undefined
</script>

<a href={href} class="primary" data-test-id={dataTestId} on:click>{label}</a>