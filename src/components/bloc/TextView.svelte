<script lang="ts">
  import type { Text } from "../../model/Page"

  export let bloc: Text
</script>

{#if bloc.type === "p"}
  <p>{bloc.content}</p>
{:else if bloc.type === "h1"}
  <h1>{bloc.content}</h1>
{:else if bloc.type === "h2"}
  <h2>{bloc.content}</h2>
{:else if bloc.type === "h3"}
  <h3>{bloc.content}</h3>
{:else if bloc.type === "h4"}
  <h4>{bloc.content}</h4>
{:else if bloc.type === "h5"}
  <h5>{bloc.content}</h5>
{:else}
  <h6>{bloc.content}</h6>
{/if}