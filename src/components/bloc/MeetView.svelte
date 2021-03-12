<script lang="ts">
  import { getContext } from "svelte"
  import type { Meet } from "~/model/Page"
  import { pageValidation } from "~/model/validation/PageValidation"
  import type { PageActions } from "../page/PageActions"
  import PrimaryButton from "~/components/button/PrimaryButton.svelte"

  export let bloc: Meet

  const actions = getContext<PageActions>("actions")

  async function register() {
    const name = prompt("Your name")
    const res = await fetch(`page/${actions.getKey()}/action.json`, {
      method: "POST",
      body: JSON.stringify({
        type: "meet.register",
        bloc: bloc.id,
        name,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
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

<style>
  .meet {
    border: 1px solid #666666;
    margin-bottom: 8px;
  }

  .meet .header {
    display: block;
    background-color: #333333;
    font-weight: 700;
    padding: 4px 8px;
  }

  .meet .header time {
    color: #ffffff;
  }

  .meet .content {
    padding: 8px;
  }

  /* TODO: Maybe we should have a list of tags-like items? */
  .meet ul {
    list-style-type: none;
    margin: 8px 0 0 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
  }

  .meet ul li {
    background-color: #cccccc;
    padding: 2px 8px;
    border-radius: 4px;
    margin-right: 16px;
    margin-bottom: 16px;
  }
</style>

<div class="meet">
  <div class="header">
    <time datetime={bloc.date.toISOString()}>
      {new Intl.DateTimeFormat([], { dateStyle: "full", timeStyle: "short" }).format(bloc.date)}
    </time>
  </div>
  <div class="content">
    {#if bloc.members.length > 0}
      <ul>
        {#each bloc.members as member}
          <li>{member}</li>
        {/each}
      </ul>
    {/if}

    <PrimaryButton
      label="Register"
      data-test-id="meet-member-add"
      on:click={register}
    />
  </div>
</div>
