<script lang="ts">
	import { OpenlayersMap, createMap } from '$lib/olmap/index.js';
	import { Map, View } from 'ol';
	import { onMount } from 'svelte';
	import TileLayer from 'ol/layer/Tile.js';
	import OSM from 'ol/source/OSM.js';

	let mapStore: Map = $state<Map>()!;

	let pageMounted = $state(false);
	onMount(() => {
		let view = new View({
			center: [0, 0],
			zoom: 3
		});
		mapStore = createMap({
			layers: [
				new TileLayer({
					source: new OSM()
				})
			],
			view: view
		});

		pageMounted = true;
	});
</script>

<div class="h-full w-full">
	<div class="flex justify-center items-center content-center h-16 bg-slate-700">
		<span class="font-bold text-white">Header</span>
	</div>
	{#if pageMounted}
		<OpenlayersMap map={mapStore} class="w-full h-dvh" autoResize={true}></OpenlayersMap>
	{/if}

	<div class="flex justify-center items-center content-center w-full h-16 bg-slate-700">
		<span class="font-bold text-white">Footer</span>
	</div>
</div>
