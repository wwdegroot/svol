<script lang="ts">
    import { twMerge } from 'tailwind-merge';
    import Control from 'ol/control/Control.js';
    import { getContext, onMount, onDestroy, type Snippet } from 'svelte';
    import { MapManager, MAPMANAGER_KEY } from '$lib/olmap/index.js';
    import type { ClassValue } from 'svelte/elements';

    interface Props {
        position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
        children?: Snippet;
        class?: ClassValue;
    }

    let { position, children, class: classValue = '' }: Props = $props();
    let uiControlGroupDiv: HTMLDivElement | undefined = $state();
    let uiControlGroupControl: Control;
    let mapManager: MapManager = getContext(MAPMANAGER_KEY);

    let positionCss = $state('');
    switch (position) {
        case 'top-left':
            positionCss = 'left-2 top-2';
            break;
        case 'top-right':
            positionCss = 'right-2 top-2';
            break;
        case 'bottom-left':
            positionCss = 'left-2 bottom-2';
            break;
        case 'bottom-right':
            positionCss = 'right-2 bottom-2';
            break;
        default:
            positionCss = 'right-2 top-2';
            break;
    }
    onMount(() => {
        uiControlGroupControl = new Control({
            element: uiControlGroupDiv
        });
        mapManager.map.addControl(uiControlGroupControl);
    });

    onDestroy(() => {
        mapManager.map.removeControl(uiControlGroupControl);
    });
</script>

<div
    class={twMerge('absolute ', [positionCss, classValue as string])}
    bind:this={uiControlGroupDiv}
>
    {@render children?.()}
</div>
