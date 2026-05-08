import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
    plugins: [sveltekit(), svelteTesting(), tailwindcss()],
    optimizeDeps: {
        include: ['@lucide/svelte']
    },
    test: {
        include: ['**/*.{test,spec}.{js,ts}'],
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts']
    }
});
