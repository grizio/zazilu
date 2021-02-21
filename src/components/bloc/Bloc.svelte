<script lang="ts">
  import type { Bloc } from "../../model/Page"
  import Paragraph from "./Paragraph.svelte"

  export let bloc: Bloc
</script>

{#if bloc.type === "p"}
  <Paragraph bloc={bloc} />
{/if}