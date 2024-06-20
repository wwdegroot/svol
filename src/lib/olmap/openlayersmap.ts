import Map, { type MapOptions } from "ol/Map.js";
import { writable, type Writable } from "svelte/store";

/**
 * Create a sveltekit store for an openlayers Map
 * 
 * @param {MapOptions} options 
 * @returns sveltekit store with openlayers map
 */
export function createMapStore(options: MapOptions): Writable<Map> {
    return writable(new Map(options))
}

