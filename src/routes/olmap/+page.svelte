<script lang="ts">
    import { MapManager, OlMapManager, OpenlayersMap, createMap } from '$lib/olmap/index.js';
    import { Map, View } from 'ol';
    import { onMount } from 'svelte';
    import type { MapOptions } from 'ol/Map.js';

    let mapManager: MapManager | undefined = $state();
    let mapOptions: MapOptions = $state({});
    let pageMounted: boolean = $state(false);

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
        <OlMapManager {mapOptions} bind:mapManager></OlMapManager>
        <div class="flex justify-center items-center content-center w-full h-16">
            <span class="font-bold text-black"
                >center: {mapManager?.center} projection: {mapManager?.projection?.toString()}
            </span>
        </div>
    </div>
{/if}
