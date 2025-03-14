<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Map from 'ol/Map.js';
	import type Layer from 'ol/layer/Layer.js';

	interface Props {
		title?: string;
	}
	let { title = 'Layers' }: Props = $props();

	let map: Map = $state(getContext('olmap'));

	let layers: Array<Layer> = $state([]);

	function toggleLayerVisible(layer_id: string) {
		let layer = layers.find((l) => l.ol_uid == layer_id);
		layer?.setVisible(!layer.getVisible());
	}

	onMount(() => {
		layers = map.getAllLayers().filter((l) => l.get('layertype') != 'base');
	});
</script>

<div class="flex flex-col gap-2 p-2">
	<div>{title}</div>
	{#each layers as layer}
		{@const checked = layer.getVisible()}
		<div class="flex bg-white">
			<Checkbox
				id={layer.ol_uid}
				{checked}
				aria-labelledby={`${layer.ol_uid}-label`}
				onclick={() => toggleLayerVisible(layer.ol_uid)}
			/>
			<Label
				id={`${layer.ol_uid}-label`}
				for={layer.ol_uid}
				class="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{layer.get('title')}
			</Label>
		</div>
	{/each}
</div>
