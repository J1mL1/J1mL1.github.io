import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://j1ml1.github.io',
  integrations: [
    tailwind(),
    react(),
    sitemap()
  ],
});
