<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit"
  import { pageValidation } from "$model/validation/PageValidation"

  export const load: Load = async function ({ page, fetch }) {
    const res = await fetch(`/page/${page.params.slug}.json`)
    const data = await res.json()

    if (res.status === 200) {
      const formattedData = pageValidation.validate(data)
      if (formattedData.ok) {
        return { status: 200, props: { initialPage: formattedData.value } }
      } else {
        return {
          status: res.status,
          error: new Error(formattedData.errors.toString()),
        }
      }
    } else {
      return { status: res.status, error: new Error(data.message) }
    }
  }
</script>

<script lang="ts">
  import { onMount } from "svelte"
  import type { Page } from "$model/Page"
  import PageForm from "$lib/components/page/PageForm.svelte"
  import { goto } from "$app/navigation"

  export let initialPage: Page
  let page: Page | undefined = undefined

  onMount(() => {
    page = initialPage
  })

  async function submit(event: CustomEvent<Page>) {
    const res = await fetch(`/page/${event.detail.key}.json`, {
      method: "PUT",
      body: JSON.stringify(event.detail),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    if (res.status === 200) {
      if (event.detail.key === "home") {
        await goto("/")
      } else {
        await goto(`/page/${event.detail.key}`)
      }
    }
  }

  async function remove() {
    const confirmed = confirm("Do you really want to delete this page?")
    if (confirmed) {
      const res = await fetch(`/page/${initialPage.key}.json`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
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
  <PageForm page={page} on:submit={submit} />
{/if}

{#if initialPage.key !== "home"}
  <button on:click={remove}>Remove</button>
{/if}
