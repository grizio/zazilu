<script lang="ts">
  import { onMount } from "svelte"
  import { browser } from "$app/env"
  import { imageMetadataValidator } from "$model/validation/ImageValidation"
  import { PaginatedStore } from "$lib/stores/PaginatedStore"
  import PrimaryButton from "$lib/components/button/PrimaryButton.svelte"
  import SimpleFileForm from "../form/SimpleFileForm.svelte"
  import SimpleTextForm from "../form/SimpleTextForm.svelte"
import ImageSelectorItem from "./ImageSelectorItem.svelte";

  const store = new PaginatedStore("/images", imageMetadataValidator)

  let searchValue = ""

  type Uploading = { uploaded: number; total: number }
  let uploading: Uploading | undefined = undefined

  onMount(() => {
    if (browser) {
      store.initialize({ filename: searchValue })
    }
  })

  async function uploadImages(
    event: CustomEvent<{ value: Array<File>; clear: () => void }>,
  ): Promise<void> {
    event.detail.clear()
    uploading = { uploaded: 0, total: event.detail.value.length }
    const allUploads = event.detail.value.map(async (file) => {
      // At the time of writing, file upload is not yet supported by svelte-kit. 😞
      // This fetch is a bad way doing what is needed to be done. 🤷
      return fetch(
        `/image?filename=${encodeURIComponent(
          file.name,
        )}&contentType=${encodeURIComponent(file.type)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: await readFileAsBase64(file),
        },
      ).then(() => {
        uploading =
          uploading === undefined
            ? undefined
            : { ...uploading, uploaded: uploading.uploaded + 1 }
      })
    })
    Promise.all(allUploads).then(() => {
      uploading = undefined
      store.initialize({ filename: searchValue })
    })
  }

  function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // You will have something like data:image/png;base64,iVBORw0KGgoAAAA…
        // We only need the part after the comma
        const result = reader.result as string
        const indexOfComma = result.indexOf(",")
        const base64 = result.substr(indexOfComma + 1)
        resolve(base64)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  function search(event: CustomEvent<{ value: string }>) {
    store.initialize({ filename: event.detail.value })
  }

</script>

<style>
  section {
    box-shadow: 0 0 2px #aaaaaa;
    padding: 8px;
  }

  .elements {
    max-height: 50vh;
    overflow: auto;
  }

  .grid {
    margin: 16px 0;
    display: grid;
    grid-template-columns: repeat(5, calc(20% - 16px));
    gap: 16px;
  }

  .more {
    text-align: center;
  }

</style>

<section>
  <SimpleTextForm
    id="image-selector-search"
    label="Search (press Enter to validate)"
    name="search"
    submitLabel="Search"
    required={false}
    on:submit={search}
  />

  <div class="elements">
    <div class="grid">
      {#each $store.elements as image}
        <ImageSelectorItem image={image} />
      {/each}
    </div>

    <div class="more">
      <PrimaryButton
        label="More"
        disabled={$store.next === undefined}
        on:click={store.loadNext}
      />

      {#if $store.next === undefined && $store.elements.length !== 0 && !$store.loading}
        <p>
          No more images to load. Change your search criteria or upload a new
          image.
        </p>
      {/if}
    </div>
  </div>

  <p>You do not find the image of your choice? Upload it:</p>

  <SimpleFileForm
    id="image-selector-upload"
    label="Select an image"
    accept="image/*"
    multiple
    name="image"
    submitLabel="Upload"
    on:submit={uploadImages}
  />

  {#if uploading !== undefined}
    <progress min="0" max={uploading.total} value={uploading.uploaded}>
      {uploading.uploaded} / {uploading.total}
    </progress>
  {/if}
</section>
