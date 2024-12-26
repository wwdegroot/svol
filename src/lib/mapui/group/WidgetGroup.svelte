<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import Control from 'ol/control/Control.js';
	import { getContext, onMount, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Map from 'ol/Map.js';

	export let position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
	let uiControlGroupDiv: HTMLDivElement;
	let uiControlGroupControl: Control;
	let map: Writable<Map> = getContext('olmap');

	let overlayContainerStopEvent = document.getElementsByClassName('ol-overlaycontainer-stopevent');

	let positionCss = '';
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
		$map.addControl(uiControlGroupControl);
	});

	onDestroy(() => {
		$map.removeControl(uiControlGroupControl);
	});
</script>

<div class={twMerge('absolute ', positionCss)} bind:this={uiControlGroupDiv}>
	<slot></slot>
</div>
