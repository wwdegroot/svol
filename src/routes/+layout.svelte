<script>
    import '../app.css';
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<div class="flex items-center justify-start p-3 font-mono font-bold text-base/loose">
    SVOL <span class="text-gray-400">SvelteKit OpenLayers components</span>
</div>
{@render children?.()}
