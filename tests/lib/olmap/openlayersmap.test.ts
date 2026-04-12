import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MapManager } from '$lib/olmap/openlayersmap.svelte';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import { XYZ } from 'ol/source.js';
import type { Layer } from 'ol/layer.js';

describe('MapManager', () => {
    let manager: MapManager;
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        container.style.width = '500px';
        container.style.height = '500px';
        document.body.appendChild(container);

        manager = new MapManager({
            target: container,
            view: new View({
                center: [0, 0],
                zoom: 3
            })
        });
    });

    afterEach(() => {
        manager.destroy();
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
    });

    it('should initialize with default values', () => {
        expect(manager.isInitialized).toBe(true);
        expect(manager.map).toBeDefined();
        expect(manager.view).toBeDefined();
    });

    it('should set the target element correctly', () => {
        const newContainer = document.createElement('div');
        manager.setTarget(newContainer);
        expect(manager.map.getTarget()).toBe(newContainer);
    });

    it('should update center when view center changes', async () => {
        const newCenter: [number, number] = [1000, 1000];
        manager.setCenter(newCenter);

        // OpenLayers events are often asynchronous or require a frame to propagate
        // We wait for the next tick/frame to allow the event listener to fire and update state
        await new Promise((resolve) => setTimeout(resolve, 50));

        expect(manager.center).toEqual(newCenter);
    });

    it('should update extent when view changes', async () => {
        const extent: [number, number, number, number] = [
            -978383.9620502561, -978383.9620502561, 978403.9620502561, 978403.9620502561
        ];
        manager.setCenter([10, 10]);

        await new Promise((resolve) => setTimeout(resolve, 50));

        // The extent should be populated after the fit operation and event trigger
        expect(manager.extent).toEqual(extent);
    });

    it('should clean up resources on destroy', () => {
        const disposeSpy = vi.spyOn(manager.map, 'dispose');
        manager.destroy();
        expect(disposeSpy).toHaveBeenCalled();
        expect(manager.map.getTarget()).toBeNull();
    });

    it('should have a default OSM base layer if none provided', () => {
        const layers = manager.map.getAllLayers();
        const mapOSMLayer = layers.find((l) => l.getSource() instanceof OSM);
        const source = mapOSMLayer?.getSource() as OSM;
        const url = source?.getUrls()?.[0];
        expect(url).toBe('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
    });
});
