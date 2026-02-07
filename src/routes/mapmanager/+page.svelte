<script lang="ts">
    import { OlMapManager, MapManager } from '$lib/olmap/index.js';
    import { onMount } from 'svelte';
    import { View } from 'ol';
    import type { MapOptions } from 'ol/Map.js';
    import GoToXY from '$lib/gotoxy/GoToXY.svelte';
    import WidgetGroup from '$lib/mapui/group/WidgetGroup.svelte';

    let mapOptions: MapOptions = $state({});
    let pageMounted = $state(false);
    let mapManager: MapManager | undefined = $state(undefined);

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

{#if pageMounted}
    <div class="flex flex-col h-dvh w-full">
        <div class="flex justify-center items-center content-center h-16 bg-slate-700">
            <span class="font-bold text-white">OpenLayers Map</span>
        </div>
        <OlMapManager {mapOptions} bind:mapManager>
            <WidgetGroup position="top-right" class="flex flex-col gap-4 items-end">
                <GoToXY></GoToXY>
                <div class="flex flex-col gap-2 bg-white w-34 rounded shadow">
                    <div class="pl-2 font-bold">View Center</div>
                    <div class="pl-4">x: {mapManager?.center?.[0].toFixed(3)}</div>
                    <div class="pl-4 pb-2">y: {mapManager?.center?.[1].toFixed(3)}</div>
                </div>
            </WidgetGroup>
        </OlMapManager>

        <div class="flex justify-center items-center content-center w-full h-16">
            <span class="font-bold text-black"
                >projection: {mapManager?.projection?.toString()}
            </span>
        </div>
    </div>
{/if}
