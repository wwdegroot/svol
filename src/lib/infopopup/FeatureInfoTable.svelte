<script lang="ts">
    import Geometry from 'ol/geom/Geometry.js';
    import type { SelectedFeature } from './types.js';

    interface Props {
        features: SelectedFeature[] | undefined;
        displayFieldConfig?: Record<string, Record<string, string>>;
    }

    let { features, displayFieldConfig = {} }: Props = $props();
    let currentIndex = $state(0);
    $effect(() => {
        if (features && currentIndex >= features.length) {
            currentIndex = 0;
        }
    });
    const currentFeature = $derived(features?.[currentIndex]);
    const totalFeatures = $derived(features?.length ?? 0);

    const displayProperties = $derived.by(() => {
        if (!currentFeature) return [];

        const layerTitle = currentFeature.layerTitle;
        const config = displayFieldConfig[layerTitle];

        const allProps = currentFeature.feature.getProperties();
        // No displayConfig is show everything without internal fields
        if (!config) {
            const properties = Object.entries(allProps).map(([key, value]) => {
                const isInternal = key.startsWith('_') || key === 'ol_uid';
                const isGeometry = key === 'geometry' || value instanceof Geometry;
                const isFunction = typeof value === 'function';
                if (!isInternal && !isGeometry && !isFunction) {
                    return {
                        label: key,
                        value: value
                    };
                }
            });
            return properties;
        } else {
            // Map the config keys to their actual values from the feature
            const properties = Object.entries(config).map(([key, displayName]) => {
                return {
                    label: displayName,
                    value: allProps[key] ?? '-'
                };
            });

            return properties;
        }
    });

    function next() {
        if (currentIndex < totalFeatures - 1) currentIndex++;
    }

    function prev() {
        if (currentIndex > 0) currentIndex--;
    }
</script>

{#if features && features.length > 0}
    <div class="flex items-center justify-between bg-slate-100 p-2 rounded mb-4 shadow-sm">
        <button
            onclick={prev}
            disabled={currentIndex === 0}
            class="px-3 py-1 bg-white border rounded disabled:opacity-30 hover:bg-gray-50"
        >
            &larr;
        </button>

        <div class="flex flex-col items-center">
            <span class="text-xs font-bold uppercase text-blue-600">
                {currentFeature?.layerTitle}
            </span>
            <span class="text-sm font-medium">
                {currentIndex + 1} of {totalFeatures}
            </span>
        </div>

        <button
            onclick={next}
            disabled={currentIndex === totalFeatures - 1}
            class="px-3 py-1 bg-white border rounded disabled:opacity-30 hover:bg-gray-50"
        >
            &rarr;
        </button>
    </div>

    {#if displayProperties.length > 0}
        <div class="flex gap-1 flex-col">
            {#each displayProperties as field}
                {#if field?.label}
                    <div class="flex flex-row py-1.5 border-b border-gray-100 last:border-0">
                        <div
                            class="w-32 font-semibold break-normal shrink-0 text-slate-600 text-sm"
                        >
                            {field.label}:
                        </div>
                        <div class="flex-1 max-w-96 wrap-break-word text-sm text-slate-900">
                            {field.value}
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    {:else}
        <div class="p-4 text-center border-2 border-dashed rounded border-slate-200">
            <p class="text-slate-500 text-sm">
                No displayable attributes configured for this layer.
            </p>
        </div>
    {/if}
{:else}
    <div class="p-4 text-center text-slate-400 italic">No features selected.</div>
{/if}
