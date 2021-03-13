<script context="module" lang="ts">
  import type { Preload } from "@sapper/common"
  import { allPages } from "./PageFormTest"
  import type { Page } from "~/model/Page"

  export const preload: Preload = ({ query }) => {
    const q =
      query.q !== undefined
        ? Array.isArray(query.q)
          ? query.q[0]
          : query.q
        : "initialPage"
    return {
      page: (allPages as Record<string, Page>)[q] ?? allPages.initialPage,
    }
  }
</script>

<script lang="ts">
  import PageForm from "~/components/page/PageForm.svelte"

  export let page: Page
</script>

<h1>Test: <code>PageForm</code></h1>

{#if page !== undefined}
  <PageForm page={page} on:submit={(event) => console.log(event.detail)} />
{/if}
