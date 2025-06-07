<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import ChevronLeft from '$lib/components/ui/icons/ChevronLeft.svelte';
	import { type Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		expandTitle?: string;
		classNames?: string;
		icon?: Snippet;
		content?: Snippet;
	}

	let {
		open = $bindable(false),
		expandTitle = '',
		classNames = 'bg-white rounded shadow-sm',
		icon,
		content
	}: Props = $props();
</script>

<div class="transition-container">
	{#if !open}
		<div transition:fly={{ delay: 50, duration: 150, x: -200, opacity: 0.5, easing: quintOut }}>
			<button onclick={() => (open = !open)}>
				{@render icon?.()}
			</button>
		</div>
	{:else}
		<div
			class={twMerge(classNames)}
			transition:fly={{ delay: 50, duration: 150, x: -200, opacity: 0.5, easing: quintOut }}
		>
			<div class="flex flex-col">
				<div class="flex flex-row justify-end">
					<div class="pl-12 font-sans font-bold text-slate-700">
						{expandTitle}
					</div>
					<button class="flex flex-row-reverse justify-self-end" onclick={() => (open = !open)}>
						{@render icon?.()}
						<ChevronLeft width="2em" height="2em"></ChevronLeft>
					</button>
				</div>
				<div>
					{@render content?.()}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.transition-container {
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
	}

	.transition-container > * {
		grid-row: 1;
		grid-column: 1;
	}
</style>
