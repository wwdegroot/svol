<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Scan from 'lucide-svelte/icons/scan';
	import SquarePen from 'lucide-svelte/icons/square-pen';
	import ClipboardCopy from 'lucide-svelte/icons/clipboard-copy';
	import SquareX from 'lucide-svelte/icons/square-x';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Map from 'ol/Map.js';
	import { get as getProjection } from 'ol/proj.js';
	import type { Extent } from 'ol/extent.js';
	import Slider from '$lib/components/ui/slider/slider.svelte';

	interface Props {
		size?: number;
	}

	let { size = 32 }: Props = $props();

	let map: Writable<Map> = getContext('olmap');
	const mapProjection = $map.getView().getProjection();
	const projectionList = [
		{ value: mapProjection.getCode(), label: mapProjection.getCode() },
		{ value: 'EPSG:28992', label: 'EPSG:28992' }
	];
	let selected = $state({ value: mapProjection.getCode(), label: mapProjection.getCode() });
	let decimalPlaces: number = $state(2);

	let bbox = $state('');

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

<Popover.Root>
	<Popover.Trigger>
		<div class="rounded-md bg-white dark:bg-slate-800 shadow">
			<Scan {size} fill={'fill-black dark:fill-white'}></Scan>
		</div>
	</Popover.Trigger>
	<Popover.Content interactOutsideBehavior="ignore">
		<div class="grid grid-cols-1 gap-2">
			<div>
				<div class="flex flex-row justify-between">
					<div class="mb-2 font-bold">Projection:</div>
					<div><Popover.Close><SquareX /></Popover.Close></div>
				</div>

				<Select.Root bind:value={selected}>
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
				<Button variant="outline" onclick={() => console.log('draw bbox')}>
					<SquarePen class="mr-2 h-6 w-6" />
					Draw BBOX
				</Button>
				<Button variant="outline" onclick={() => getBboxMapExtent()}>View BBOX</Button>
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
