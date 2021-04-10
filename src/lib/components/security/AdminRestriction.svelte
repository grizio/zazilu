<script lang="ts">
  import { session } from "$app/stores"
</script>

{#if $session?.authenticatedUser?.role === "admin"}
  <slot/>
{/if}