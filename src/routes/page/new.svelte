<script lang="ts">
  import type { Page } from "$model/Page"
  import PageForm from "$lib/components/page/PageForm.svelte"
  import { generateId } from "$lib/utils/strings"
  import { goto } from "$app/navigation"

  let page: Page = {
    key: "",
    content: [{ type: "p", id: generateId(), content: [{ type: "text", content: "" }] }],
    title: ""
  }

  async function submit(event: CustomEvent<Page>) {
    const res = await fetch(`/page/${event.detail.key}.json`, {
      method: "POST",
      body: JSON.stringify(event.detail),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    if (res.status === 201) {
      await goto(`/page/${event.detail.key}`)
    }
  }
</script>

<svelte:head>
  <title>Create a new page</title>
</svelte:head>

<h1>Create a new page</h1>

<PageForm page={page} on:submit={submit}/>