/**
 * Generates unified search-index.json for command center search
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));

function load(path) {
  return JSON.parse(readFileSync(resolve(__dir, '../src/data/', path), 'utf8'));
}

const rules = load('protocol/rules.json');
const tags = load('protocol/tags.json');
const flaws = load('protocol/flaws.json');
const glossary = load('protocol/glossary.json');
const vectors = load('vectors/vectors.json');
const cases = load('atlas/cases.json');
const tracks = load('courses/tracks.json');

const searchIndex = [];

// Pages
const pages = [
  { page: '', title: 'Overview & The UTXO Mental Model', where: 'Core Documentation', text: 'Runes protocol introduction, state machine, unallocated balance pool, edict routing, and ecosystem support matrix.', aliases: ['intro', 'home', 'overview'] },
  { page: 'specification.html', title: 'Normative Protocol Specification (R1–R47)', where: 'Specification', text: 'Numbered consensus specification rules R1 through R47, tag dictionaries, flag bitfields, and cenotaph flaws.', aliases: ['spec', 'consensus', 'rules'] },
  { page: 'reference.html', title: 'Implementer Reference', where: 'Reference', text: 'Indexer pipeline architecture, terms evaluation, confirmation maturity, reorg safety, and standard 83-byte relay limits.', aliases: ['reference', 'architecture', 'indexer'] },
  { page: 'guide.html', title: 'Step-by-Step Guide to Runes', where: 'Guide', text: 'Worked walkthroughs for transfers, multi-rune edicts, balance splits, open mints, etchings, and burns.', aliases: ['tutorial', 'how-to', 'guide'] },
  { page: 'vectors.html', title: 'Protocol Test Vectors (24 Cases)', where: 'Conformance', text: 'Authoritative test suite covering V1 through V8 valid runestones, C1 through C14 cenotaphs, and N1 through N2.', aliases: ['vectors', 'tests', 'conformance'] },
  { page: 'decoder.html', title: 'Standalone Runestone Decoder', where: 'Interactive Tools', text: 'Pure client-side script decoder with field-by-field dissection, payload inspection, and flaw reporting.', aliases: ['decoder', 'inspect', 'tool'] },
  { page: 'studio.html', title: 'Runestone Studio (8 Diagnostic Modes)', where: 'Interactive Tools', text: 'Visual composer, raw transaction parser, allocation simulator, byte scrubber, side-by-side compare, and autopsy.', aliases: ['studio', 'simulator', 'composer'] },
  { page: 'wizards/transfer.html', title: 'Transfer Safety Wizard', where: 'Safety Wizards', text: 'Interactive transfer planner with real-time cenotaph prevention and change protection.', aliases: ['transfer', 'send', 'change'] },
  { page: 'wizards/mint.html', title: 'Mint Readiness Wizard', where: 'Safety Wizards', text: 'Evaluate mint windows, cap exhaustion, and fee volatility before broadcasting a mint transaction.', aliases: ['mint', 'claim', 'window'] },
  { page: 'wizards/etch.html', title: 'Etching Planner', where: 'Safety Wizards', text: 'Plan an etching, calculate modified base-26 rune names, Taproot commitments, and 6-block maturity.', aliases: ['etch', 'create', 'deploy'] },
  { page: 'learn.html', title: 'Runes Learning Academy', where: 'Academy', text: '7 structured curriculum tracks with interactive quizzes and local progress tracking.', aliases: ['academy', 'learn', 'course'] },
  { page: 'atlas.html', title: 'Real Transaction Atlas (12 Case Studies)', where: 'Forensics', text: '12 verified Bitcoin mainnet transactions dissecting genesis etchings, multi-rune transfers, and cenotaph autopsies.', aliases: ['atlas', 'mainnet', 'forensics'] },
  { page: 'conformance.html', title: 'Conformance Center & Automated Testing', where: 'Conformance', text: 'Browser vector runner, CLI test commands, and differential assertions against ord 0.29.0.', aliases: ['runner', 'differential', 'vitest'] },
  { page: 'developers.html', title: 'Developer Hub & @bitcoinuniverse/runes-tools SDK', where: 'Developers', text: 'TypeScript SDK, 10 runnable quickstarts, architecture diagrams, and CLI commands.', aliases: ['sdk', 'quickstarts', 'api'] },
  { page: 'agents.html', title: 'Agent-Ready Documentation & MCP Server', where: 'Agents', text: 'Machine-readable documentation, llms.txt, Agent Skills, and local stdio MCP server with 17 tools.', aliases: ['mcp', 'agents', 'ai'] },
  { page: 'provenance.html', title: 'Source Provenance & Upstream Mapping', where: 'Authority', text: 'Traceability mapping every rule to Casey Rodarmor ord 0.29.0 commit 7e37a3b and Rust symbols.', aliases: ['provenance', 'ord', 'git'] },
  { page: 'versions.html', title: 'Documentation Versions & Upgrades', where: 'Versions', text: 'Version comparison between 2.0.0 and 3.0.0, and frozen archive access.', aliases: ['versions', 'archive', 'diff'] },
  { page: 'status.html', title: 'Platform & Conformance Status', where: 'Status', text: 'Real-time build status, 100% vector conformance metrics, and release SHA-256 checksums.', aliases: ['status', 'uptime', 'hashes'] },
  { page: 'offline.html', title: 'Offline Mode & PWA Installation', where: 'Offline', text: 'Progressive Web App installation guide and downloadable static offline documentation ZIP.', aliases: ['offline', 'pwa', 'zip'] },
  { page: 'changelog.html', title: 'Platform Changelog', where: 'History', text: 'Complete release history and protocol milestone calendar.', aliases: ['changelog', 'releases', 'history'] },
];

pages.forEach(p => searchIndex.push(p));

// Rules R1 through R47
rules.forEach(r => {
  searchIndex.push({
    page: 'specification.html',
    anchor: r.id.toLowerCase(),
    title: `${r.id}: ${r.title}`,
    where: `Specification Rule [${r.category}]`,
    text: r.text,
    aliases: [r.id, r.id.toLowerCase(), `rule ${r.id}`, r.ordSource]
  });
});

// Tags
tags.forEach(t => {
  searchIndex.push({
    page: 'specification.html',
    anchor: 'tags',
    title: `Tag ${t.tag}: ${t.name} (${t.parity})`,
    where: 'Tag Dictionary',
    text: `${t.description} Values: ${t.values}.`,
    aliases: [`tag ${t.tag}`, `tag${t.tag}`, t.name.toLowerCase()]
  });
});

// Flaws
flaws.forEach(f => {
  searchIndex.push({
    page: 'specification.html',
    anchor: 'cenotaphs',
    title: `Flaw: ${f.flaw}`,
    where: 'Cenotaph Flaws',
    text: `${f.condition} Controlling Rule: ${f.rule}. Consequence: Burns all input runes.`,
    aliases: [f.flaw.toLowerCase(), `flaw ${f.flaw}`, `cenotaph ${f.flaw}`]
  });
});

// Vectors
vectors.forEach(v => {
  searchIndex.push({
    page: 'vectors.html',
    anchor: v.id.toLowerCase(),
    title: `Vector ${v.id}: ${v.name}`,
    where: `Conformance Suite (${v.category})`,
    text: `Script Hex: ${v.scriptHex}. Expected: ${v.expectedSummary}`,
    aliases: [v.id, v.id.toLowerCase(), `vector ${v.id}`]
  });
});

// Atlas Cases
cases.forEach(c => {
  searchIndex.push({
    page: 'atlas.html',
    anchor: c.id.toLowerCase(),
    title: `${c.id}: ${c.title}`,
    where: `Transaction Atlas (${c.network})`,
    text: `Block ${c.blockHeight}. TxID: ${c.txid}. ${c.summary} Takeaway: ${c.takeaway}`,
    aliases: [c.id, c.id.toLowerCase(), c.txid]
  });
});

// Academy Tracks
tracks.forEach(t => {
  searchIndex.push({
    page: `learn/${t.slug}.html`,
    title: `Track ${t.order}: ${t.title}`,
    where: 'Learning Academy',
    text: `${t.audience}. ${t.outcomes}`,
    aliases: [`track ${t.order}`, t.slug]
  });
});

// Glossary
glossary.forEach(g => {
  searchIndex.push({
    page: 'reference.html',
    anchor: 'terms',
    title: g.term,
    where: 'Glossary Term',
    text: g.definition,
    aliases: g.aliases || []
  });
});

const outputPath = resolve(__dir, '../public/search-index.json');
writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2), 'utf8');
console.log(`Generated search-index.json with ${searchIndex.length} entries.`);
