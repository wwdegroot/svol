<script lang="ts">
    import Map from 'ol/Map.js';
    import GeoJSON from 'ol/format/GeoJSON.js';
    import Feature from 'ol/Feature.js';
    import VectorLayer from 'ol/layer/Vector.js';
    import VectorSource from 'ol/source/Vector.js';
    import { getContext, onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { StyleLike } from 'ol/style/Style.js';
	import { type FlatStyleLike } from 'ol/style/flat.js';
    import {bbox} from 'ol/loadingstrategy.js';
    
    interface Props {
		title: string;
		style: StyleLike | FlatStyleLike;
        features: Writable<Feature[]>;
        clear: boolean
	}

    let {
		title,
		style,
        features,
        clear = $bindable(false)
	}: Props = $props();

    let map: Map = getContext('olmap');
    
    const geojsonSource = new VectorSource({
            format: new GeoJSON(),
            strategy: bbox,
        })

    const geojsonLayer = new VectorLayer({
        source: geojsonSource,
        style: style
    })
    geojsonLayer.set('title', title)

    $effect(() => {
        if (clear) {
            geojsonSource.clear()
            clear = false;
        }
    })

    $effect(() => {
        geojsonSource.addFeatures($features)
    })

    onMount(() => {
        map.addLayer(geojsonLayer)

    });

    onDestroy(() => {
        map.removeLayer(geojsonLayer)
    })

</script>

