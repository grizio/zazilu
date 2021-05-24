<script lang="ts">
  import { onMount } from "svelte"
  import { browser } from "$app/env"
  import { imageMetadataValidator } from "$model/validation/ImageValidation"
  import { PaginatedStore } from "$lib/stores/PaginatedStore"
  import PrimaryButton from "$lib/components/button/PrimaryButton.svelte"
  import SimpleTextForm from "../form/SimpleTextForm.svelte"
  import ImageSelectorItem from "./ImageSelectorItem.svelte"
  import ImageUpload from "./ImageUpload.svelte"

  const store = new PaginatedStore("/images", imageMetadataValidator)

  let searchValue = ""

  onMount(() => {
    if (browser) {
      reload()
    }
  })

  function reload() {
    store.initialize({ filename: searchValue })
  }

  function search(event: CustomEvent<{ value: string }>) {
    searchValue = event.detail.value
    reload()
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

  <ImageUpload on:uploaded={reload} />
</section>
