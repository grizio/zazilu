<script lang="ts">
  import PageForm from "../../components/page/PageForm.svelte"
  import { initialPage } from "./PageFormTest"

  let page = initialPage
</script>

<h1>Test: <code>PageForm</code></h1>

{#if page !== undefined}
  <PageForm page={page} on:submit={console.log} />
{/if}