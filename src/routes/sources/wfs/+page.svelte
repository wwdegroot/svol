<script lang="ts">
	import { ResizableOpenlayersMap, createMap } from '$lib/olmap/index.js';
	import { Map, View } from 'ol';
	import { onMount } from 'svelte';
	import WidgetGroup from '$lib/mapui/group/WidgetGroup.svelte';
	import { brtStandaard } from '$lib/baselayers.js';
	import { rdnewprojection } from '$lib/projection.js';
	import { WFSSource } from '$lib/olmap/sources/index.js';
	import { Circle, Fill, Stroke, Style } from 'ol/style.js';
	import type { StyleLike } from 'ol/style/Style.js';
	import { LayerControl } from '$lib/layercontrol/index.js';
	import type { FlatStyleLike } from 'ol/style/flat.js';
	import IdentifyFeatures from '$lib/identify/IdentifyFeatures.svelte';

	let mapStore: Map = $state()!;
	let pageMounted = $state(false);

	let wfsStyle = new Style({
		image: new Circle({
			radius: 6,
			fill: new Fill({
				color: [255, 120, 0, 1]
			}),
			stroke: new Stroke({
				color: [0, 0, 0, 1],
				width: 1.5
			})
		}),
		zIndex: Infinity
	});
	let restWarmteId: string = $state(crypto.randomUUID())
	let wfsSourceConfig: {
		url: string;
		title: string;
		crs: string;
		featuretypes: string[];
		strategy: 'bbox' | 'tile';
		style: StyleLike;
	} = {
		url: 'https://service.pdok.nl/rvo/restwarmte/wfs/v1_0',
		title: 'Restwarmte',
		crs: 'EPSG:28992',
		featuretypes: ['restwarmte:liggingindustrieco2'],
		strategy: 'bbox',
		style: wfsStyle
	};
	
	let wfsSourceConfigCBS: {
		url: string;
		title: string;
		crs: string;
		featuretypes: string[];
		strategy: 'bbox' | 'tile';
		style: StyleLike | FlatStyleLike;
		filter: string | undefined;
	} = {
		url: 'https://service.pdok.nl/cbs/bevolkingskernen/2021/wfs/v1_0',
		title: 'CBS Bevolkingskernen 2021',
		crs: 'EPSG:28992',
		featuretypes: ['bevolkingskernen:bevolkingskernen'],
		strategy: 'bbox',
		style: [
			{
				filter: ['>', ['get', 'aantalInwoners'], 100_000],
				style: {
					'stroke-color': 'red',
					'stroke-width': 6,
					'text-value': ['concat', ['get', 'naam2021'], ', ', ['get', 'provincie']],
					'text-font': '32px sans-serif',
					'text-fill-color': 'black',
					'text-stroke-color': 'gray',
					'text-stroke-width': 2
				}
			}
		],
		filter:
			'<PropertyIsGreaterThan><PropertyName>aantalInwoners</PropertyName><Literal>100000</Literal></PropertyIsGreaterThan>'
	};

	onMount(() => {
		let view = new View({
			center: [142735.75, 470715.91],
			zoom: 10,
			projection: rdnewprojection
		});
		mapStore = createMap({
			layers: [brtStandaard],
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
						<span class="font-semibold text-white">WFS Source</span>
					</div>
				{/snippet}
				{#snippet map()}
					<WFSSource bind:layerId={restWarmteId} {...wfsSourceConfig} />
					<WFSSource {...wfsSourceConfigCBS} />
					<WidgetGroup position="top-right">
						<div class=" bg-white shadow-xl rounded-sm border-2 border-slate-300 border-solid">
							<LayerControl />
						</div>
						<IdentifyFeatures layerIds={[restWarmteId]} ></IdentifyFeatures>
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
