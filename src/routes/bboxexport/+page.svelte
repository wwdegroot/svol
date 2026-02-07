<script lang="ts">
    import { MapManager, OlMapManager } from '$lib/olmap/index.js';
    import { fade } from 'svelte/transition';
    import { View } from 'ol';
    import { onMount } from 'svelte';
    import BboxExport from '$lib/bboxexport/BboxExport.svelte';
    import WidgetGroup from '$lib/mapui/group/WidgetGroup.svelte';
    import type { MapOptions } from 'ol/Map.js';
    import { twMerge } from 'tailwind-merge';
    import ChevronUp from '@lucide/svelte/icons/chevron-up';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';

    let pageMounted = $state(false);
    let mapOptions: MapOptions = $state({});
    let mapManager: MapManager | undefined = $state(undefined);
    let featureDivHeight: string = $state('h-16');
    let showFeatureDiv: boolean = $state(false);

    onMount(() => {
        let view = new View({
            center: [0, 0],
            zoom: 3
        });
        mapOptions = {
            view: view
        };

        pageMounted = true;
    });
</script>

<div class="flex flex-col h-dvh w-full">
    <div class="flex justify-center items-center content-center h-16 bg-slate-700">
        <span class="font-bold text-white">BBOX Export</span>
    </div>
    {#if pageMounted}
        <OlMapManager {mapOptions} bind:mapManager>
            <WidgetGroup position="top-right">
                <BboxExport
                    projections={[
                        { value: 'EPSG:28992', label: 'EPSG:28992' },
                        { value: 'EPSG:4326', label: 'EPSG:4326' }
                    ]}
                ></BboxExport>
            </WidgetGroup>
        </OlMapManager>
    {/if}
    <div class="flex items-center">
        <div class="flex-grow border-t border-slate-400"></div>
        <button
            class=""
            onclick={() => {
                if (!showFeatureDiv) {
                    showFeatureDiv = true;
                    featureDivHeight = 'h-64';
                } else {
                    showFeatureDiv = false;
                    featureDivHeight = 'h-16';
                }
            }}
        >
            <div class="inline-grid grid-cols-1 grid-rows-1">
                <div
                    class="transition-transform duration-300 ease-in-out {showFeatureDiv
                        ? 'rotate-180'
                        : 'rotate-0'}"
                >
                    <ChevronUp></ChevronUp>
                </div>
            </div>
        </button>

        <div class="flex-grow border-t border-slate-400"></div>
    </div>
    <div
        class={twMerge(
            'flex flex-col justify-center items-center content-center w-full',
            featureDivHeight
        )}
    >
        <span class="font-bold text-black"> Show Feature Data Here </span>
    </div>
</div>
