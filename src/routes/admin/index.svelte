<script context="module" lang="ts">
  export async function preload() {
    const res = await this.fetch(`admin.json`)
    const data = await res.json()

    if (res.status === 200) {
      return { pages: data }
    } else {
      this.error(res.status, data.message)
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
  <li><a href={`page/edit/${page.key}`}>{page.title}</a></li>
{/each}
