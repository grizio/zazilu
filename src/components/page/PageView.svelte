<script lang="ts">
  import type { Page } from "../../model/Page"
  import BlocView from "../../components/bloc/BlocView.svelte"

  export let page: Page
</script>

<h1>{page.title}</h1>

{#each page.content as bloc}
  <BlocView bloc={bloc}/>
{/each}