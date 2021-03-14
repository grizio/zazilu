<script lang="ts">
  import type { SvelteComponentTyped } from "svelte"
  import type { Bloc } from "~/model/Page"
  import type { Move } from "~/components/types"
  import TextEdit from "~/components/bloc/text/TextEdit.svelte"
  import MeetEdit from "~/components/bloc/meet/MeetEdit.svelte"
  import ImageEdit from "~/components/bloc/image/ImageEdit.svelte"

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
