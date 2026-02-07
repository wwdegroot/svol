import Map, { type MapOptions } from 'ol/Map.js';
import type { Collection, Overlay, View } from 'ol';
import type { Coordinate } from 'ol/coordinate.js';
import type { Extent } from 'ol/extent.js';
import type BaseLayer from 'ol/layer/Base.js';
import type LayerGroup from 'ol/layer/Group.js';
import TileLayer from 'ol/layer/Tile.js';
import { OSM } from 'ol/source.js';
import type { ProjectionLike } from 'ol/proj.js';

/**
 * Map Manager class to access and manage the openlayers map instance with svelte $state runes
 */
export class MapManager {
    #map: Map = $state() as Map;
    #view: View | undefined = $state(undefined);
    #layers: Array<BaseLayer> | Collection<BaseLayer> | LayerGroup | undefined = $state(undefined);
    #overlays: Collection<Overlay> | Array<Overlay> | undefined = $state(undefined);
    center: Coordinate | undefined = $state(undefined);
    extent: Extent | undefined = $state(undefined);
    projection: ProjectionLike = $state() as ProjectionLike;

    constructor(options: MapOptions = {}) {
        this.#map = new Map(options);
        this.#view = this.#map.getView();
        this.#layers = this.#map.getAllLayers();
        this.#overlays = this.#map.getOverlays();
        this.center = this.#view?.getCenter();
        this.extent = this.#view?.calculateExtent();
        this.projection = this.#view?.getProjection().getCode();

        // set default layer to to OSM
        if (!options.layers) {
            let baseLayer = new TileLayer({
                source: new OSM()
            });
            baseLayer.set('layerType', 'base');
            this.#map.addLayer(baseLayer);
        }

        // Sync state with map changes
        this.#view?.on('change:center', () => {
            this.center = this.#view?.getCenter();
            this.extent = this.#view?.calculateExtent();
        });

        this.#map.on('change:view', () => {
            this.#view = this.#map.getView();
        });
    }

    // Getters for state
    get map() {
        return this.#map;
    }
    get view() {
        return this.#view;
    }
    get layers() {
        return this.#layers;
    }
    get overlays() {
        return this.#overlays;
    }

    // Derived state using getters
    get isInitialized() {
        return this.#map !== null;
    }

    setCenter(coords: Coordinate) {
        this.view?.setCenter(coords);
    }

    setExtent(extent: Extent) {
        this.#view?.fit(extent);
    }

    setTarget(target: HTMLElement) {
        this.#map.setTarget(target);
    }

    setView(view: View) {
        this.#map.setView(view);
    }

    destroy() {
        if (this.#map) {
            this.#map.setTarget(undefined);
            this.#map.dispose();
        }
    }
}
