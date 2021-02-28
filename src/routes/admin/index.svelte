<script context="module" lang="ts">
  import type { Preload } from "@sapper/common"

  export const preload: Preload = async function() {
    const res = await this.fetch(`admin.json`)
    const data = await res.json()

    if (res.status === 200) {
      return { pages: data }
    } else {
      return this.error(res.status, data.message)
    }
  }
</script>

<script lang="ts">
  import type { Page } from "../../model/Page"

  export let pages: Array<Page>
</script>

<svelte:head>
  <title>Administration panel</title>
</svelte:head>

<h1>Administration panel</h1>

{#each pages as page}
  <li><a href={`page/${page.key}/edit`}>{page.title}</a></li>
{/each}

<a href="page/new">Create a new page</a>
