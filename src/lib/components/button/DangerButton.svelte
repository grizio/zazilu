<script lang="ts">
  export let label: string
  export let dataTestId: string | undefined = undefined
  export let disabled: boolean = false
  export let size: "small" | "medium" = "medium"

</script>

<button
  class="danger"
  class:small={size === "small"}
  data-test-id={dataTestId}
  disabled={disabled}
  on:click
>
  {label}
</button>
