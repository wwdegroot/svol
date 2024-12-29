import type { View } from "ol";
import type { Layer } from "ol/layer.js";
import Map, { type MapOptions } from "ol/Map.js";

/**
 * Create an openlayers Map
 * 
 * @param {MapOptions} options 
 * @returns openlayers map object
 */
export function createMap(options: MapOptions): Map {
    let map = new Map(options);
    return map
}

/**
 * Create an openlayers Map $state
 * 
 * @param {MapOptions} options 
 * @returns openlayers map state object
 */
export function createMapState(options: MapOptions = {}): Map {
    let map = $state(new Map(options));
    return map
}
/**
 * MapState for reactive updates on state change
 */
export class MapState {
    #layers = $state([]) as Array<Layer>

    set layers(layers: Array<Layer>) {
        this.#layers = layers
    }

    get layers() {
        return this.#layers
    }

    addLayer(layer: Layer) {
        this.#layers.push(layer)
    }

    #map = $state() as Map
    #view = $state() as View
}