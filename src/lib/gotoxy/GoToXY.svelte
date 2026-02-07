<script lang="ts">
    import { MapManager, MAPMANAGER_KEY } from '$lib/olmap/index.js';
    import { getContext } from 'svelte';

    const mapManager: MapManager = getContext(MAPMANAGER_KEY);

    interface Props {
        class?: string;
        buttonClass?: string;
        goToTitle?: string;
    }
    let {
        class: ClassValue = 'bg-white p-1 rounded shadow',
        goToTitle = 'Go To',
        buttonClass = 'bg-slate-700 hover:bg-slate-800 text-white pl-2 pr-2 rounded'
    }: Props = $props();

    let x: number | undefined = $state(mapManager.center?.[0]);
    let y: number | undefined = $state(mapManager.center?.[1]);

    function goToXYCoordinates() {
        if (x !== undefined && y !== undefined) {
            mapManager.setCenter([x, y]);
        }
    }
</script>

<div class={ClassValue}>
    <label>
        X:
        <input bind:value={x} class="w-18 remove-arrow" type="number" />
    </label>
    <label>
        Y:
        <input bind:value={y} class="w-18 remove-arrow" type="number" />
    </label>
    <button class={buttonClass} onclick={() => goToXYCoordinates()}>{goToTitle}</button>
</div>

<style>
    /*Remove input increment and decrement arrows */
    .remove-arrow::-webkit-inner-spin-button,
    .remove-arrow::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    .remove-arrow {
        -moz-appearance: textfield;
    }
</style>
