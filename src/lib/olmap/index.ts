export const MAPMANAGER_KEY = Symbol('olmapmanager');

export { MapManager } from './openlayersmap.svelte.js';
export { default as OlMapManager } from './OlMapManager.svelte';
// sources
export { default as WFS } from './sources/WFS.svelte';
export { default as DynamicGeoJson } from './sources/geojson/DynamicGeoJsonVector.svelte';
