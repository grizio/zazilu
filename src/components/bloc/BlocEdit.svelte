<script lang="ts">
  import type { Bloc } from "../../model/Page"
  import TextEdit from "./TextEdit.svelte"
  import type { Move } from "../types"

  export let bloc: Bloc
  export let index: number

  const componentMapping = {
    p: TextEdit,
    h1: TextEdit,
    h2: TextEdit,
    h3: TextEdit,
    h4: TextEdit,
    h5: TextEdit,
    h6: TextEdit,
  }

  let element

  export function move(move: Move) {
    element?.move(move)
  }
</script>

<svelte:component
  this={componentMapping[bloc.type]}
  bind:bloc={bloc}
  index={index}
  on:new
  on:move
  on:merge
  on:replace
  bind:this={element}
/>
