/**
 * Platform build script
 */

import { execSync } from 'node:child_process';

console.log('--- Step 1: Building Packages ---');
execSync('npm run build -w @bitcoinuniverse/runes-tools', { stdio: 'inherit' });
execSync('npm run build -w @bitcoinuniverse/runes-docs-mcp', { stdio: 'inherit' });

console.log('--- Step 2: Generating Machine Data ---');
execSync('node scripts/generate-search-index.mjs', { stdio: 'inherit' });
execSync('node scripts/generate-llms-full.mjs', { stdio: 'inherit' });

console.log('--- Step 3: Building Astro Static Site ---');
execSync('npx astro build', { stdio: 'inherit' });

console.log('--- Step 4: Generating Markdown Mirrors ---');
execSync('node scripts/generate-markdown-mirrors.mjs', { stdio: 'inherit' });

console.log('--- Step 5: Packaging Offline Bundle ---');
execSync('node scripts/build-offline-pack.mjs', { stdio: 'inherit' });

console.log('\nPlatform build completed successfully!');
