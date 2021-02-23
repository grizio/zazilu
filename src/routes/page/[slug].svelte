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
  import PageView from "../../components/page/PageView.svelte"
  import AdminRestriction from "../../components/security/AdminRestriction.svelte"

  export let page: Page
</script>

<svelte:head>
  <title>{page.title}</title>
</svelte:head>

<PageView page={page} />

<AdminRestriction>
  <a href={`/page/edit/${page.key}`}>Edit</a>
</AdminRestriction>