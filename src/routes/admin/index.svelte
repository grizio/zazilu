<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit"

  export const load: Load = async ({ fetch }) => {
    const res = await fetch("/pages.json")
    const data = await res.json()

    if (res.status === 200) {
      return { status: 200, props: { pages: data } }
    } else {
      return { status: res.status, error: new Error(data.message) }
    }
  }
</script>

<script lang="ts">
  import PrimaryButtonLink from "$lib/components/button/PrimaryButtonLink.svelte"
  import type { Page } from "$model/Page"

  export let pages: Array<Page>
</script>

<svelte:head>
  <title>Administration panel</title>
</svelte:head>

<h1>Administration panel</h1>

<ul>
  {#each pages as page}
    <li><a href={`page/${page.key}/edit`}>{page.title}</a></li>
  {/each}
</ul>

<PrimaryButtonLink href="page/new" label="Create a new page" />
