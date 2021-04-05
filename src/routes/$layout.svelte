<script lang="ts">
  import { page } from "$app/stores"
  import Nav from "$lib/components/Nav.svelte"

	$: segment = $page.path.substring($page.path.lastIndexOf("/") + 1)
</script>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>

<Nav segment={segment} />

<main>
  <slot />
</main>
