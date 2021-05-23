<script lang="ts">
  import { array, string } from "idonttrustlikethat"
  import { onMount } from "svelte"
  import { browser } from "$app/env"
  import SimpleFileForm from "../form/SimpleFileForm.svelte"

  let imagesPromise: Promise<Array<string>> = Promise.resolve([])

  type Uploading = { uploaded: number; total: number }
  let uploading: Uploading | undefined = undefined

  onMount(() => reloadImages())

  function reloadImages() {
    imagesPromise = loadImages()
  }

  async function loadImages(): Promise<Array<string>> {
    if (browser) {
      const response = await fetch("/images")
      const json = await response.json()
      const validation = array(string).validate(json)
      if (validation.ok) {
        return validation.value
      } else {
        throw new Error(JSON.stringify(validation.errors))
      }
    } else {
      return Promise.resolve([])
    }
  }

  async function uploadImages(
    event: CustomEvent<{ value: Array<File>; clear: () => void }>,
  ): Promise<void> {
    event.detail.clear()
    uploading = { uploaded: 0, total: event.detail.value.length }
    const allUploads = event.detail.value.map(async (file) => {
      // At the time of writing, file upload is not yet supported by svelte-kit. 😞
      // This fetch is a bad way doing what is needed to be done. 🤷
      return fetch(
        `/image?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`,
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
      reloadImages()
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

</script>

<style>
  section {
    box-shadow: 0 0 2px #aaaaaa;
    padding: 8px;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 16px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: box-shadow ease-in-out 250ms;
  }

  li:hover {
    box-shadow: 0 0 5px #aaaaaa;
  }

  img {
    max-width: 100%;
    max-height: 300px;
  }

</style>

<section>
  <SimpleFileForm
    id="image-selector"
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

  {#await imagesPromise then images}
    <ul>
      {#each images as image}
        <li><img src={`/image/${image}`} alt={image} /></li>
      {/each}
    </ul>
  {/await}
</section>
