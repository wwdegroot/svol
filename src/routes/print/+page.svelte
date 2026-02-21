<script lang="ts">
    import { OpenlayersMap, MapManager, WFS, Print, WidgetGroup } from '$lib/index.js';
    import { onMount } from 'svelte';
    import { View } from 'ol';
    import type { MapOptions } from 'ol/Map.js';
    import { useGeographic } from 'ol/proj.js';

    let mapOptions: MapOptions = $state({});
    let pageMounted = $state(false);
    let mapManager: MapManager | undefined = $state(undefined);

    onMount(() => {
        useGeographic();
        let view = new View({
            center: [12, 40],
            zoom: 6
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
            <span class="font-bold text-white">OpenLayers Map with Print / Export </span>
        </div>
        <OpenlayersMap {mapOptions} bind:mapManager>
            <WidgetGroup position="top-right" class="flex flex-col gap-4 items-end">
                <Print onlyImage={true}></Print>
                <div class="flex flex-col gap-2 bg-white w-34 rounded shadow">
                    <div class="pl-2 font-bold">View Center</div>
                    <div class="pl-4">x: {mapManager?.center?.[0].toFixed(3)}</div>
                    <div class="pl-4 pb-2">y: {mapManager?.center?.[1].toFixed(3)}</div>
                </div>
            </WidgetGroup>
            <WFS
                url="https://emidius.mi.ingv.it/services/italy/wfs/"
                title="Catalogo Parametrico dei Terremoti Italiani (CPTI15)"
                featuretypes={['italy:CPTI_current']}
                crs="EPSG:4326"
                style={[
                    {
                        filter: ['>=', ['get', 'Year'], 2000],
                        style: {
                            'circle-radius': 8,
                            'circle-fill-color': 'rgba(255, 0, 0, 0.6)',
                            'circle-stroke-width': 2,
                            'circle-stroke-color': '#333'
                        }
                    }
                ]}
            ></WFS>
        </OpenlayersMap>

        <div class="flex justify-center items-center content-center w-full h-16">
            <span class="font-bold text-black"
                >projection: {mapManager?.projection?.toString()}
            </span>
        </div>
    </div>
{/if}
