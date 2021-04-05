<script lang="ts">
  import type { Text } from "$lib/model/Page"
  import TextViewPart from "./TextViewPart.svelte"

  export let bloc: Text
</script>

{#if bloc.type === "p"}
  <p data-test-id={bloc.id}>
    {#each bloc.content as part}
      <TextViewPart part={part} />
    {/each}
  </p>
{:else if bloc.type === "h1"}
  <h1 data-test-id={bloc.id}>
    {#each bloc.content as part}
      <TextViewPart part={part} />
    {/each}
  </h1>
{:else if bloc.type === "h2"}
  <h2 data-test-id={bloc.id}>
    {#each bloc.content as part}
      <TextViewPart part={part} />
    {/each}
  </h2>
{:else if bloc.type === "h3"}
  <h3 data-test-id={bloc.id}>
    {#each bloc.content as part}
      <TextViewPart part={part} />
    {/each}
  </h3>
{:else if bloc.type === "h4"}
  <h4 data-test-id={bloc.id}>
    {#each bloc.content as part}
      <TextViewPart part={part} />
    {/each}
  </h4>
{:else if bloc.type === "h5"}
  <h5 data-test-id={bloc.id}>
    {#each bloc.content as part}
      <TextViewPart part={part} />
    {/each}
  </h5>
{:else}
  <h6 data-test-id={bloc.id}>
    {#each bloc.content as part}
      <TextViewPart part={part} />
    {/each}
  </h6>
{/if}