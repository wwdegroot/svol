<script lang="ts">
    import { MapManager, MAPMANAGER_KEY } from '$lib/olmap/index.js';
    import { getContext, onDestroy, onMount } from 'svelte';
    import Overlay from 'ol/Overlay.js';
    import { twMerge } from 'tailwind-merge';
    import type { MapBrowserEvent } from 'ol';
    import type { FeatureLike } from 'ol/Feature.js';
    import FeatureInfoTable from './FeatureInfoTable.svelte';

    const mapManager: MapManager = getContext(MAPMANAGER_KEY);

    interface Props {
        title?: string;
        class?: string;
    }
    let { title = 'Feature Properties', class: ClassValue = 'bg-white p-2 rounded shadow' }: Props =
        $props();

    let popUpContainer: HTMLDivElement;
    let popUpOverlay: Overlay;

    let selectedFeatures: FeatureLike[] = $state([]);

    function popupInfo(event: MapBrowserEvent) {
        const coord = event.coordinate;
        selectedFeatures = mapManager.map.getFeaturesAtPixel(event.pixel);
        if (selectedFeatures.length > 0) {
            popUpOverlay.setPosition(coord);
        } else {
            popUpOverlay.setPosition(undefined);
        }
    }

    function closePopupInfo(event: MouseEvent | undefined) {
        event?.preventDefault();
        event?.stopPropagation();
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
    <div class="flex justify-end items-end gap-2">
        <div class="mr-auto font-bold">{title}</div>
        <button onclick={(event) => closePopupInfo(event)}>X</button>
    </div>
    <FeatureInfoTable features={selectedFeatures}></FeatureInfoTable>
</div>
