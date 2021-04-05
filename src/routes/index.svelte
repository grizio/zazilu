<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit"
  import { pageValidation } from "$lib/model/validation/PageValidation"
  import PrimaryButtonLink from "$lib/components/button/PrimaryButtonLink.svelte"

  export const load: Load = async ({ fetch }) => {
    const res = await fetch(`page/home.json`)
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

<style>
  .actions {
    margin-top: 16px;
  }
</style>

<svelte:head>
  <title>{page.title}</title>
</svelte:head>

<PageView page={page} />

<AdminRestriction>
  <div class="actions">
    <PrimaryButtonLink href={`/page/${page.key}/edit`} label="Edit" />
  </div>
</AdminRestriction>
