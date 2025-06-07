<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Scan from '@lucide/svelte/icons/scan';
	import SquarePen from '@lucide/svelte/icons/square-pen';
	import ClipboardCopy from '@lucide/svelte/icons/clipboard-copy';
	import ClipboardCheck from '@lucide/svelte/icons/clipboard-check';
	import SquareX from '@lucide/svelte/icons/square-x';
	import { getContext, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Map from 'ol/Map.js';
	import { register, fromEPSGCode } from 'ol/proj/proj4.js';
	import { get as getProjection, transformExtent } from 'ol/proj.js';
	import type { Extent } from 'ol/extent.js';
	import Slider from '$lib/components/ui/slider/slider.svelte';
	import proj4 from 'proj4';

	type ProjectionItem = {
		value: string;
		label: string;
	};

	interface Props {
		iconSize?: number;
		projections: ProjectionItem[];
	}

	let { iconSize = 32, projections }: Props = $props();

	let map: Map = getContext('olmap');
	const mapProjection = map.getView().getProjection();
	let projectionList = $state([{ value: mapProjection.getCode(), label: mapProjection.getCode() }]);
	let selected = $state(mapProjection.getCode());
	const selectedLabel = $derived(projectionList.find((item) => item.value === selected)?.label);
	let decimalPlaces: number = $state(2);
	let bbox = $state('');
	let copied = $state(false);
	let copiedClear: number = 0;

	onMount(async () => {
		projectionList = [...projectionList, ...projections];
		register(proj4);
		projectionList.forEach(async (projection) => {
			await fromEPSGCode(projection.value);
		});
		getBboxMapExtent();
	});

	function getBboxMapExtent() {
		let extent: Extent = map.getView().calculateExtent(map.getSize());
		let destination = getProjection(selected) ?? mapProjection;
		let extent_selected = transformExtent(extent, mapProjection, destination);
		bbox = extent_selected.map((n) => n.toFixed(decimalPlaces)).join(',');
	}
</script>

<Popover.Root>
	<Popover.Trigger>
		<div class="rounded-md bg-white dark:bg-slate-800 shadow">
			<Scan size={iconSize} fill={'fill-black dark:fill-white'}></Scan>
		</div>
	</Popover.Trigger>
	<Popover.Content interactOutsideBehavior="ignore">
		<div class="grid grid-cols-1 gap-2">
			<div>
				<div class="flex flex-row justify-between">
					<div class="mb-2 font-bold">Projection:</div>
					<div><Popover.Close><SquareX /></Popover.Close></div>
				</div>

				<Select.Root type="single" onValueChange={(v) => (selected = v)} name="bboxProjection">
					<Select.Trigger class="w-[180px]">
						{selectedLabel ? selectedLabel : 'Select a projection'}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each projectionList as projection}
								<Select.Item value={projection.value} label={projection.label}
									>{projection.label}</Select.Item
								>
							{/each}
						</Select.Group>
					</Select.Content>
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
				<Button variant="outline" onclick={() => console.log('draw bbox')} disabled>
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

				<Button
					onclick={() => {
						clearTimeout(copiedClear);
						navigator.clipboard.writeText(bbox);
						copied = true;
						copiedClear = setTimeout(() => (copied = false), 500);
					}}
				>
					<ClipboardCopy />
					{#if copied}
						<div transition:fade>
							<ClipboardCheck />
						</div>
					{/if}
				</Button>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
