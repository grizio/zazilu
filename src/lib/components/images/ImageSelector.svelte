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
  .image-selector {
    display: flex;
    flex-direction: column;
    max-height: 100%;
  }

  .header {
    padding-bottom: 8px;
  }

  .elements {
    flex-grow: 1;
    flex-shrink: 1;
    overflow: auto;
  }

  .grid {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(5, calc(20% - 16px));
    gap: 16px;
  }

  .more {
    text-align: center;
  }

  .footer {
    padding-top: 8px;
  }

</style>

<div class="image-selector">
  <div class="header">
    <SimpleTextForm
      id="image-selector-search"
      label="Search (press Enter to validate)"
      name="search"
      submitLabel="Search"
      required={false}
      on:submit={search}
    />
  </div>

  <div class="elements">
    <div class="grid">
      {#each $store.elements as image}
        <ImageSelectorItem image={image} on:select />
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

  <div class="footer">
    <ImageUpload on:uploaded={reload} />
  </div>
</div>
