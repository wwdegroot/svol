<script lang="ts">
    import { type Map } from 'ol';
    import { captureMapImage } from './printing-map.js';
    import {
        type PageSize,
        type Orientation,
        type PrintDpi,
        PAGE_OPTIONS,
        ORIENTATION_OPTIONS
    } from './constants.js';
    import { MapManager, MAPMANAGER_KEY } from '$lib/olmap/index.js';
    import { getContext } from 'svelte';

    const mapManager: MapManager = getContext(MAPMANAGER_KEY);

    interface Props {
        class?: string;
        printButtonText?: string;
        printUrl?: string | undefined;
        onlyImage?: boolean;
        onPdfReady?: ((blob: Blob) => void) | undefined;
    }
    let {
        class: ClassValue = 'flex flex-col bg-white p-2 rounded shadow gap-2',
        printButtonText = 'Print / Export',
        printUrl = undefined,
        onlyImage = false,
        onPdfReady = $bindable(undefined)
    }: Props = $props();
    const DPI_OPTIONS: { label: string; value: PrintDpi }[] = [
        { label: '96 dpi  — screen quality', value: 96 },
        { label: '150 dpi — draft print', value: 150 },
        { label: '300 dpi — press quality', value: 300 }
    ];
    let selectedDpi: PrintDpi = $state(150);
    let selectedFormat: PageSize = $state('a4');
    let selectedOrientation: Orientation = $state('landscape');
    let isCapturing = $state(false);
    let error = $state('');

    async function handlePrint() {
        isCapturing = true;

        try {
            const result = await captureMapImage(mapManager.map, {
                printDpi: selectedDpi,
                pageSize: selectedFormat,
                orientation: selectedOrientation
            });
            let blobData = result.blob;
            let downloadTitle = `map-export-${Date.now()}.png`;
            if (!onlyImage) {
                if (!printUrl) {
                    console.error('No Print url configured');
                    return;
                }
                const formData = new FormData();
                formData.append('map_image', result.blob, 'map.png');
                formData.append('page_width', String(result.pageWidth));
                formData.append('page_height', String(result.pageHeight));
                formData.append('print_dpi', String(result.printDpi));
                formData.append('page_size', result.pageSize);
                formData.append('orientation', result.orientation);

                const response = await fetch(printUrl, { method: 'POST', body: formData });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }

                blobData = await response.blob();
                downloadTitle = `map-export-${Date.now()}.pdf`;
                onPdfReady?.(blobData);
            }
            const url = URL.createObjectURL(blobData);
            const a = document.createElement('a');
            a.href = url;
            a.download = downloadTitle;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            error = err instanceof Error ? err.message : String(err);
        } finally {
            isCapturing = false;
        }
    }
</script>

<div class={ClassValue}>
    <div class="print-options">
        <div class="option-group">
            <label for="page-select">Page</label>
            <select id="page-select" bind:value={selectedFormat} disabled={isCapturing}>
                {#each PAGE_OPTIONS as opt}
                    <option value={opt.value}>{opt.label}</option>
                {/each}
            </select>
        </div>

        <div class="option-group">
            <label for="orientation-select">Orientation</label>
            <select id="orientation-select" bind:value={selectedOrientation} disabled={isCapturing}>
                {#each ORIENTATION_OPTIONS as opt}
                    <option value={opt.value}>{opt.label}</option>
                {/each}
            </select>
        </div>

        <div class="option-group">
            <label for="dpi-select">Quality</label>
            <select id="dpi-select" bind:value={selectedDpi} disabled={isCapturing}>
                {#each DPI_OPTIONS as opt}
                    <option value={opt.value}>{opt.label}</option>
                {/each}
            </select>
        </div>
    </div>
    <button
        class="print-btn"
        onclick={() => handlePrint()}
        disabled={isCapturing}
        title={printButtonText}
    >
        {#if isCapturing}
            <span class="spinner" aria-hidden="true"></span>
            Exporting...
        {:else}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path
                    d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
                />
                <rect x="6" y="14" width="12" height="8" />
            </svg>
            {printButtonText}
        {/if}
    </button>

    {#if error}
        <p class="print-error" role="alert">{error}</p>
    {/if}
</div>

<style>
    .option-group {
        display: flex;
        flex-direction: column;
        gap: 3px;
        flex: 1;
        min-width: 90px;
    }

    .option-group label {
        font-size: 11px;
        font-weight: 600;
        color: #636e72;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .map-print-control {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .dpi-label {
        font-size: 11px;
        font-weight: 600;
        color: #636e72;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .option-group select {
        padding: 6px 8px;
        border: 1px solid #b2bec3;
        border-radius: 6px;
        font-size: 13px;
        background: #fff;
        cursor: pointer;
        width: 100%;
    }

    .option-group select:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .print-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        background: #2d3436;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s;
    }

    .print-btn:hover:not(:disabled) {
        background: #1e272e;
    }
    .print-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .spinner {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .print-error {
        font-size: 12px;
        color: #d63031;
        margin: 0;
    }
</style>
