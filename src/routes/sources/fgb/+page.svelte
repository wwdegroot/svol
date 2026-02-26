<script lang="ts">
    import { MapManager, OpenlayersMap } from '$lib/index.js';
    import { View } from 'ol';
    import { onMount } from 'svelte';
    import type { MapOptions } from 'ol/Map.js';
    import FlatGeoBuf from '$lib/olmap/sources/fgb/FlatGeoBuf.svelte';
    import ShowXY from '$lib/showxy/ShowXY.svelte';
    import WidgetGroup from '$lib/mapui/group/WidgetGroup.svelte';
    import InfoPopup from '$lib/infopopup/InfoPopup.svelte';

    let pageMounted = $state(false);
    let mapOptions: MapOptions = $state({});
    let mapManager: MapManager | undefined = $state(undefined);

    onMount(() => {
        let view = new View({
            center: [0, 0],
            zoom: 4
        });

        mapOptions = {
            view: view
        };
        pageMounted = true;
    });
</script>

{#if pageMounted}
    <div class="flex flex-col h-full w-full">
        <div class="h-16 bg-slate-700 flex items-center justify-center shadow-sm border-collapse">
            <span class="font-semibold text-white">Flatgeobuf Source and Info Popup</span>
        </div>
        <OpenlayersMap
            {mapOptions}
            bind:mapManager
            wrapperClass="relative flex-1 min-h-0 h-full"
            class="w-full h-full"
        >
            <FlatGeoBuf title="Eurocrops 2018" url="https://flatgeobuf.org/test/data/countries.fgb"
            ></FlatGeoBuf>
            <WidgetGroup position="bottom-right">
                <ShowXY></ShowXY>
            </WidgetGroup>
            <InfoPopup></InfoPopup>
        </OpenlayersMap>
        <div class="h-16 bg-white flex place-items-center justify-center">
            {mapManager?.center?.[0].toFixed(3)}, {mapManager?.center?.[1].toFixed(3)}
        </div>
    </div>
{/if}
