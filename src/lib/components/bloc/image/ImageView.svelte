<script lang="ts">
  import type { Image } from "$model/Page"

  export let bloc: Image
</script>

<style>
  figure {
    margin: 0 0 16px 0;
    padding: 0 16px;
    text-align: center;
  }

  img {
    max-width: 100%;
  }

  figcaption {
    font-style: italic;
    color: #666666;
  }
</style>

<figure data-test-id={bloc.id}>
  <img src={`/image/${bloc.key}`} alt={bloc.alt} />
  <figcaption>{bloc.caption}</figcaption>
</figure>