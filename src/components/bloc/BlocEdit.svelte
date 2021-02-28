<script lang="ts">
  import type { SvelteComponentTyped } from "svelte"
  import type { Bloc } from "../../model/Page"
  import TextEdit from "./TextEdit.svelte"
  import MeetEdit from "./MeetEdit.svelte"
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
    meet: MeetEdit,
  }

  let element: SvelteComponentTyped & { move: (move: Move) => void } | undefined

  export function move(move: Move) {
    element?.move(move)
  }
</script>

<svelte:component
  this={componentMapping[bloc.type]}
  bloc={bloc}
  index={index}
  on:new
  on:move
  on:merge
  on:replace
  on:update
  bind:this={element}
/>
