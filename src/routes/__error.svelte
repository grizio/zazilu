<script context="module" lang="ts">
  import type { ErrorLoadInput } from "@sveltejs/kit/types/page"

  export function load({ error, status }: ErrorLoadInput) {
    return { props: { status, error } }
  }
</script>

<script lang="ts">
  import { dev } from "$app/env"
  import { onMount } from "svelte"

  export let status: number
  export let error: Error

  onMount(() => {
    console.error(status, error, error.stack)
  })
</script>

<style>
  h1,
  p {
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<h1>{status}</h1>

<p>{error.message}</p>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
