<script lang="ts">
  import type { Bloc } from "../../model/Page"
  import ParagraphEdit from "./ParagraphEdit.svelte"
  import type { Move } from "../types"

  export let bloc: Bloc
  export let index: number

  let element

  export function move(move: Move) {
    element?.move(move)
  }
</script>

{#if bloc.type === "p"}
  <ParagraphEdit
    bind:bloc={bloc}
    index={index}
    on:new
    on:move
    on:merge
    bind:this={element}
  />
{/if}