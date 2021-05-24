<script lang="ts">
  import type { ImageMetadata } from "$model/Image"
  import { createEventDispatcher } from "svelte"
  import PrimaryButton from "../button/PrimaryButton.svelte"
  import SimpleTextForm from "../form/SimpleTextForm.svelte"
  import type { SimpleTextFormSubmitEvent } from "../form/types"

  export let image: ImageMetadata

  let editingName: boolean = false

  const dispatch = createEventDispatcher<{ select: ImageMetadata }>()

  async function submitNameEdition(event: SimpleTextFormSubmitEvent) {
    await fetch(`/image/${image.key}/rename`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename: event.detail.value }),
    })
    event.detail.clear()
    image.filename = event.detail.value
    editingName = false
  }

  function select() {
    dispatch("select", image)
  }

</script>

<style>
  figure {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0;
    padding: 8px;
    transition: box-shadow ease-in-out 250ms;
    text-align: center;
  }

  figure:hover {
    box-shadow: 0 0 5px #aaaaaa;
  }

  img {
    max-width: 100%;
    max-height: 300px;
    margin-top: 16px;
  }

  figcaption {
    margin-top: 8px;
  }

</style>

<figure>
  <PrimaryButton label="Select" on:click={select} />

  <img src={`/image/${image.key}`} alt={image.filename} />
  <figcaption>
    {#if editingName}
      <SimpleTextForm
        label="File name"
        name="filename"
        id={`image-edit-name-${image.key}`}
        submitLabel="✔️"
        value={image.filename}
        on:submit={submitNameEdition}
      />
    {:else}
      {image.filename}
      <PrimaryButton
        label="🖊"
        size="small"
        on:click={() => (editingName = true)}
      />
    {/if}
  </figcaption>
</figure>
