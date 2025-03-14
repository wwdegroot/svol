<script lang="ts">
	import { Map } from 'ol';
	import { setContext, onMount, onDestroy, type Snippet } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import 'ol/ol.css';

	interface Props {
		map: Map;
		class?: string;
		autoResize?: boolean;
		children?: Snippet;
	}

	let { map, class: classNames = 'w-full h-full', autoResize = true, children }: Props = $props();

	setContext('olmap', map);

	let mapDiv: HTMLDivElement | undefined = $state();
	let parent: HTMLElement;
	let siblings: HTMLCollection;
	let mapID = `map-${crypto.randomUUID().split("-")[0]}`;
	let mapHeight: Writable<number> = writable(400);

	function handleMapSize() {
		let totalHeight = 0;

		if (siblings) {
			for (let i = 0; i < siblings.length; i++) {
				let tag = siblings[i] as HTMLElement;
				if (tag.id != mapDiv?.id) {
					let style = getComputedStyle(tag);
					totalHeight +=
						tag.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
				}
			}
		}
		$mapHeight = parent.clientHeight - totalHeight;
	}

	onMount(() => {
		parent = mapDiv?.parentElement ?? document.getElementsByTagName('body')[0];
		siblings = parent.children;
		// TODO: do something with a MutationObserver on the parent element: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/MutationObserver#examples
		// create a store of child elements and update / remove when changed to recalculate map height
		map.setTarget(mapDiv);
		if (autoResize) {
			handleMapSize();
		}
	});

	onDestroy(() => {
		map.setTarget(undefined);
	});
</script>

<svelte:window onresize={() => handleMapSize()} />

{#if autoResize}
	<div bind:this={mapDiv} id={mapID} class={classNames} style="height: {$mapHeight}px">
		{@render children?.()}
	</div>
{:else}
	<div bind:this={mapDiv} class={classNames}>
		{@render children?.()}
	</div>
{/if}
