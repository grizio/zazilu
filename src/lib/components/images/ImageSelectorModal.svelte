<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import type { ImageMetadata } from "$model/Image"
  import Modal from "../Modal.svelte"
  import ImageSelector from "./ImageSelector.svelte"

  const dispatch = createEventDispatcher<{ close: ImageMetadata | undefined }>()

  function onselect(event: CustomEvent<ImageMetadata>) {
    dispatch("close", event.detail)
  }

</script>

<Modal on:close>
  <ImageSelector on:select={onselect} />
</Modal>
