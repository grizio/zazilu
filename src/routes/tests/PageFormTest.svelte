<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit"
  import { allPages } from "./PageFormTest"
  import type { Page } from "$lib/model/Page"

  export const load: Load = ({ page }) => {
    const q = page.query.get("q") ?? "initialPage"
    return {
      status: 200,
      props: {
        page: (allPages as Record<string, Page>)[q] ?? allPages.initialPage
      }
    }
  }
</script>

<script lang="ts">
  import PageForm from "$lib/components/page/PageForm.svelte"

  export let page: Page
</script>

<h1>Test: <code>PageForm</code></h1>

{#if page !== undefined}
  <PageForm page={page} on:submit={(event) => console.log(event.detail)} />
{/if}
