<script lang="ts">
    import { MapManager } from '$lib/olmap/openlayersmap.svelte.js';
    import { setContext, onMount, onDestroy, type Snippet } from 'svelte';
    import 'ol/ol.css';
    import type { MapOptions } from 'ol/Map.js';
    import { MAPMANAGER_KEY } from './index.js';

    interface Props {
        mapOptions: MapOptions;
        class?: string;
        wrapperClass?: string;
        children?: Snippet;
        mapManager?: MapManager | undefined;
    }

    let {
        mapOptions,
        class: classNames = 'w-full h-full',
        wrapperClass = 'relative flex-1 min-h-0',
        children,
        mapManager = $bindable(undefined)
    }: Props = $props();
    const map = new MapManager(mapOptions);

    setContext(MAPMANAGER_KEY, map);

    let mapDiv: HTMLDivElement | undefined = $state(undefined);
    let mapID = `map-${crypto.randomUUID().split('-')[0]}`;

    onMount(() => {
        if (mapDiv) {
            map.setTarget(mapDiv);
            mapManager = map;
        }
    });

    onDestroy(() => {
        map.destroy();
    });
</script>

<div class={wrapperClass}>
    <div bind:this={mapDiv} id={mapID} class={classNames}>
        {@render children?.()}
    </div>
</div>
