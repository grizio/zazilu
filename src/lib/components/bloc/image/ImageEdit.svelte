<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import type { Image } from "$model/Page"
  import type { ImageMetadata } from "$model/Image"
  import type { PageEditEventDispatcher } from "$lib/components/types"
  import { menuAction } from "$lib/components/page/MenuAction"
  import ImageSelectorModal from "$lib/components/images/ImageSelectorModal.svelte"

  export let bloc: Image
  export let index: number

  let selectImage = false

  const dispatch = createEventDispatcher<PageEditEventDispatcher>()

  function paste(event: ClipboardEvent) {
    const pastedContent = event.clipboardData?.getData("text/plain")
    if (pastedContent !== undefined) {
      document.execCommand("insertText", false, pastedContent)
    }
  }

  function select(event: CustomEvent<ImageMetadata | undefined>) {
    selectImage = false

    if (event.detail !== undefined) {
      dispatch("update", {
        index,
        bloc: { ...bloc, key: event.detail.key, alt: event.detail.filename },
      })
    }
  }
</script>

<style>
  figure {
    margin: 0 0 16px 0;
    padding: 0 16px;
    text-align: center;
  }

  img {
    max-width: 100%;
    cursor: pointer;
  }

  figcaption {
    font-style: italic;
    color: #666666;
  }
</style>

<figure data-test-id={bloc.id} use:menuAction={index}>
  <img src={bloc.key !== "" ? `/image/${bloc.key}` : "/noimg.svg"} alt={bloc.alt} on:click={() => {selectImage = true}} />
  <figcaption
    contenteditable="true"
    bind:textContent={bloc.caption}
    on:paste|preventDefault={paste}
  />
</figure>

{#if selectImage}
  <ImageSelectorModal on:close={select} />
{/if}