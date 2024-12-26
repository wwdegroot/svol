<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	export let width: string = '1em';
	export let height: string = '1em';
	export let classNames: string = 'fill-black';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{width}
	{height}
	viewBox="0 0 24 24"
	class={twMerge(classNames)}
	{...$$props}
>
	<path
		d="M14.71 6.71a.996.996 0 0 0-1.41 0L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59a.996.996 0 1 0 1.41-1.41L10.83 12l3.88-3.88c.39-.39.38-1.03 0-1.41"
	/>
</svg>
