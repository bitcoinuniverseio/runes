/**
 * Content, Schema, Style, and Link Integrity Validator
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dir, '..');
const distDir = resolve(rootDir, 'dist');
const dataDir = resolve(rootDir, 'src/data');

let totalChecks = 0;
let errors = [];

function check(desc, fn) {
  totalChecks++;
  try {
    fn();
  } catch (err) {
    errors.push(`[FAIL] ${desc}: ${err.message}`);
  }
}

console.log('--- Step 1: Forbidden Words and Character Audits ---');

// Audit em dashes and forbidden word across all source files, documentation, and data
function scanDirectory(dir, filterExts) {
  const results = [];
  const entries = readdirSync(dir);
  for (const e of entries) {
    if (e === 'node_modules' || e === '.git' || e === 'dist' || e === 'legacy-2.0.0') continue;
    const full = join(dir, e);
    const st = statSync(full);
    if (st.isDirectory()) {
      results.push(...scanDirectory(full, filterExts));
    } else if (st.isFile()) {
      const ext = extname(e);
      if (filterExts.includes(ext)) {
        results.push(full);
      }
    }
  }
  return results;
}

const sourceFiles = scanDirectory(rootDir, ['.ts', '.js', '.mjs', '.json', '.astro', '.md', '.css', '.txt']);

// Em dash character (\u2014) is strictly forbidden everywhere by workspace AGENTS.md
check('Zero em dashes across all files', () => {
  const emDash = '\u2014';
  const violations = [];
  for (const f of sourceFiles) {
    const content = readFileSync(f, 'utf8');
    if (content.includes(emDash)) {
      violations.push(f);
    }
  }
  if (violations.length > 0) {
    throw new Error(`Found em dash character (\\u2014) in ${violations.length} files:\n${violations.slice(0, 5).join('\n')}`);
  }
});

// The word "c-a-n-o-n-i-c-a-l" is strictly forbidden by workspace AGENTS.md
// (We check case-insensitive match for the forbidden word)
check('Zero forbidden word occurrences across all files', () => {
  const forbidden = ['c', 'a', 'n', 'o', 'n', 'i', 'c', 'a', 'l'].join('');
  const regex = new RegExp(`\\b${forbidden}\\b`, 'i');
  const violations = [];
  for (const f of sourceFiles) {
    // Skip this check script itself
    if (f.endsWith('check-content.mjs')) continue;
    const content = readFileSync(f, 'utf8');
    if (regex.test(content)) {
      violations.push(f);
    }
  }
  if (violations.length > 0) {
    throw new Error(`Found forbidden word "${forbidden}" in ${violations.length} files:\n${violations.slice(0, 5).join('\n')}`);
  }
});

console.log('--- Step 2: Protocol JSON Schemas and Integrity ---');

function loadJson(rel) {
  return JSON.parse(readFileSync(resolve(dataDir, rel), 'utf8'));
}

check('rules.json has 47 complete rules R1 through R47', () => {
  const rules = loadJson('protocol/rules.json');
  if (rules.length !== 47) throw new Error(`Expected 47 rules, got ${rules.length}`);
  for (let i = 1; i <= 47; i++) {
    const expectedId = `R${i}`;
    const found = rules.find(r => r.id === expectedId);
    if (!found) throw new Error(`Missing rule ${expectedId}`);
    if (!found.title || !found.text || !found.ordSource) {
      throw new Error(`Rule ${expectedId} missing required fields`);
    }
  }
});

check('vectors.json has all 24 test vectors (V1-V8, C1-C14, N1-N2)', () => {
  const vectors = loadJson('vectors/vectors.json');
  if (vectors.length !== 24) throw new Error(`Expected 24 vectors, got ${vectors.length}`);
  const expectedIds = [
    'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8',
    'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14',
    'N1', 'N2'
  ];
  for (const id of expectedIds) {
    const found = vectors.find(v => v.id === id);
    if (!found) throw new Error(`Missing vector ${id}`);
    if (!found.scriptHex || !found.expectedStatus) {
      throw new Error(`Vector ${id} missing scriptHex or expectedStatus`);
    }
  }
});

check('flaws.json contains all 10 ord flaws', () => {
  const flaws = loadJson('protocol/flaws.json');
  if (flaws.length !== 10) throw new Error(`Expected 10 flaws, got ${flaws.length}`);
});

check('cases.json contains 12 transaction cases including 8 mainnet', () => {
  const cases = loadJson('atlas/cases.json');
  if (cases.length < 12) throw new Error(`Expected at least 12 cases, got ${cases.length}`);
  const mainnetCases = cases.filter(c => c.network === 'mainnet');
  if (mainnetCases.length < 8) throw new Error(`Expected at least 8 mainnet cases, got ${mainnetCases.length}`);
});

check('tracks.json contains 7 curriculum tracks', () => {
  const tracks = loadJson('courses/tracks.json');
  if (tracks.length !== 7) throw new Error(`Expected 7 tracks, got ${tracks.length}`);
  for (const t of tracks) {
    if (!t.lessons || t.lessons.length === 0) throw new Error(`Track ${t.id} has no lessons`);
    if (!t.quiz || t.quiz.length === 0) throw new Error(`Track ${t.id} has no quiz questions`);
  }
});

check('provenance.json references pinned commit 7e37a3b', () => {
  const prov = loadJson('provenance/provenance.json');
  if (prov.pinnedVersion !== '0.29.0') throw new Error(`Invalid pinnedVersion: ${prov.pinnedVersion}`);
  if (!prov.pinnedCommit.startsWith('7e37a3b')) throw new Error(`Invalid pinnedCommit: ${prov.pinnedCommit}`);
  if (prov.records.length < 47) throw new Error(`Expected at least 47 provenance records, got ${prov.records.length}`);
});

console.log('--- Step 3: Dist Link and Anchor Integrity ---');

check('All expected static HTML files exist in dist', () => {
  const expectedPages = [
    'index.html',
    'specification.html',
    'reference.html',
    'guide.html',
    'vectors.html',
    'decoder.html',
    'studio.html',
    'atlas.html',
    'conformance.html',
    'developers.html',
    'agents.html',
    'provenance.html',
    'versions.html',
    'status.html',
    'offline.html',
    'changelog.html',
    '404.html',
    'learn.html',
    'learn/basics.html',
    'learn/inspect.html',
    'learn/transfer.html',
    'learn/mint.html',
    'learn/etch.html',
    'learn/developers.html',
    'learn/indexers.html',
    'wizards/transfer.html',
    'wizards/mint.html',
    'wizards/etch.html',
  ];

  for (const p of expectedPages) {
    const full = resolve(distDir, p);
    if (!existsSync(full)) {
      throw new Error(`Missing expected dist file: ${p}`);
    }
  }
});

check('Specification anchors #r1 through #r47 exist in dist/specification.html', () => {
  const specHtml = readFileSync(resolve(distDir, 'specification.html'), 'utf8');
  for (let i = 1; i <= 47; i++) {
    const expectedId = `id="r${i}"`;
    if (!specHtml.includes(expectedId)) {
      throw new Error(`Missing anchor id="r${i}" in dist/specification.html`);
    }
  }
});

check('Vectors anchors #v1..#v8, #c1..#c14, #n1..#n2 exist in dist/vectors.html', () => {
  const vecHtml = readFileSync(resolve(distDir, 'vectors.html'), 'utf8');
  const ids = [
    'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8',
    'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14',
    'n1', 'n2'
  ];
  for (const id of ids) {
    const expectedId = `id="${id}"`;
    if (!vecHtml.includes(expectedId)) {
      throw new Error(`Missing anchor id="${id}" in dist/vectors.html`);
    }
  }
});

check('Frozen v2.0.0 archive exists in dist/versions/2.0.0/index.html', () => {
  const frozen = resolve(distDir, 'versions/2.0.0/index.html');
  if (!existsSync(frozen)) {
    throw new Error('Missing frozen v2.0.0 archive in dist/versions/2.0.0/index.html');
  }
});

console.log('--- Step 4: Machine Manifests and Agent Endpoints ---');

check('Machine endpoints exist in dist', () => {
  const files = ['llms.txt', 'llms-full.txt', 'skill.md', 'search-index.json', 'docs.manifest.json', 'sw.js', 'manifest.webmanifest'];
  for (const f of files) {
    const full = resolve(distDir, f);
    if (!existsSync(full)) {
      throw new Error(`Missing machine endpoint: ${f}`);
    }
  }
});

if (errors.length > 0) {
  console.error(`\nValidation FAILED with ${errors.length} error(s):`);
  errors.forEach(e => console.error(e));
  process.exit(1);
} else {
  console.log(`\nAll ${totalChecks} content, schema, style, and anchor checks PASSED with 0 errors!`);
}
