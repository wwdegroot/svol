<script lang="ts">
	import { getContext, onDestroy, onMount, type Snippet } from 'svelte';
	import Map from 'ol/Map.js';
	import type MapBrowserEvent from 'ol/MapBrowserEvent.js';
	import type { FeatureLike } from 'ol/Feature.js';
	import type { LayerField, LayerFieldsMap } from './identifyFeaturesTypes.js';


	interface Props {
		children: Snippet<[FeatureLike]>;
		hitTolerance?: number;
		layerIds?: string[];
		layerFields?: LayerFieldsMap;
	}
	let { children, hitTolerance = 0, layerIds = [], layerFields }: Props = $props();

	let map: Map = $state(getContext('olmap'));
	let identifyResults = $state<FeatureLike[]>([]);

	function identifyMapFeatures(event: MapBrowserEvent<MouseEvent>) {
		identifyResults = [];
		let features: FeatureLike[] = map.getFeaturesAtPixel(
			event.pixel,
			{
				layerFilter: (layer) => {
					if (layerIds.includes(layer.get('layerId')) || layerIds.length === 0) {
						return true
					} else {
						return false
					}
				},
				hitTolerance: hitTolerance,
			}
		);
		console.log(features)
		features = features.map((f) => filterAndRenameObjectProperties(f, layerFields))

		identifyResults = [...features]
	}

	function filterAndRenameObjectProperties(
		feature: FeatureLike, // Input object with string keys and any values
		layerFieldsMap?: LayerFieldsMap // The map of LayerFields
	): FeatureLike {
		console.log(feature)
		// No filtering needed return as is.
		if (!layerFieldsMap) {
			return feature
		}
		const newObj: Record<string, any> = {};
		const properties = feature.getProperties();
		for (const key in properties) {
			if (properties.hasOwnProperty(key)) {  // Important: Check own properties
				let foundField: LayerField | undefined;

				// Iterate through the map's values (LayerFields objects)
				for (const layerFields of layerFieldsMap.values()) {
					foundField = layerFields.fields.find(field => field.name === key);
					if (foundField) break; // Exit inner loop once found
				}

				if (foundField) {
					newObj[foundField.alias] = properties[key];
				} else {
					// Option 1: Exclude unmatched properties (current behavior)
					// Option 2: Keep unmatched properties as-is (uncomment below)
					// newObj[key] = obj[key]; 
				}
			}
		}
		feature.setProperties(newObj)

		return feature;
	}
	// check if we need to alias or remove properties
	// function filterLayerFields(features: FeatureLike[]): FeatureLike[] {
		
	// 	features = features.map((f) => {
	// 		let properties = Object.entries(f.getProperties()).map(
	// 			([key, value]) => {

	// 			}

	// 		);
	// 		properties.
	// 	});
	// 	return features
	// }

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
	{#if children}
		<div>
			{#each identifyResults as result}
				{@render children(result)}
			{/each}
			
		</div>
	{:else}
		<div class="flex flex-col bg-white p-2 max-h-52">
			{#each identifyResults as result}
				{@render feature(result)}
			{/each}
		</div>
	{/if}

{/if}
