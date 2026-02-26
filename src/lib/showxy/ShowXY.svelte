<script lang="ts">
    import { getContext, onDestroy, onMount } from 'svelte';
    import type { MapManager } from '$lib/olmap/openlayersmap.svelte.js';
    import { MAPMANAGER_KEY } from '$lib/olmap/index.js';
    import type { ProjectionLike } from 'ol/proj.js';
    import { MousePosition } from 'ol/control.js';
    import { createStringXY } from 'ol/coordinate.js';

    interface Props {
        precision?: number;
        projection?: ProjectionLike;
    }

    let { precision = 4, projection = 'EPSG:4326' }: Props = $props();

    let mapManager: MapManager = getContext(MAPMANAGER_KEY);
    let mousePositionControl: MousePosition;
    let mousePositionElement: HTMLDivElement;

    onMount(() => {
        mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(precision),
            projection: projection,
            className: '',
            target: mousePositionElement
        });
        mapManager.map.addControl(mousePositionControl);
    });

    onDestroy(() => {
        mapManager.map.removeControl(mousePositionControl);
    });
</script>

<div
    class="mb-4 bg-white opacity-60 pr-2 pl-2 min-w-36 rounded-sm font-mono"
    bind:this={mousePositionElement}
></div>
