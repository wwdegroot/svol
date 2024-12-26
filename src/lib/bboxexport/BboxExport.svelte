<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Scan, SquarePen, ClipboardCopy } from 'lucide-svelte';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Map from 'ol/Map.js';
	import { get as getProjection } from 'ol/proj.js';
	import type { Extent } from 'ol/extent.js';
	import Slider from '$lib/components/ui/slider/slider.svelte';

	export let size: number = 32;

	let map: Writable<Map> = getContext('olmap');
	const mapProjection = $map.getView().getProjection();
	const projectionList = [
		{ value: mapProjection.getCode(), label: mapProjection.getCode() },
		{ value: 'EPSG:28992', label: 'EPSG:28992' }
	];
	let selected = { value: mapProjection.getCode(), label: mapProjection.getCode() };
	let decimalPlaces: number = 2;
	$: console.log(selected);

	$: bbox = '';
	onMount(() => {
		getBboxMapExtent();
	});

	function getBboxMapExtent() {
		console.log('map extent');
		let extent = $map.getView().calculateExtent($map.getSize());
		console.log(extent);
		bbox = extent.map((n) => n.toFixed(decimalPlaces)).join(',');
	}
</script>

<Popover.Root closeOnOutsideClick={false}>
	<Popover.Trigger>
		<button
			class="rounded-md bg-white dark:bg-slate-800 shadow"
			on:click={() => console.log('bbox export click')}
		>
			<Scan {size} fill={'fill-black dark:fill-white'}></Scan>
		</button>
	</Popover.Trigger>
	<Popover.Content>
		<div class="grid grid-cols-1 gap-2">
			<div>
				<p class="mb-2 font-bold">Projection:</p>
				<Select.Root portal={null} bind:selected>
					<Select.Trigger class="w-[180px]">
						<Select.Value placeholder="Select a projection" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each projectionList as projection}
								{#if projection.label == mapProjection.getCode()}
									<Select.Item value={projection.value} label={projection.label}
										>{projection.label}</Select.Item
									>
								{:else}
									<Select.Item value={projection.value} label={projection.label}
										>{projection.label}</Select.Item
									>
								{/if}
							{/each}
						</Select.Group>
					</Select.Content>
					<Select.Input name="bboxProjection" />
				</Select.Root>
			</div>
			<div class="grid grid-cols-1 gap-2">
				<div class="font-bold">Coordinate Decimals ({decimalPlaces}):</div>
				<Slider
					value={[2]}
					max={10}
					step={1}
					onValueChange={(value) => {
						decimalPlaces = value[0];
					}}
				/>
			</div>
			<div class="grid grid-cols-2 gap-2">
				<Button variant="outline" on:click={() => console.log('draw bbox')}>
					<SquarePen class="mr-2 h-6 w-6" />
					Draw BBOX
				</Button>
				<Button variant="outline" on:click={() => getBboxMapExtent()}>View BBOX</Button>
			</div>
			<div class="grid grid-cols-1">
				<div class="mb-2">
					<p class="font-bold">Bounding box:</p>
					<div class="font-italic ml-4">{bbox.split(',').join(',\n')}</div>
				</div>

				<Button><ClipboardCopy /></Button>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
