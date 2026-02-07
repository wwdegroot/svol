<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import { Checkbox } from '$lib/components/ui/checkbox/index.js';
    import { Label } from '$lib/components/ui/label/index.js';
    import type Layer from 'ol/layer/Layer.js';
    import type { MapManager } from '$lib/olmap/openlayersmap.svelte.js';
    import { MAPMANAGER_KEY } from '$lib/olmap/index.js';

    interface Props {
        title?: string;
    }
    let { title = 'Layers' }: Props = $props();

    let mapManager: MapManager = getContext(MAPMANAGER_KEY);

    let layers: Array<Layer> = $state([]);

    function toggleLayerVisible(layer_id: string) {
        // @ts-expect-error
        let layer = layers.find((l) => l.ol_uid == layer_id);
        layer?.setVisible(!layer.getVisible());
    }

    onMount(() => {
        layers = mapManager.map.getAllLayers().filter((l) => l.get('layertype') != 'base');
    });
</script>

<!-- ol_uid does exist on layer -->
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
