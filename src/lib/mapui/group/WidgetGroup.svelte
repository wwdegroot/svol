<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import Control from 'ol/control/Control.js';
	import { getContext, onMount, onDestroy, type Snippet } from 'svelte';
	import Map from 'ol/Map.js';

	interface Props {
		position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
		children?: Snippet;
	}

	let { position, children }: Props = $props();
	let uiControlGroupDiv: HTMLDivElement | undefined = $state();
	let uiControlGroupControl: Control;
	let map: Map = getContext('olmap');

	let overlayContainerStopEvent = document.getElementsByClassName('ol-overlaycontainer-stopevent');

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
		map.addControl(uiControlGroupControl);
	});

	onDestroy(() => {
		map.removeControl(uiControlGroupControl);
	});
</script>

<div class={twMerge('absolute ', positionCss)} bind:this={uiControlGroupDiv}>
	{@render children?.()}
</div>
