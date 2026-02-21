// Type Definitions
export type PrintDpi = 96 | 150 | 300;
export type PageSize = 'a4' | 'a3';
export type Orientation = 'portrait' | 'landscape';
// Screen reference DPI. Browsers define 1 CSS px = 1/96 inch.
// TODO: Get this dynamically from the window or openlayers view?
export const SCREEN_DPI = 96;

export const PAGE_OPTIONS: { label: string; value: PageSize }[] = [
    { label: 'A4', value: 'a4' },
    { label: 'A3', value: 'a3' }
];

export const ORIENTATION_OPTIONS: { label: string; value: Orientation }[] = [
    { label: 'Portrait', value: 'portrait' },
    { label: 'Landscape', value: 'landscape' }
];
// ISO page dimensions in millimetres (width × height in portrait).
export const PAGE_MM: Record<PageSize, { w: number; h: number }> = {
    a4: { w: 210, h: 297 },
    a3: { w: 297, h: 420 }
};
