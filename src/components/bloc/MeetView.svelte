<script lang="ts">
  import { getContext } from "svelte"
  import type { Meet } from "~/model/Page"
  import { pageValidation } from "../../model/validation/PageValidation"
  import type { PageActions } from "../page/PageActions"

  export let bloc: Meet

  const actions = getContext<PageActions>("actions")

  async function register() {
    const name = prompt("Your name")
    const res = await fetch(`page/${actions.getKey()}/action.json`, {
      method: "POST",
      body: JSON.stringify({
        type: "meet.register",
        bloc: bloc.id,
        name
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    if (res.status === 200) {
      const body = await res.json()
      const bodyResult = pageValidation.validate(body)
      if (bodyResult.ok) {
        actions.updatePage(bodyResult.value)
      } else if (bodyResult.ok === false) {
        actions.showError("Invalid body result", bodyResult.errors)
      }
    }
  }
</script>

<div>
  <time datetime={bloc.date.toISOString()}>{new Intl.DateTimeFormat([], {dateStyle: "full"}).format(bloc.date)}</time>
  {#if bloc.members.length > 0}
    <ul>
      {#each bloc.members as member}
        <li>{member}</li>
      {/each}
    </ul>
  {/if}
  <button data-test-id="meet-member-add" on:click={register}>Register</button>
</div>

