<script context="module" lang="ts">
	// Needed to avoid unexpected warning
	export const preload = () => ({})
</script>

<script lang="ts">
	import Nav from "~/components/Nav.svelte"

	export let segment: string;
</script>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>