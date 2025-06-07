<script lang="ts">
	import { ResizableOpenlayersMap, createMap } from '$lib/olmap/index.js';
	import { Map, View } from 'ol';
	import { onMount } from 'svelte';
	import TileLayer from 'ol/layer/Tile.js';
	import OSM from 'ol/source/OSM.js';

	let mapStore: Map = $state()!;
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
	<div class="h-full">
		{#if pageMounted}
			<ResizableOpenlayersMap {mapStore} resizable={true} headerPane={true} dataPane={true}>
				{#snippet header()}
					<div class="h-full bg-slate-700 flex items-center justify-center shadow-sm border-collapse">
						<span class="font-semibold text-white">Header</span>
					</div>
				{/snippet}
				{#snippet data()}
					<div class="flex h-full items-center justify-center p-6">
						<span class="font-semibold">Show Feature Data Here</span>
					</div>
				{/snippet}
			</ResizableOpenlayersMap>
		{/if}
	</div>
</div>
