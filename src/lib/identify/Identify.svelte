<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import Map from 'ol/Map.js';
	import type MapBrowserEvent from 'ol/MapBrowserEvent.js';
	import type { FeatureLike } from 'ol/Feature.js';

	interface Props {
		layerIds?: string[];
	}
	let { layerIds }: Props = $props();

	let map: Map = $state(getContext('olmap'));
	let identifyResults = $state<FeatureLike[]>([]);

	function identifyMapFeatures(event: MapBrowserEvent<MouseEvent>) {
		identifyResults = [];
		let features: FeatureLike[] = map.getFeaturesAtPixel(event.pixel);
		identifyResults = [...features];
		console.log(identifyResults);
	}

	onMount(() => {
		map.on('click', (e: MapBrowserEvent<MouseEvent>) => identifyMapFeatures(e));
	});

	onDestroy(() => {
		map.un('click', identifyMapFeatures);
	});
</script>

{#snippet feature(feature: FeatureLike)}
	<div class="grid grid-cols-1 overflow-y-auto">
		{#each Object.entries(feature.getProperties()) as [key, value]}
			<div class="grid grid-cols-6">
				<div class="col-span-2">{key}:</div>
				<div class="col-span-4">{value}</div>
			</div>
		{/each}
	</div>
{/snippet}

{#if identifyResults.length > 0}
	<div class="flex flex-col bg-white p-2 max-h-52">
		{#each identifyResults as result}
			{@render feature(result)}
		{/each}
	</div>
{/if}
