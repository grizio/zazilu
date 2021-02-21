<script context="module" lang="ts">
  type Params = { slug: string }

  export async function preload({ params }: { params: Params }) {
    const res = await this.fetch(`page/${params.slug}.json`)
    const data = await res.json()

    if (res.status === 200) {
      return { page: data }
    } else {
      this.error(res.status, data.message)
    }
  }
</script>

<script lang="ts">
  import type { Page } from "../../model/Page"
  import Bloc from "../../components/bloc/Bloc.svelte"

  export let page: Page
</script>

<svelte:head>
  <title>{page.title}</title>
</svelte:head>

<h1>{page.title}</h1>

{#each page.content as bloc}
  <Bloc bloc={bloc}/>
{/each}