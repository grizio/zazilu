<script context="module" lang="ts">
  import type { Preload } from "@sapper/common"

  export const preload: Preload = async function() {
    const res = await this.fetch("/pages.json")
    const data = await res.json()

    if (res.status === 200) {
      return { pages: data }
    } else {
      return this.error(res.status, data.message)
    }
  }
</script>

<script lang="ts">
  import PrimaryButtonLink from "~/components/button/PrimaryButtonLink.svelte"
  import type { Page } from "../../model/Page"

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
