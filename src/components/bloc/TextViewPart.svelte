<script lang="ts">
  import type { TextPart } from "../../model/Page"

  export let part: TextPart
</script>

{#if part.type === "text"}
  {part.content}
{:else if part.type === "strong"}
  <strong>
    {#each part.content as subpart}
      <svelte:self part={subpart}/>
    {/each}
  </strong>
{:else if part.type === "em"}
  <em>
    {#each part.content as subpart}
      <svelte:self part={subpart}/>
    {/each}
  </em>
{:else if part.type === "link"}
  <a href={part.link}>
    {#each part.content as subpart}
      <svelte:self part={subpart}/>
    {/each}
  </a>
{/if}