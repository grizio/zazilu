<script lang="ts">
  export let type: "error"
</script>

<p class={`panel ${type}`}>
  <slot />
</p>