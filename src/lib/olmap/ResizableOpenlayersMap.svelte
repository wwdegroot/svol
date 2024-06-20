<script lang="ts">
	import { Map } from 'ol';
	import { setContext, onMount, onDestroy } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import * as Resizable from '$lib/components/ui/resizable';

	export let mapStore: Writable<Map>;
	export let title: string = '';
	export let resizable: boolean = false;
	export let mapSize: number = 75;
	export let dataPane: boolean = false;
	export let dataSize: number = 20;
	export let headerPane: boolean = false;
	export let headerSize: number = 5;

	setContext('olmap', mapStore);

	let mapDiv: HTMLDivElement;
	let headerResizer: HTMLDivElement;

	onMount(() => {
		$mapStore.setTarget(mapDiv);
		headerResizer.style.cursor = 'auto';
	});

	onDestroy(() => {
		$mapStore.setTarget(undefined);
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
			<slot name="header"></slot>
		</Resizable.Pane>
		<Resizable.Handle
			disabled={true}
			bind:el={headerResizer}
			class="data-[direction=vertical]:h-0 "
		/>
	{/if}

	<Resizable.Pane defaultSize={mapSize}>
		<div bind:this={mapDiv} class="h-full">
			<slot name="map" />
		</div>
	</Resizable.Pane>
	{#if resizable}
		<Resizable.Handle />
	{/if}
	{#if dataPane}
		<Resizable.Pane defaultSize={dataSize} minSize={0} collapsible={true}>
			<div class="h-2 bg-gray-200 border-0 dark:bg-gray-700" />
			<slot name="data"></slot>
		</Resizable.Pane>
	{/if}
</Resizable.PaneGroup>
