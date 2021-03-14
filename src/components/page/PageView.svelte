<script lang="ts">
  import { onMount, setContext } from "svelte"
  import BlocView from "~/components/bloc/BlocView.svelte"
  import type { Page } from "~/model/Page"
  import type { PageActions } from "./PageActions"

  export let page: Page

  setContext<PageActions>("actions", {
    getKey: () => page.key,
    updatePage: (newPage: Page) => {
      page = newPage
    },
    showError: (message, ...params) => {
      console.error(message, ...params)
    }
  })
</script>

<h1>{page.title}</h1>

{#each page.content as bloc}
  <BlocView bloc={bloc}/>
{/each}