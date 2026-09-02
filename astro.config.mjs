// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bitcoinuniverseio.github.io',
  base: '/runes/',
  trailingSlash: 'never',
  build: {
    format: 'file',
    assets: '_astro',
    inlineStylesheets: 'auto'
  },
  compressHTML: true
});
