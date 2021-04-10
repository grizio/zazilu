<script lang="ts">
  import type { Bloc } from "$model/Page"
  import TextView from "../text/TextView.svelte"
  import MeetView from "../meet/MeetView.svelte"
  import ImageView from "../image/ImageView.svelte"

  export let bloc: Bloc

  const componentMapping = {
    p: TextView,
    h1: TextView,
    h2: TextView,
    h3: TextView,
    h4: TextView,
    h5: TextView,
    h6: TextView,
    meet: MeetView,
    img: ImageView,
  }
</script>

<svelte:component this={componentMapping[bloc.type]} bloc={bloc} />