<script lang="ts">
	import { Map } from 'ol';
	import { setContext, onMount, onDestroy, type Snippet } from 'svelte';
	import 'ol/ol.css';
	
  interface Props {
    map: Map;
    class?: string;
    wrapperClass?: string;
    children?: Snippet;
  }

  let {
    map,
    class: classNames = "w-full h-full",
    wrapperClass = "relative flex-1 min-h-0",
    children,
  }: Props = $props();
  
  setContext("olmap", () => map);

  let mapDiv: HTMLDivElement | undefined = $state(undefined);
  let mapID = `map-${crypto.randomUUID().split("-")[0]}`;

  onMount(() => {
    if (mapDiv) {
      map.setTarget(mapDiv);
    }
  });

  onDestroy(() => {
    map.setTarget(undefined);
  });

</script>

<div class={wrapperClass}>
  <div bind:this={mapDiv} id={mapID} class={classNames}>
    {@render children?.()}
  </div>
</div>