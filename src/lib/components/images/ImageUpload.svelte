<script lang="ts">
  import { buildUrl } from "$lib/utils/url"
  import { createEventDispatcher } from "svelte"
  import SimpleFileForm from "../form/SimpleFileForm.svelte"

  const dispatch = createEventDispatcher<{ "uploaded": undefined }>()

  type Uploading = { uploaded: number; total: number }
  let uploading: Uploading | undefined = undefined

  async function uploadImages(
    event: CustomEvent<{ value: Array<File>; clear: () => void }>,
  ): Promise<void> {
    event.detail.clear()
    uploading = { uploaded: 0, total: event.detail.value.length }
    const allUploads = event.detail.value.map(async (file) => {
      // At the time of writing, file upload is not yet supported by svelte-kit. 😞
      // This fetch is a bad way doing what is needed to be done. 🤷
      return fetch(
        buildUrl("/image", { filename: file.name, contentType: file.type }),
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
      dispatch("uploaded")
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
