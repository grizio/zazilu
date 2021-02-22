<script lang="ts">
  import type { Bloc } from "../../model/Page"
  import ParagraphView from "./ParagraphView.svelte"

  export let bloc: Bloc
</script>

{#if bloc.type === "p"}
  <ParagraphView bloc={bloc} />
{/if}