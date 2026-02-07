<script lang="ts">
    import { getContext, onDestroy, onMount } from 'svelte';
    import GeoJSON from 'ol/format/GeoJSON.js';
    import VectorSource, { type LoadingStrategy } from 'ol/source/Vector.js';
    import { Stroke, Style } from 'ol/style.js';
    import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
    import { createXYZ } from 'ol/tilegrid.js';
    import { tile, bbox } from 'ol/loadingstrategy.js';
    import { useGeographic } from 'ol/proj.js';
    import type { StyleLike } from 'ol/style/Style.js';
    import type { Extent } from 'ol/extent.js';
    import type BaseLayer from 'ol/layer/Base.js';
    import type { FlatStyleLike } from 'ol/style/flat.js';
    import { MapManager, MAPMANAGER_KEY } from '../index.js';

    interface Props {
        url: string;
        layerId?: string;
        title: string;
        crs: string;
        featuretypes: string[];
        version?: '1.1.0' | '2.0.0';
        outputFormat?: string;
        strategy?: 'bbox' | 'tile';
        style?: StyleLike | FlatStyleLike;
        filter?: string | undefined;
    }

    let {
        url,
        layerId = $bindable(crypto.randomUUID()),
        title,
        crs,
        featuretypes,
        strategy = 'tile',
        version = '2.0.0',
        outputFormat = 'application/json',
        style = new Style({ stroke: new Stroke({ color: 'rgba(0, 0, 255, 1.0)', width: 2 }) }),
        filter = undefined
    }: Props = $props();

    async function featureLoader(extent: Extent, resolution, projection, success, failure) {
        let wfsUrl = `${url}?service=WFS&version=${version}&request=GetFeature&typename=${featuretypes.join(',')}&outputFormat=${outputFormat}&srsname=${crs}`;
        if (filter) {
            wfsUrl =
                wfsUrl +
                `&Filter=<Filter><And><BBOX><PropertyName>geom</PropertyName><Envelope srsName="EPSG:28992"><lowerCorner>${extent[2]} ${extent[3]}</lowerCorner><upperCorner>${extent[0]} ${extent[1]}</upperCorner></Envelope></BBOX>${filter}</And></Filter>`;
        } else {
            wfsUrl = wfsUrl + `&bbox=${extent.join(',')},${crs}`;
        }
        let resp = await fetch(wfsUrl);
        if (!resp.ok) {
            console.log(await resp.text());
            vectorSource.removeLoadedExtent(extent);
            failure();
        }
        const data = await resp.text();
        const features = vectorSource.getFormat()!.readFeatures(data);
        vectorSource.addFeatures(features);
        success(features);
    }

    let mapManager: MapManager = getContext(MAPMANAGER_KEY);
    let loadingStrategy: LoadingStrategy;
    let vectorSource: VectorSource;
    let vectorLayer: BaseLayer;

    onMount(() => {
        if (strategy == 'tile') {
            useGeographic();
            loadingStrategy = tile(createXYZ({ tileSize: 256 }));
        } else {
            loadingStrategy = bbox;
        }

        vectorSource = new VectorSource({
            format: new GeoJSON(),
            loader: featureLoader,
            strategy: loadingStrategy
        });
        vectorLayer = new VectorLayer({
            source: vectorSource,
            style: style
        });
        vectorLayer.set('title', title);
        vectorLayer.set('layerId', layerId);

        mapManager.map.addLayer(vectorLayer);
    });

    onDestroy(() => {
        mapManager.map.removeLayer(vectorLayer);
    });
</script>
