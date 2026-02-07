<script lang="ts">
    import { getContext, onDestroy, onMount, type Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';
    import type MapBrowserEvent from 'ol/MapBrowserEvent.js';
    import type { FeatureLike } from 'ol/Feature.js';
    import type { LayerField, LayerFieldsMap } from './identifyFeaturesTypes.js';
    import type { MapManager } from '$lib/olmap/openlayersmap.svelte.js';
    import { MAPMANAGER_KEY } from '$lib/olmap/index.js';

    interface Props {
        resultDivClasses?: string;
        children?: Snippet<[FeatureLike]>;
        hitTolerance?: number;
        layerIds?: string[];
        layerFields?: LayerFieldsMap;
    }
    let {
        resultDivClasses = '',
        children,
        hitTolerance = 0,
        layerIds = [],
        layerFields
    }: Props = $props();

    let mapManager: MapManager = getContext(MAPMANAGER_KEY);
    let identifyResults = $state<FeatureLike[]>([]);
    let showResults = $state(false);

    function identifyMapFeatures(event: MapBrowserEvent<MouseEvent>) {
        identifyResults = [];
        let features: FeatureLike[] = mapManager.map.getFeaturesAtPixel(event.pixel, {
            layerFilter: (layer) => {
                if (layerIds.includes(layer.get('layerId')) || layerIds.length === 0) {
                    return true;
                }
                return false;
            },
            hitTolerance: hitTolerance
        });
        features = features.map((f) => filterAndRenameObjectProperties(f, layerFields));

        showResults = true;
        identifyResults = [...features];
    }

    function filterAndRenameObjectProperties(
        feature: FeatureLike,
        layerFieldsMap?: LayerFieldsMap
    ): FeatureLike {
        // No filtering needed return as is.
        if (!layerFieldsMap) {
            return feature;
        }
        const newObj: Record<string, any> = {};
        const properties = feature.getProperties();
        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                // Important: Check own properties
                let foundField: LayerField | undefined;

                // Iterate through the map's values (LayerFields objects)
                for (const layerFields of layerFieldsMap.values()) {
                    foundField = layerFields.fields.find((field) => field.name === key);
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
        feature.setProperties(newObj);

        return feature;
    }

    function formatPropValues(value: any): string {
        switch (typeof value) {
            case 'object':
                return JSON.stringify(value);
            default:
                return String(value);
        }
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
        mapManager.map.on('click', identifyMapFeatures);
    });

    onDestroy(() => {
        mapManager.map.un('click', identifyMapFeatures);
    });
</script>

{#snippet feature(feature: FeatureLike)}
    <div class="grid grid-cols-1 overflow-y-auto py-2">
        {#each Object.entries(feature.getProperties()) as [key, value]}
            {#if key !== 'geometry'}
                <div class="grid grid-cols-6 max-w-96">
                    <div class="col-span-2">{key}:</div>
                    <div class="col-span-4">{formatPropValues(value)}</div>
                </div>
            {/if}
        {/each}
    </div>
{/snippet}

{#if identifyResults.length > 0 && showResults}
    <div
        class={twMerge(
            'bg-white rounded-md grid grid-cols max-w-96 max-h-52 overflow-y-auto',
            resultDivClasses
        )}
    >
        <div class="flex">
            <div class="pl-2 w-full font-bold">Identify Results</div>
            <div class="flex justify-end w-full">
                <button class="pr-2" onclick={() => (showResults = false)}>X</button>
            </div>
        </div>
        {#if children}
            <div>
                {#each identifyResults as result}
                    {@render children(result)}
                {/each}
            </div>
        {:else}
            <div class="flex flex-col bg-white p-2 divide-y-2">
                {#each identifyResults as result}
                    {@render feature(result)}
                {/each}
            </div>
        {/if}
    </div>
{/if}
