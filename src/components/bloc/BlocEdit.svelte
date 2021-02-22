<script lang="ts">
  import type { Bloc } from "../../model/Page"
  import ParagraphEdit from "./ParagraphEdit.svelte"
  import type { Move } from "../types"

  export let bloc: Bloc
  export let index: number

  let element

  export function moveTo(move: Move) {
    element?.moveTo(move)
  }
</script>

{#if bloc.type === "p"}
  <ParagraphEdit bind:bloc={bloc} index={index} on:new bind:this={element} />
{/if}