<script lang="ts">
    import { MapManager, OpenlayersMap } from '$lib/index.js';
    import { View } from 'ol';
    import { onMount } from 'svelte';
    import WidgetGroup from '$lib/mapui/group/WidgetGroup.svelte';
    import { brtStandaard } from '$lib/baselayers.js';
    import { rdnewprojection } from '$lib/projection.js';
    import { WFSSource } from '$lib/olmap/sources/index.js';
    import { LayerControl } from '$lib/layercontrol/index.js';
    import IdentifyFeatures from '$lib/identify/IdentifyFeatures.svelte';
    import type { MapOptions } from 'ol/Map.js';
    import ChevronUp from '@lucide/svelte/icons/chevron-up';
    import { twMerge } from 'tailwind-merge';
    import { wfsSourceConfig, wfsSourceConfigCBS } from './services.js';

    let pageMounted = $state(false);
    let mapOptions: MapOptions = $state({});
    let mapManager: MapManager | undefined = $state(undefined);
    let featureDivHeight: string = $state('h-16');
    let showFeatureDiv: boolean = $state(false);
    let restWarmteId: string = $state(crypto.randomUUID());

    onMount(() => {
        let view = new View({
            center: [142735.75, 470715.91],
            zoom: 10,
            projection: rdnewprojection
        });

        mapOptions = {
            layers: [brtStandaard],
            view: view
        };
        pageMounted = true;
    });
</script>

{#if pageMounted}
    <div class="flex flex-col h-dvh w-full">
        <div class="h-16 bg-slate-700 flex items-center justify-center shadow-sm border-collapse">
            <span class="font-semibold text-white">WFS Source</span>
        </div>
        <OpenlayersMap {mapOptions} bind:mapManager>
            <WFSSource bind:layerId={restWarmteId} {...wfsSourceConfig} />
            <WFSSource {...wfsSourceConfigCBS} />
            <WidgetGroup position="top-right">
                <div class=" bg-white shadow-xl rounded-sm border-2 border-slate-300 border-solid">
                    <LayerControl />
                </div>
                <IdentifyFeatures layerIds={[restWarmteId]}></IdentifyFeatures>
            </WidgetGroup>
        </OpenlayersMap>

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
{/if}
