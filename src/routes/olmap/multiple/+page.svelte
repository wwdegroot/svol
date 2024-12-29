<script lang="ts">
	import { OpenlayersMap, createMap } from '$lib/olmap/index.js';
	import { Map, View } from 'ol';
	import { onMount } from 'svelte';
	import TileLayer from 'ol/layer/Tile.js';
	import OSM from 'ol/source/OSM.js';
	import { useGeographic } from 'ol/proj.js';

	let mapStore: Map = $state()!;
	let mapStore2: Map = $state()!;
	let mapStore3: Map = $state()!;
	let mapStore4: Map = $state()!;
	let mapStores: Map[] = $state([]);

	let pageMounted = $state(false);

	onMount(() => {
		useGeographic();
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

		let view2 = new View({
			center: [12, 52],
			zoom: 4
		});
		mapStore2 = createMap({
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
		mapStore3 = createMap({
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
		mapStore4 = createMap({
			layers: [
				new TileLayer({
					source: new OSM()
				})
			],
			view: view4
		});
		mapStores = [mapStore, mapStore2, mapStore3, mapStore4];
		$inspect(mapStores);
		pageMounted = true;
	});
</script>

<div class="h-full w-full p-2">
	<div class="flex items-center justify-center">
		<div class="grid grid-cols-2 gap-2 h-full">
			{#if pageMounted}
				{#each mapStores as mapStore, i}
					<div class="h-full col-span-1 min-h-80 min-w-64">
						<div
							class="flex justify-center items-center content-center h-[10%] bg-slate-700 rounded-t-md"
						>
							<span class="font-bold text-white">Map {i + 1}</span>
						</div>

						<OpenlayersMap map={mapStore} class="h-[80%]" autoResize={false}></OpenlayersMap>

						<div class="w-full h-[10%] bg-slate-700 rounded-b-md"></div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
