import Map from 'ol/Map.js';
import { getPointResolution, type ProjectionLike } from 'ol/proj.js';
import View from 'ol/View.js';
import { drawNorthArrow, drawScaleBar } from './printing-ui.js';
import {
    PAGE_MM,
    SCREEN_DPI,
    type Orientation,
    type PageSize,
    type PrintDpi
} from './constants.js';
import type BaseLayer from 'ol/layer/Base.js';
import type { Layer } from 'ol/layer.js';
import type { Source } from 'ol/source.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorLayer from 'ol/layer/Vector.js';
import ImageLayer from 'ol/layer/Image.js';

export interface ScaleInfo {
    label: string;
    barWidthPx: number;
}

export interface CaptureResult {
    blob: Blob;
    pageWidth: number;
    pageHeight: number;
    printDpi: PrintDpi;
    pageSize: PageSize;
    orientation: Orientation;
}

export interface ViewSnapshot {
    projection: ProjectionLike;
    center: number[];
    resolution: number;
    rotation: number;
}
/**
 * Optional factory the caller provides to create fresh layer instances for the
 * offscreen map. Receives the source map's layer array and should return a new
 * array of layers with independent sources so the live map is unaffected.
 */
export type LayerFactory = (sourceLayers: BaseLayer[]) => BaseLayer[];

// Helper functions for page sizing
/** Convert millimetres to pixels at a given DPI. */
function mmToPx(mm: number, dpi: PrintDpi): number {
    return Math.round((mm / 25.4) * dpi);
}

/** Returns the physical pixel dimensions of the print canvas. */
export function getPagePixels(
    pageSize: PageSize,
    orientation: Orientation,
    dpi: PrintDpi
): { width: number; height: number } {
    const { w, h } = PAGE_MM[pageSize];
    const portraitW = mmToPx(w, dpi);
    const portraitH = mmToPx(h, dpi);
    return orientation === 'portrait'
        ? { width: portraitW, height: portraitH }
        : { width: portraitH, height: portraitW };
}
/**
 * Returns the multiplier needed to go from screen pixels to the target print DPI.
 * e.g. 300 DPI on a 96 DPI screen = 3.125x
 */
export function dpiScaleFactor(printDpi: PrintDpi): number {
    return printDpi / SCREEN_DPI;
}

/**
 * Creates a new layer instance of the same type as the source layer, with a
 * cloned source. The original layer and its source are never touched.
 *
 * - TileLayer / VectorTileLayer / ImageLayer: new layer + cloned source
 * - VectorLayer: new layer sharing the same source (features are in memory,
 *   no tile cache to isolate)
 * - Unknown types: passed through as-is (safe fallback)
 */
function cloneLayer(layer: BaseLayer): BaseLayer {
    if (layer instanceof TileLayer) {
        const src = layer.getSource();
        const clonedSrc =
            src && typeof (src as any).clone === 'function' ? (src as any).clone() : src;
        return new TileLayer({
            source: clonedSrc,
            opacity: layer.getOpacity(),
            visible: layer.getVisible(),
            zIndex: layer.getZIndex(),
            minResolution: layer.getMinResolution(),
            maxResolution: layer.getMaxResolution()
        });
    }

    if (layer instanceof VectorTileLayer) {
        const src = layer.getSource();
        const clonedSrc =
            src && typeof (src as any).clone === 'function' ? (src as any).clone() : src;
        return new VectorTileLayer({
            source: clonedSrc,
            opacity: layer.getOpacity(),
            visible: layer.getVisible(),
            zIndex: layer.getZIndex(),
            minResolution: layer.getMinResolution(),
            maxResolution: layer.getMaxResolution(),
            style: (layer as any).getStyle?.()
        });
    }

    if (layer instanceof VectorLayer) {
        // Sharing source is safe — vector features live in memory, no tile cache.
        return new VectorLayer({
            source: layer.getSource() ?? undefined,
            opacity: layer.getOpacity(),
            visible: layer.getVisible(),
            zIndex: layer.getZIndex(),
            minResolution: layer.getMinResolution(),
            maxResolution: layer.getMaxResolution(),
            style: (layer as any).getStyle?.()
        });
    }

    if (layer instanceof ImageLayer) {
        const src = layer.getSource();
        const clonedSrc =
            src && typeof (src as any).clone === 'function' ? (src as any).clone() : src;
        return new ImageLayer({
            source: clonedSrc,
            opacity: layer.getOpacity(),
            visible: layer.getVisible(),
            zIndex: layer.getZIndex(),
            minResolution: layer.getMinResolution(),
            maxResolution: layer.getMaxResolution()
        });
    }

    // Unknown layer type — pass through. Won't affect the live map's sources.
    return layer;
}
/**
 * Default layer factory. Uses OL's built-in `source.clone()` on tile and image
 * sources to produce a fresh source with an empty tile cache. Vector sources
 * are shared since they hold features in memory and have no cache to isolate.
 */
export const defaultLayerFactory: LayerFactory = (sourceLayers) => sourceLayers.map(cloneLayer);

// Get all canvases from the openlayersmap
function compositeMapCanvases(map: Map): HTMLCanvasElement {
    const mapEl = map.getTargetElement() as HTMLElement;
    const canvases = mapEl.querySelectorAll<HTMLCanvasElement>('canvas');
    const first = canvases[0];

    const w = first?.width || mapEl.clientWidth;
    const h = first?.height || mapEl.clientHeight;

    const out = document.createElement('canvas');
    out.width = w;
    out.height = h;

    const ctx = out.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    canvases.forEach((c) => {
        if (c.width > 0 && c.height > 0) ctx.drawImage(c, 0, 0);
    });

    return out;
}

/** Snapshot the relevant view state from a map at a known-good moment. */
export function snapshotView(map: Map): ViewSnapshot {
    const view = map.getView();
    return {
        projection: view.getProjection(),
        center: view.getCenter()!,
        resolution: view.getResolution()!,
        rotation: view.getRotation()
    };
}

// Get scalebar element text and pixelwidth
export function computeScale(viewSnapshot: ViewSnapshot): ScaleInfo {
    const { projection, center, resolution } = viewSnapshot;

    const metersPerPx = getPointResolution(projection, resolution, center, 'm');
    const targetMeters = metersPerPx * 150;
    const magnitude = Math.pow(10, Math.floor(Math.log10(targetMeters)));

    let niceMeters = magnitude;
    for (const v of [1, 2, 5, 10]) {
        if (v * magnitude <= targetMeters) niceMeters = v * magnitude;
    }

    return {
        barWidthPx: niceMeters / metersPerPx,
        label: niceMeters >= 1000 ? `${niceMeters / 1000} km` : `${niceMeters} m`
    };
}

// Add elements to printing canvas
function drawOverlays(canvas: HTMLCanvasElement, snapshot: ViewSnapshot) {
    const w = canvas.width;
    const h = canvas.height;

    const ctx = canvas.getContext('2d')!;

    drawScaleBar(ctx, 24, h - 28, computeScale(snapshot));
    drawNorthArrow(ctx, w - 50, h - 50, 22, snapshot.rotation);
}

/**
 * Creates a hidden container at the exact print page dimensions and renders a
 * second OL Map into it. The view resolution is adjusted so the same geographic
 * centre fills the page at the correct zoom level relative to the source map.
 */
function createOffscreenMap(
    sourceMap: Map,
    pageWidth: number,
    pageHeight: number,
    layerFactory: LayerFactory
): { offscreen: Map; cleanup: () => void } {
    const sourceEl = sourceMap.getTargetElement() as HTMLElement;
    const sourceView = sourceMap.getView();

    // Scale factor between the screen viewport and the print page.
    // We use the smaller axis ratio so the map content fits without cropping.
    const scaleX = pageWidth / sourceEl.clientWidth;
    const scaleY = pageHeight / sourceEl.clientHeight;
    const scale = Math.max(scaleX, scaleY);

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-99999px';
    container.style.left = '-99999px';
    container.style.width = `${pageWidth}px`;
    container.style.height = `${pageHeight}px`;
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    const printLayers = layerFactory(sourceMap.getLayers().getArray());

    const offscreen = new Map({
        target: container,
        layers: printLayers,
        controls: [],
        interactions: [],
        pixelRatio: 1, // container is already in physical print pixels
        view: new View({
            projection: sourceView.getProjection(),
            center: sourceView.getCenter(),
            // Divide by scale so the same ground area fills the larger page.
            resolution: sourceView.getResolution()! / scale,
            rotation: sourceView.getRotation()
        })
    });

    return {
        offscreen,
        cleanup() {
            offscreen.getLayers().clear();
            offscreen.setTarget(undefined as unknown as string);
            offscreen.dispose();
            document.body.removeChild(container);
        }
    };
}
export interface CaptureOptions {
    printDpi?: PrintDpi;
    pageSize?: PageSize;
    orientation?: Orientation;
    layerFactory?: LayerFactory;
    outputFormat?: 'image/png' | 'image/jpeg' | 'image/webp';
}
// Capture map as image
export function captureMapImage(map: Map, options: CaptureOptions = {}): Promise<CaptureResult> {
    const {
        printDpi = 150,
        pageSize = 'a4',
        orientation = 'landscape',
        layerFactory = defaultLayerFactory,
        outputFormat = 'image/webp'
    } = options;
    return new Promise((resolve, reject) => {
        const { width: pageWidth, height: pageHeight } = getPagePixels(
            pageSize,
            orientation,
            printDpi
        );

        const viewSnapshot = snapshotView(map);

        const { offscreen, cleanup } = createOffscreenMap(map, pageWidth, pageHeight, layerFactory);

        offscreen.once('rendercomplete', () => {
            try {
                const canvas = compositeMapCanvases(offscreen);
                drawOverlays(canvas, viewSnapshot);

                canvas.toBlob((blob) => {
                    cleanup();
                    if (blob)
                        resolve({ blob, pageWidth, pageHeight, pageSize, printDpi, orientation });
                    else reject(new Error('toBlob() returned null'));
                }, outputFormat);
            } catch (err) {
                cleanup();
                reject(err);
            }
        });
        offscreen.renderSync();
    });
}
