<script lang="ts">
  import type { Text } from "../../model/Page"

  export let bloc: Text
</script>

{#if bloc.type === "p"}
  <p data-test-id={bloc.id}>{bloc.content}</p>
{:else if bloc.type === "h1"}
  <h1 data-test-id={bloc.id}>{bloc.content}</h1>
{:else if bloc.type === "h2"}
  <h2 data-test-id={bloc.id}>{bloc.content}</h2>
{:else if bloc.type === "h3"}
  <h3 data-test-id={bloc.id}>{bloc.content}</h3>
{:else if bloc.type === "h4"}
  <h4 data-test-id={bloc.id}>{bloc.content}</h4>
{:else if bloc.type === "h5"}
  <h5 data-test-id={bloc.id}>{bloc.content}</h5>
{:else}
  <h6 data-test-id={bloc.id}>{bloc.content}</h6>
{/if}