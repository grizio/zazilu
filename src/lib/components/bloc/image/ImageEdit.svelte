<script lang="ts">
  import { createEventDispatcher } from "svelte"

  import type { Image } from "$model/Page"
  import type { PageEditEventDispatcher } from "$lib/components/types"
  import { menuAction } from "$lib/components/page/MenuAction"

  export let bloc: Image
  export let index: number

  const dispatch = createEventDispatcher<PageEditEventDispatcher>()

  function changeSrc() {
    const src = prompt("New src", bloc.src)
    const alt = prompt("New alt", bloc.alt)
    if (src !== null) {
      dispatch("update", {
        index,
        bloc: { ...bloc, src, alt: alt ?? undefined },
      })
    }
  }

  function paste(event: ClipboardEvent) {
    const pastedContent = event.clipboardData?.getData("text/plain")
    if (pastedContent !== undefined) {
      document.execCommand("insertText", false, pastedContent)
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
  <img src={bloc.src} alt={bloc.alt} on:click={changeSrc} />
  <figcaption
    contenteditable="true"
    bind:textContent={bloc.caption}
    on:paste|preventDefault={paste}
  />
</figure>
