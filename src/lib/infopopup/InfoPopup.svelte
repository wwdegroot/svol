<script lang="ts">
    import { MapManager, MAPMANAGER_KEY } from '$lib/olmap/index.js';
    import { getContext, onDestroy, onMount, type Snippet } from 'svelte';
    import Overlay from 'ol/Overlay.js';
    import { twMerge } from 'tailwind-merge';
    import type { MapBrowserEvent } from 'ol';
    import type { FeatureLike } from 'ol/Feature.js';
    import FeatureInfoTable from './FeatureInfoTable.svelte';
    import type { Layer } from 'ol/layer.js';
    import type { SelectedFeature } from './types.js';
    import X from '@lucide/svelte/icons/x';

    const mapManager: MapManager = getContext(MAPMANAGER_KEY);

    interface Props {
        title?: string;
        class?: string;
        displayFieldConfig: Record<string, Record<string, string>>;
        featurePropertiesTable?: Snippet<
            [SelectedFeature[] | undefined, Record<string, Record<string, string>> | {}]
        >;
    }
    let {
        title = 'Feature Properties',
        class: ClassValue = 'bg-white p-2 rounded shadow',
        featurePropertiesTable,
        displayFieldConfig = {}
    }: Props = $props();

    let popUpContainer: HTMLDivElement;
    let popUpOverlay: Overlay;

    let selectedFeatures: SelectedFeature[] = $state([]);

    function popupInfo(event: MapBrowserEvent) {
        const coord = event.coordinate;
        selectedFeatures = [];
        mapManager.map.forEachFeatureAtPixel(event.pixel, (feature: FeatureLike, layer: Layer) => {
            const layerId = layer.get('layerId');
            const layerTitle = layer.get('title');
            if (layerId && layerTitle) {
                selectedFeatures.push({
                    layerId,
                    layerTitle,
                    feature
                });
            }
        });
        if (selectedFeatures.length > 0) {
            popUpOverlay.setPosition(coord);
        } else {
            popUpOverlay.setPosition(undefined);
        }
    }

    function closePopupInfo(event: MouseEvent | undefined) {
        event?.preventDefault();
        event?.stopPropagation();
        selectedFeatures = [];
        popUpOverlay.setPosition(undefined);
    }

    onMount(() => {
        popUpOverlay = new Overlay({
            element: popUpContainer,
            autoPan: {
                animation: {
                    duration: 250
                }
            }
        });
        mapManager.map.addOverlay(popUpOverlay);

        mapManager.map.on('singleclick', popupInfo);
    });

    onDestroy(() => {
        mapManager.map.un('singleclick', popupInfo);
        mapManager.map.removeOverlay(popUpOverlay);
    });
</script>

<div bind:this={popUpContainer} class={twMerge('flex flex-col', ClassValue)}>
    <div class="flex justify-end items-end gap-2 mb-2">
        <div class="mr-auto font-bold items-center">{title}</div>
        <button class=" bg-red-300 rounded" onclick={(event) => closePopupInfo(event)}><X /></button
        >
    </div>
    {#if featurePropertiesTable}
        {@render featurePropertiesTable(selectedFeatures, displayFieldConfig)}
    {:else}
        <FeatureInfoTable features={selectedFeatures} {displayFieldConfig}></FeatureInfoTable>
    {/if}
</div>
