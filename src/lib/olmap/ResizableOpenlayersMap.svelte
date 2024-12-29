<script lang="ts">
	import { Map } from 'ol';
	import { setContext, onMount, onDestroy, type Snippet } from 'svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';

	interface Props {
		mapStore: Map;
		title?: string;
		resizable?: boolean;
		mapSize?: number;
		dataPane?: boolean;
		dataSize?: number;
		headerPane?: boolean;
		headerSize?: number;
		header?: Snippet;
		map?: Snippet;
		data?: Snippet;
	}

	let {
		mapStore,
		title = '',
		resizable = false,
		mapSize = 75,
		dataPane = false,
		dataSize = 20,
		headerPane = false,
		headerSize = 5,
		header,
		map,
		data
	}: Props = $props();

	setContext('olmap', mapStore);

	let mapDiv: HTMLDivElement | undefined = $state();

	onMount(() => {
		mapStore.setTarget(mapDiv);
	});

	onDestroy(() => {
		mapStore.setTarget(undefined);
	});
</script>

<Resizable.PaneGroup direction="vertical" autoSaveId={title}>
	{#if headerPane}
		<Resizable.Pane
			defaultSize={headerSize}
			minSize={headerSize}
			maxSize={headerSize}
			collapsible={false}
		>
			{@render header?.()}
		</Resizable.Pane>
		<Resizable.Handle disabled={true} class="data-[direction=vertical]:h-0 " />
	{/if}

	<Resizable.Pane defaultSize={mapSize}>
		<div bind:this={mapDiv} class="h-full">
			{@render map?.()}
		</div>
	</Resizable.Pane>
	{#if resizable}
		<Resizable.Handle />
	{/if}
	{#if dataPane}
		<Resizable.Pane defaultSize={dataSize} minSize={0} collapsible={true}>
			<div class="h-2 bg-gray-200 border-0 dark:bg-gray-700"></div>
			{@render data?.()}
		</Resizable.Pane>
	{/if}
</Resizable.PaneGroup>
