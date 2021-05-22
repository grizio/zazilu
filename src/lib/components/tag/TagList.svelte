<script lang="ts">
  import Tag from "./Tag.svelte"

  export let tags: Array<string>

</script>

<style>
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
  }

  li {
    margin-right: 16px;
  }

</style>

<ul>
  {#each tags as tag}
    <li><Tag label={tag} /></li>
  {/each}
</ul>
