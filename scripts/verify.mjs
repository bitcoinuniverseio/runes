/**
 * Unified verification script for Runes Documentation Platform 3.0
 */

import { execSync } from 'node:child_process';

console.log('=== RUNES DOCUMENTATION PLATFORM 3.0 VERIFICATION ===\n');

console.log('1. Running Unit Tests...');
execSync('npm run test:unit', { stdio: 'inherit' });

console.log('\n2. Running Conformance Vectors (24 Cases) & Differential Tests...');
execSync('npm run test:conformance', { stdio: 'inherit' });

console.log('\n3. Validating Content, Schemas, Em Dashes, and Anchors...');
execSync('node scripts/check-content.mjs', { stdio: 'inherit' });

console.log('\n4. Executing Platform Production Build...');
execSync('node scripts/build.mjs', { stdio: 'inherit' });

console.log('\nALL VERIFICATION CHECKS PASSED (100% SUCCESS)');
