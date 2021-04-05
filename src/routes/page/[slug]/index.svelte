<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit"
  import { pageValidation } from "$lib/model/validation/PageValidation"

  export const load: Load = async function ({ fetch, page }) {
    const res = await fetch(`/page/${page.params.slug}.json`)
    const data = await res.json()

    if (res.status === 200) {
      const formattedData = pageValidation.validate(data)
      if (formattedData.ok) {
        return { status: 200, props: { page: formattedData.value } }
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
  import type { Page } from "$lib/model/Page"
  import PageView from "$lib/components/page/PageView.svelte"
  import AdminRestriction from "$lib/security/AdminRestriction.svelte"

  export let page: Page
</script>

<svelte:head>
  <title>{page.title}</title>
</svelte:head>

<PageView page={page} />

<AdminRestriction>
  <a href={`/page/${page.key}/edit`}>Edit</a>
</AdminRestriction>
