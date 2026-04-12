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
    let isLocalMapManager = !mapManager;
    // We only instantiate the map page once after loading, we dont need it to be reactive.
    // svelte-ignore state_referenced_locally
    let internalMapManager = $state<MapManager>(mapManager ?? new MapManager(mapOptions));

    if (isLocalMapManager) {
        mapManager = internalMapManager;
    }

    setContext(MAPMANAGER_KEY, internalMapManager);

    let mapDiv: HTMLDivElement | undefined = $state(undefined);
    let mapID = `map-${crypto.randomUUID().split('-')[0]}`;

    onMount(() => {
        if (mapDiv) {
            internalMapManager.setTarget(mapDiv);
        }
    });

    onDestroy(() => {
        if (isLocalMapManager) {
            internalMapManager.destroy();
        }
    });
</script>

<div class={wrapperClass}>
    <div bind:this={mapDiv} id={mapID} class={classNames}>
        {@render children?.()}
    </div>
</div>
