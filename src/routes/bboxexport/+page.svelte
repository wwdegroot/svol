<script lang="ts">
	import { ResizableOpenlayersMap, createMap } from '$lib/olmap/index.js';
	import Expand from '$lib/mapui/menu/Expand.svelte';
	import { Map, View } from 'ol';
	import { onMount } from 'svelte';
	import TileLayer from 'ol/layer/Tile.js';
	import OSM from 'ol/source/OSM.js';
	import BboxExport from '$lib/bboxexport/BboxExport.svelte';
	import WidgetGroup from '$lib/mapui/group/WidgetGroup.svelte';

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
	<div class="h-[100%]">
		{#if pageMounted}
			<ResizableOpenlayersMap
				{mapStore}
				resizable={true}
				mapSize={60}
				headerSize={5}
				dataSize={35}
				headerPane={true}
				dataPane={false}
			>
				{#snippet header()}
					<div class="h-full bg-slate-700 flex items-center justify-center shadow border-collapse">
						<span class="font-semibold text-white">BBOX export</span>
					</div>
				{/snippet}
				{#snippet map()}
					<WidgetGroup position="top-right">
						<BboxExport projections={[{ value: 'EPSG:28992', label: 'EPSG:28992' }, { value: 'EPSG:4326', label: 'EPSG:4326' }]}></BboxExport>
					</WidgetGroup>
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
