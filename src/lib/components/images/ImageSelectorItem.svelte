<script lang="ts">
  import type { ImageMetadata } from "$model/Image"
import PrimaryButton from "../button/PrimaryButton.svelte"
  import SimpleTextForm from "../form/SimpleTextForm.svelte"
  import type { SimpleTextFormSubmitEvent } from "../form/types"

  export let image: ImageMetadata

  let editingName: boolean = false

  async function submitNameEdition(event: SimpleTextFormSubmitEvent) {
    await fetch(`/image/${image.key}/rename`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ filename: event.detail.value }),
    })
    event.detail.clear()
    image.filename = event.detail.value
    editingName = false
  }

</script>

<style>
  figure {
    margin: 0;
    padding: 8px;
    cursor: pointer;
    transition: box-shadow ease-in-out 250ms;
    text-align: center;
  }

  figure:hover {
    box-shadow: 0 0 5px #aaaaaa;
  }

  img {
    max-width: 100%;
    max-height: 300px;
  }
</style>

<figure>
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
      {image.filename} <PrimaryButton label="🖊" size="small" on:click={() => (editingName = true)} />
    {/if}
  </figcaption>
</figure>
