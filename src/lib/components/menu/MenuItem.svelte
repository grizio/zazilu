<script lang="ts">
  export let label: string
  export let dataTestId: string | undefined = undefined
</script>

<style>
  li {
    width: 150px;
    position: relative;
    padding: 4px 4px;
    cursor: default;
  }

  li[role=button] {
    cursor: pointer;
  }

  li:not(:last-of-type) {
    border-bottom: 1px solid #999999;
  }

  li:hover {
    background-color: #cccccc;
  }

  li ul {
    visibility: hidden;
    list-style-type: none;
    position: absolute;
    top: -1px;
    left: 100%;
    margin: 0;
    padding: 0;
    background-color: #ffffff;
    border: 1px solid #999999;
    box-shadow: 0 2px 5px rgba(102, 102, 102, 0.5);
  }

  li:hover ul {
    visibility: visible;
  }
</style>

{#if $$slots.default === undefined}
  <li role="button" data-test-id={dataTestId} on:click>{label}</li>
{:else}
  <li data-test-id={dataTestId}>
    {label}
    <ul>
      <slot/>
    </ul>
  </li>
{/if}
