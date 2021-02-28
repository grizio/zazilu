<script context="module" lang="ts">
  import type { Preload } from "@sapper/common"
  import { pageValidation } from "~/model/validation/PageValidation"

  export const preload: Preload = async function ({ params }) {
    const res = await this.fetch(`page/${params.slug}.json`)
    const data = await res.json()

    if (res.status === 200) {
      const formattedData = pageValidation.validate(data)
      if (formattedData.ok) {
        return { initialPage: formattedData.value }
      } else if (formattedData.ok === false) {
        return this.error(res.status, formattedData.errors.toString())
      }
    } else {
      return this.error(res.status, data.message)
    }
  }
</script>

<script lang="ts">
  import { onMount } from "svelte"
  import type { Page } from "~/model/Page"
  import PageForm from "~/components/page/PageForm.svelte"
  import { goto } from "@sapper/app"

  export let initialPage: Page
  let page: Page | undefined = undefined

  onMount(() => {
    page = initialPage
  })

  async function submit(event: CustomEvent<Page>) {
    const res = await fetch(`page/${event.detail.key}.json`, {
      method: "PUT",
      body: JSON.stringify(event.detail),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    if (res.status === 200) {
      await goto(`/page/${event.detail.key}`)
    }
  }

  async function remove() {
    const confirmed = confirm("Do you really want to delete this page?")
    if (confirmed) {
      const res = await fetch(`page/${initialPage.key}.json`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json"
        }
      })
      if (res.status === 204) {
        await goto("/")
      }
      // TODO: error management
    }
  }
</script>

<svelte:head>
  <title>Edit: {page?.title}</title>
</svelte:head>

<h1>Edit page</h1>

{#if page !== undefined}
  <PageForm page={page} on:submit={submit}/>
{/if}

{#if initialPage.key !== "home"}
  <button on:click={remove}>Remove</button>
{/if}