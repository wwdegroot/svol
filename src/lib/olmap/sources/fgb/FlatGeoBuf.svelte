<script lang="ts">
    import { getContext, onDestroy, onMount } from 'svelte';
    import VectorSource, { type LoadingStrategy } from 'ol/source/Vector.js';
    import VectorLayer from 'ol/layer/Vector.js';
    import { bbox as bboxStrategy } from 'ol/loadingstrategy.js';
    import { Style, Stroke } from 'ol/style.js';
    import { createLoader } from 'flatgeobuf/lib/mjs/ol.js';
    import { get as getProjection } from 'ol/proj.js';
    import type { StyleLike } from 'ol/style/Style.js';
    import type { FlatStyleLike } from 'ol/style/flat.js';
    import { MapManager, MAPMANAGER_KEY } from '$lib/index.js';
    import type { FeatureLoader } from 'ol/featureloader.js';
    import type { FeatureLike } from 'ol/Feature.js';
    import type { ProjectionLike } from 'ol/proj.js';

    interface Props {
        url: string;
        title: string;
        layerId?: string;
        style?: StyleLike | FlatStyleLike;
        visible?: boolean;
        projection?: ProjectionLike;
        clear?: boolean;
        loadingStrategy?: LoadingStrategy;
        headers?: HeadersInit;
        renderFeature?: boolean;
    }

    let {
        url,
        title,
        layerId = $bindable(crypto.randomUUID()),
        style = new Style({
            stroke: new Stroke({ color: 'rgba(255, 0, 0, 1.0)', width: 2 })
        }),
        visible = true,
        projection = 'EPSG:4326',
        clear = false,
        loadingStrategy = bboxStrategy,
        headers = {},
        renderFeature = false
    }: Props = $props();

    let mapManager: MapManager = getContext(MAPMANAGER_KEY);
    let vectorSource: VectorSource;
    let vectorLayer: VectorLayer<VectorSource>;
    let loader: FeatureLoader<FeatureLike>;

    // Get the srs code from the projectionlike. Fallback is EPSG:4326
    let loaderProjectionString: string = $derived.by(() => {
        const srsCode = getProjection(projection);
        return srsCode ? srsCode.getCode() : 'EPSG:4326';
    });

    onMount(() => {
        vectorSource = new VectorSource({
            strategy: loadingStrategy
        });

        loader = createLoader(
            vectorSource,
            url,
            loaderProjectionString,
            undefined, // we set this on the vector source
            clear,
            headers,
            renderFeature
        );
        vectorSource.setLoader(loader);

        vectorLayer = new VectorLayer({
            source: vectorSource,
            style: style,
            visible: visible
        });

        vectorLayer.set('title', title);
        vectorLayer.set('layerId', layerId);

        mapManager.map.addLayer(vectorLayer);
    });

    $effect(() => {
        if (vectorLayer) vectorLayer.setVisible(visible);
    });

    $effect(() => {
        if (vectorLayer) vectorLayer.setStyle(style);
    });

    onDestroy(() => {
        if (vectorLayer) {
            mapManager.map.removeLayer(vectorLayer);
        }
    });
</script>
