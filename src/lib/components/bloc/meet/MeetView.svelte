<script lang="ts">
  import { getContext } from "svelte"
  import type { Meet } from "$model/Page"
  import { pageValidation } from "$model/validation/PageValidation"
  import type { PageActions } from "$lib/components/page/PageActions"
  import TagList from "$lib/components/tag/TagList.svelte"
  import SimpleTextForm from "$lib/components/form/SimpleTextForm.svelte"

  export let bloc: Meet

  const actions = getContext<PageActions>("actions")

  async function register(event: CustomEvent<{ value: string, clear: () => void }>) {
    const res = await fetch(`page/${actions.getKey()}/action.json`, {
      method: "POST",
      body: JSON.stringify({
        type: "meet.register",
        bloc: bloc.id,
        name: event.detail.value,
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
        event.detail.clear()
      } else if (bodyResult.ok === false) {
        actions.showError("Invalid body result", bodyResult.errors)
      }
    }
  }
</script>

<style>
  .meet {
    border: 1px solid #666666;
    margin-bottom: 16px;
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
</style>

<div class="meet">
  <div class="header">
    <time datetime={bloc.date.toISOString()}>
      {new Intl.DateTimeFormat([], { dateStyle: "full", timeStyle: "short" }).format(bloc.date)}
    </time>
  </div>
  <div class="content">
    {#if bloc.members.length > 0}
      <TagList tags={bloc.members} />
    {/if}

    <SimpleTextForm
      label="Specify your name to register"
      name="register"
      id={`meet-${bloc.id}-register`}
      submitLabel="Register"
      on:submit={register}
    />
  </div>
</div>
