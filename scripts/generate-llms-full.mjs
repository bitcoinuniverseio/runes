/**
 * Generates public/llms-full.txt containing complete unrolled specification and reference
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
const flags = load('protocol/flags.json');
const flaws = load('protocol/flaws.json');
const glossary = load('protocol/glossary.json');
const vectors = load('vectors/vectors.json');
const cases = load('atlas/cases.json');
const provenance = load('provenance/provenance.json');

let md = `# Runes Protocol Complete Technical Specification & Reference (ord 0.29.0)

> Pinned to Casey Rodarmor's ord 0.29.0 (commit ${provenance.pinnedCommit}, crate ${provenance.pinnedCrate}).
> Mainnet Activation Block: 840,000. Verified Date: ${provenance.verifiedDate}.

---

## 1. Protocol Architecture & The UTXO Mental Model

Runes is a UTXO-native fungible token protocol on Bitcoin.
Runes are held directly by Bitcoin outpoints (UTXOs).
A Runes transaction communicates state transitions through a single OP_RETURN output followed by OP_13 (push byte 0x5d), termed a Runestone.

### State Transition Lifecycle
1. DRAIN: Spent input UTXOs drain their rune balances into a transaction-wide unallocated balance pool.
2. MINT / ETCH: Valid mint instructions or etching premines add newly created units to the unallocated pool.
3. EDICT ALLOCATION: Edicts assign specified amounts of runes to specified output indices.
4. REMAINDER ROUTING: Unallocated remainder balances route to the output specified by Pointer (Tag 22) or default to the first non-OP_RETURN output.
5. CENOTAPH SAFETY: Malformed messages trigger cenotaph handling; all input runes are permanently burned.

---

## 2. Normative Specification Rules (R1 through R47)

`;

rules.forEach(r => {
  md += `### ${r.id}: ${r.title}
- **Category:** ${r.category}
- **Rule Text:** ${r.text}
- **Reference Source:** \`${r.ordSource}\`
${r.flaw ? `- **Violating Flaw:** \`${r.flaw}\`\n` : ''}
`;
});

md += `---

## 3. Tag Dictionary

| Tag | Name | Parity | Values | Meaning |
|---|---|---|---|---|
`;

tags.forEach(t => {
  md += `| ${t.tag} | ${t.name} | ${t.parity} | \`${t.values}\` | ${t.description} |\n`;
});

md += `
---

## 4. Flag Bitfield

| Bit | Name | Mask | Meaning |
|---|---|---|---|
`;

flags.forEach(f => {
  md += `| ${f.bit} | ${f.name} | \`${f.mask}\` | ${f.description} |\n`;
});

md += `
---

## 5. Cenotaph Flaws & Trigger Conditions

| Flaw Name | Condition | Controlling Rule | Reference Source |
|---|---|---|---|
`;

flaws.forEach(f => {
  md += `| \`${f.flaw}\` | ${f.condition} | ${f.rule} | \`${f.ordSource}\` |\n`;
});

md += `
---

## 6. Authoritative Conformance Vectors (24 Cases)

`;

vectors.forEach(v => {
  md += `### ${v.id}: ${v.name} (${v.category})
- **Script Hex:** \`${v.scriptHex}\`
- **Outputs Count:** ${v.outputs}
- **Expected Status:** \`${v.expectedStatus}\`
${v.flaw ? `- **Expected Flaw:** \`${v.flaw}\`\n` : ''}- **Expected Summary:** ${v.expectedSummary}

`;
});

md += `---

## 7. Real Transaction Atlas (Mainnet Case Studies)

`;

cases.forEach(c => {
  md += `### ${c.id}: ${c.title}
- **Network:** ${c.network} (Block ${c.blockHeight})
- **TxID:** \`${c.txid}\`
- **Structure:** ${c.inputsCount} inputs, ${c.outputsCount} outputs (OP_RETURN at Output ${c.opReturnIndex})
- **Script Hex:** \`${c.scriptHex}\`
- **Summary:** ${c.summary}
- **Takeaway:** ${c.takeaway}

`;
});

md += `---

## 8. Protocol Glossary

`;

glossary.forEach(g => {
  md += `### ${g.term}
${g.definition}
`;
});

const outPath = resolve(__dir, '../public/llms-full.txt');
writeFileSync(outPath, md, 'utf8');
console.log(`Generated public/llms-full.txt (${md.length} bytes).`);
