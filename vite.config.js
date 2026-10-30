// Render setup for the exported kb (the export ships src/ only). `#lib/…` resolves via package.json "imports".
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook: import.meta.dirname + '/src/lib/layouts/runbook.svelte' } })],
      adapter: adapter(),
      inlineStyleThreshold: Infinity,
    }),
  ],
});
