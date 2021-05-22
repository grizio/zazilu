<script lang="ts">
  import { getContext } from "svelte"
  import type { Meets } from "$model/Page"
  import { pageValidation } from "$model/validation/PageValidation"
  import type { PageActions } from "$lib/components/page/PageActions"
  import TagList from "$lib/components/tag/TagList.svelte"
  import SimpleTextForm from "$lib/components/form/SimpleTextForm.svelte"

  export let bloc: Meets

  const actions = getContext<PageActions>("actions")

  let selection: Record<string, boolean> = {}

  async function register(
    event: CustomEvent<{ value: string; clear: () => void }>,
  ) {
    const res = await fetch(`page/${actions.getKey()}/action.json`, {
      method: "POST",
      body: JSON.stringify({
        type: "meets.register",
        bloc: bloc.id,
        meets: Object.keys(selection).filter((key) => selection[key] === true),
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
        selection = {}
      } else if (bodyResult.ok === false) {
        actions.showError("Invalid body result", bodyResult.errors)
      }
    }
  }

</script>

<style>
  .meets {
    display: grid;
    gap: 16px;
    grid-template-columns: auto auto 1fr;
  }

  .header {
    font-weight: bold;
  }

  .form {
    grid-column-start: 1;
    grid-column-end: 3;
  }

</style>

<div class="meets">
  <div class="header">Date</div>
  <div class="header">Register</div>
  <div class="header">Participants</div>

  {#each bloc.meets as meet}
    <label for={`meets-${bloc.id}-meet-${meet.id}`}>
      <time datetime={meet.date.toISOString()}>
        {new Intl.DateTimeFormat([], {
          dateStyle: "full",
          timeStyle: "short",
        }).format(meet.date)}
      </time>
    </label>
    <input
      type="checkbox"
      id={`meets-${bloc.id}-meet-${meet.id}`}
      form={`meets-${bloc.id}`}
      bind:checked={selection[meet.id]}
    />
    <TagList tags={meet.members} />
  {/each}

  <div class="form">
    <SimpleTextForm
      label="Your name"
      id={`meets-${bloc.id}-register`}
      name="name"
      submitLabel="Register"
      formName={`meets-${bloc.id}`}
      on:submit={register}
    />
  </div>
</div>
