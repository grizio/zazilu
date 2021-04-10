<script lang="ts">
  import { session } from "$app/stores"
</script>

{#if $session?.authenticatedUser === undefined}
  <slot/>
{/if}