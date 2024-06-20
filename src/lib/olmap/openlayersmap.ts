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

/**
 * 
 * @param el 
 * @param mapHeight 
 */
export function autoResizeMapDiv(elHeight: number, mapHeight: Writable<number>) {
    console.log(elHeight)
    mapHeight.set(elHeight)
}