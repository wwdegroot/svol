<script lang="ts">
    import * as Popover from '$lib/components/ui/popover/index.js';
    import * as Select from '$lib/components/ui/select/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import Scan from '@lucide/svelte/icons/scan';
    import SquarePen from '@lucide/svelte/icons/square-pen';
    import ClipboardCopy from '@lucide/svelte/icons/clipboard-copy';
    import ClipboardCheck from '@lucide/svelte/icons/clipboard-check';
    import SquareX from '@lucide/svelte/icons/square-x';
    import { getContext, onDestroy, onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Draw, { createBox, DrawEvent } from 'ol/interaction/Draw.js';
    import VectorLayer from 'ol/layer/Vector.js';
    import VectorSource from 'ol/source/Vector.js';
    import { register, fromEPSGCode } from 'ol/proj/proj4.js';
    import { get as getProjection, transformExtent, type ProjectionLike } from 'ol/proj.js';
    import type { Extent } from 'ol/extent.js';
    import Slider from '$lib/components/ui/slider/slider.svelte';
    import proj4 from 'proj4';
    import type { MapManager } from '$lib/olmap/openlayersmap.svelte.js';
    import { MAPMANAGER_KEY } from '$lib/olmap/index.js';

    type ProjectionItem = {
        value: string;
        label: string;
    };

    interface Props {
        iconSize?: number;
        projections: ProjectionItem[];
    }

    let { iconSize = 32, projections }: Props = $props();

    let mapManager: MapManager = getContext(MAPMANAGER_KEY);
    const mapProjection = mapManager.view?.getProjection();
    let drawSource: VectorSource;
    let drawVector: VectorLayer;
    let draw: Draw;

    let projectionList = $state([
        { value: mapProjection?.getCode(), label: mapProjection?.getCode() }
    ]);
    let selected = $state(mapProjection?.getCode());
    const selectedLabel = $derived(projectionList.find((item) => item.value === selected)?.label);
    let decimalPlaces: number = $state(2);
    let extent: Extent = $state([]) as Extent;
    let bboxFormatted = $derived.by(() => {
        return extent.map((n) => n.toFixed(decimalPlaces)).join(', ');
    });
    let copied = $state(false);
    let copiedClear: number = 0;
    let drawActive = $state(false);

    const bboxStyle = {
        'circle-radius': 5,
        'circle-fill-color': 'rgba(116,140,191,0.4)',
        'stroke-line-cap': 'butt',
        'stroke-line-dash': [5, 10],
        'stroke-color': 'black',
        'circle-stroke-width': 3
    };

    onMount(async () => {
        // Add drawing layer
        drawSource = new VectorSource({ wrapX: false });
        drawVector = new VectorLayer({
            source: drawSource,
            style: bboxStyle
        });
        draw = new Draw({
            source: drawSource,
            type: 'Circle',
            style: bboxStyle,
            geometryFunction: createBox()
        });
        draw.on('drawend', drawFeatureExtent);
        mapManager.map.addLayer(drawVector);

        // Get Projection list
        projectionList = [...projectionList, ...projections];
        register(proj4);
        projectionList.forEach(async (projection) => {
            await fromEPSGCode(projection.value as string);
        });
        extent = getBboxMapExtent();
    });

    function transformToSelected(extent: Extent): Extent {
        let destination = getProjection(selected) ?? mapProjection;
        return transformExtent(extent, mapProjection, destination);
    }

    function getBboxMapExtent(): Extent {
        let extent: Extent = mapManager.view?.calculateExtent(mapManager.map.getSize()) as Extent;
        let extent_selected = transformToSelected(extent);
        return extent_selected;
    }

    function getFeatureExtent(event: DrawEvent): Extent {
        let extent: Extent | undefined = event.feature.getGeometry()?.getExtent();
        if (extent) {
            let extent_selected = transformToSelected(extent);
            return extent_selected;
        } else {
            throw new Error('No valid event feature found.');
        }
    }

    const drawFeatureExtent = (event: DrawEvent) => {
        extent = getFeatureExtent(event);
        drawSource.clear();
    };

    function toggleDrawInteraction() {
        if (drawActive) {
            mapManager.map.addInteraction(draw);
        } else {
            mapManager.map.removeInteraction(draw);
            drawSource.clear();
        }
    }

    onDestroy(() => {
        // Remove drawing layer
        mapManager.map.removeLayer(drawVector);
        // Remove draw interaction
        draw.un('drawend', drawFeatureExtent);
        mapManager.map.removeInteraction(draw);
    });
</script>

<Popover.Root>
    <Popover.Trigger>
        <div>
            <Scan
                size={iconSize}
                class="rounded-md bg-white dark:bg-slate-800 shadow-sm stroke-black dark:stroke-white"
            ></Scan>
        </div>
    </Popover.Trigger>
    <Popover.Content interactOutsideBehavior="ignore">
        <div class="grid grid-cols-1 gap-2">
            <div>
                <div class="flex flex-row justify-between">
                    <div class="mb-2 font-bold">Projection:</div>
                    <div><Popover.Close><SquareX /></Popover.Close></div>
                </div>

                <Select.Root
                    type="single"
                    onValueChange={(v) => {
                        selected = v;
                    }}
                    name="bboxProjection"
                >
                    <Select.Trigger class="w-[180px]">
                        {selectedLabel ? selectedLabel : 'Select a projection'}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            {#each projectionList as projection}
                                <Select.Item
                                    value={projection.value as string}
                                    label={projection.label}>{projection.label}</Select.Item
                                >
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
            </div>
            <div class="grid grid-cols-1 gap-2">
                <div class="font-bold">Coordinate Decimals ({decimalPlaces}):</div>
                <Slider
                    type="single"
                    value={2}
                    max={10}
                    step={1}
                    onValueChange={(value: number) => {
                        decimalPlaces = value;
                    }}
                />
            </div>
            <div class="grid grid-cols-2 gap-2">
                <Button
                    variant="outline"
                    class={drawActive ? 'bg-indigo-300' : ''}
                    onclick={() => {
                        drawActive = !drawActive;
                        toggleDrawInteraction();
                    }}
                >
                    <SquarePen class="mr-2 h-6 w-6" />
                    Draw BBOX
                </Button>
                <Button variant="outline" onclick={() => (extent = getBboxMapExtent())}
                    >View BBOX</Button
                >
            </div>
            <div class="grid grid-cols-1">
                <div class="mb-2">
                    <p class="font-bold">Bounding box:</p>
                    <div class="font-italic ml-4">{bboxFormatted}</div>
                </div>

                <Button
                    onclick={() => {
                        clearTimeout(copiedClear);
                        navigator.clipboard.writeText(bboxFormatted.split(', ').join(','));
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
