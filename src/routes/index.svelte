<script context="module" lang="ts">
  import type { Preload } from "@sapper/common"
  import { pageValidation } from "~/model/validation/PageValidation"
  import PrimaryButtonLink from "~/components/button/PrimaryButtonLink.svelte"

  export const preload: Preload = async function () {
    const res = await this.fetch(`page/home.json`)
    const data = await res.json()

    if (res.status === 200) {
      const formattedData = pageValidation.validate(data)
      if (formattedData.ok) {
        return { page: formattedData.value }
      } else if (formattedData.ok === false) {
        return this.error(res.status, formattedData.errors.toString())
      }
    } else {
      return this.error(res.status, data.message)
    }
  }
</script>

<script lang="ts">
  import type { Page } from "~/model/Page"
  import PageView from "~/components/page/PageView.svelte"
  import AdminRestriction from "~/components/security/AdminRestriction.svelte"

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
