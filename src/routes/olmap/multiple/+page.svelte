<script lang="ts">
	import { OpenlayersMap, createMapStore } from '$lib/olmap/index.js';
	import { Map, View } from 'ol';
	import { onMount } from 'svelte';
	import { type Writable } from 'svelte/store';
	import TileLayer from 'ol/layer/Tile.js';
	import OSM from 'ol/source/OSM.js';
	import { useGeographic } from 'ol/proj.js';

	let mapStore: Writable<Map>;
	let mapStore2: Writable<Map>;
	let mapStore3: Writable<Map>;
	let mapStore4: Writable<Map>;
	let mapStores: Writable<Map>[];

	let pageMounted = false;

	onMount(() => {
		useGeographic();
		let view = new View({
			center: [0, 0],
			zoom: 3
		});
		mapStore = createMapStore({
			layers: [
				new TileLayer({
					source: new OSM()
				})
			],
			view: view
		});

		let view2 = new View({
			center: [12, 52],
			zoom: 4
		});
		mapStore2 = createMapStore({
			layers: [
				new TileLayer({
					source: new OSM()
				})
			],
			view: view2
		});

		let view3 = new View({
			center: [112, 32],
			zoom: 4
		});
		mapStore3 = createMapStore({
			layers: [
				new TileLayer({
					source: new OSM()
				})
			],
			view: view3
		});

		let view4 = new View({
			center: [250, 32],
			zoom: 4
		});
		mapStore4 = createMapStore({
			layers: [
				new TileLayer({
					source: new OSM()
				})
			],
			view: view4
		});
		mapStores = [mapStore, mapStore2, mapStore3, mapStore4];
		console.log(mapStores);
		pageMounted = true;
	});
</script>

<div class="h-full w-full max-w-screen-md p-2">
	<div class="grid grid-cols-2 gap-2 h-full">
		{#if pageMounted}
			{#each mapStores as mapStore, i}
				<div class="h-full col-span-1 min-h-80">
					<div
						class="flex justify-center items-center content-center h-[10%] bg-slate-700 rounded-t-md"
					>
						<span class="font-bold text-white">Map {i + 1}</span>
					</div>

					<OpenlayersMap {mapStore} class="h-[80%]" autoResize={false}></OpenlayersMap>

					<div class="w-full h-[10%] bg-slate-700 rounded-b-md"></div>
				</div>
			{/each}
		{/if}
	</div>
</div>
