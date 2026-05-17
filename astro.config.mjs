import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://j1ml1.github.io',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    sitemap()
  ],
});
