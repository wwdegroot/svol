export const MAPMANAGER_KEY = Symbol('olmapmanager');

export { default as OpenlayersMap } from './OpenlayersMap.svelte';
export { createMapStore } from './openlayersmap.js';
export { createMap, createMapState, MapManager } from './openlayersmap.svelte.js';
export { default as ResizableOpenlayersMap } from './ResizableOpenlayersMap.svelte';
export { default as OlMapManager } from './OlMapManager.svelte';
// sources
export { default as WFS } from './sources/WFS.svelte';
export { default as DynamicGeoJson } from './sources/geojson/DynamicGeoJsonVector.svelte';
