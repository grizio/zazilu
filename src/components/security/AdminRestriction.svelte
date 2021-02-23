<script lang="ts">
  import { stores } from "@sapper/app"

  const { session } = stores()
</script>

{#if $session !== undefined && $session !== null && $session.role === "admin"}
  <slot/>
{/if}