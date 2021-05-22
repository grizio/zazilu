<script lang="ts">
  import type { SvelteComponentTyped } from "svelte"
  import type { Bloc } from "$model/Page"
  import type { Move } from "$lib/components/types"
  import TextEdit from "$lib/components/bloc/text/TextEdit.svelte"
  import MeetEdit from "$lib/components/bloc/meet/MeetEdit.svelte"
  import MeetsEdit from "$lib/components/bloc/meets/MeetsEdit.svelte"
  import ImageEdit from "$lib/components/bloc/image/ImageEdit.svelte"

  export let bloc: Bloc
  export let index: number

  let element:
    | (SvelteComponentTyped & { move: (move: Move) => void })
    | undefined

  const componentMapping = {
    p: TextEdit,
    h1: TextEdit,
    h2: TextEdit,
    h3: TextEdit,
    h4: TextEdit,
    h5: TextEdit,
    h6: TextEdit,
    meet: MeetEdit,
    meets: MeetsEdit,
    img: ImageEdit,
  }

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
