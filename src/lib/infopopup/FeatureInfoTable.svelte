<script lang="ts">
    import type { FeatureLike } from 'ol/Feature.js';
    import Geometry from 'ol/geom/Geometry.js';

    interface Props {
        features: FeatureLike[] | undefined;
    }

    let { features }: Props = $props();

    const properties = $derived.by(() => {
        if (features === undefined) return [];
        let featureProps: Record<string, any>[] = features.map((feature) => {
            const allProperties = feature.getProperties();
            const props = Object.entries(allProperties).reduce(
                (acc, [key, value]) => {
                    const isInternal = key.startsWith('_') || key === 'ol_uid';
                    const isGeometry = key === 'geometry' || value instanceof Geometry;
                    const isFunction = typeof value === 'function';

                    if (!isInternal && !isGeometry && !isFunction) {
                        acc[key] = value;
                    }

                    return acc;
                },
                {} as Record<string, any>
            );
            return props;
        });
        return featureProps;
    });
</script>

{#if features}
    {#each properties as props}
        {#if Object.keys(props ?? {}).length > 0}
            <div class="flex gap-1 flex-col">
                <hr class="my-1" />
                {#each Object.entries(props ?? {}) as [key, value]}
                    <div class="grid grid-cols-12">
                        <span class="col-span-4 font-bold">{key}:</span>
                        <span class="col-span-8">{value}</span>
                    </div>
                {/each}
            </div>
        {:else}
            <p>No attribute data found.</p>
        {/if}
    {/each}
{/if}
