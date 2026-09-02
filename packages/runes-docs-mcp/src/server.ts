#!/usr/bin/env node
/**
 * Standard stdio Model Context Protocol (MCP) server for Runes Documentation Platform
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as readline from 'node:readline';

import {
  decipher,
  encipher,
  parseRawTransaction,
  simulateAllocation,
  analyzeSize,
  parseHex,
  FLAWS,
  TAG_NAMES,
  decodeRuneName,
  formatSpacedName,
  parseSpacedName,
  formatRuneId,
  parseRuneId,
} from '@bitcoinuniverse/runes-tools';

const __dir = dirname(fileURLToPath(import.meta.url));

function loadJson(relPath: string): any {
  // Check relative to src or root
  const candidates = [
    resolve(__dir, '../../../src/data/', relPath),
    resolve(__dir, '../../src/data/', relPath),
    resolve(__dir, '../src/data/', relPath),
  ];
  for (const c of candidates) {
    if (existsSync(c)) {
      return JSON.parse(readFileSync(c, 'utf8'));
    }
  }
  return [];
}

const rulesData = loadJson('protocol/rules.json');
const tagsData = loadJson('protocol/tags.json');
const flawsData = loadJson('protocol/flaws.json');
const glossaryData = loadJson('protocol/glossary.json');
const vectorsData = loadJson('vectors/vectors.json');
const fixturesData = loadJson('fixtures/fixtures.json');
const casesData = loadJson('atlas/cases.json');
const provenanceData = loadJson('provenance/provenance.json');

const TOOLS = [
  {
    name: 'get_rule',
    description: 'Retrieves authoritative specification text, ord source file, and flaw triggers for any rule (R1 through R47).',
    inputSchema: {
      type: 'object',
      properties: {
        ruleId: { type: 'string', description: 'Rule ID, e.g. "R1", "R27", "R45"' }
      },
      required: ['ruleId']
    }
  },
  {
    name: 'get_tag',
    description: 'Returns tag definitions, parity, expected value range, and behavior.',
    inputSchema: {
      type: 'object',
      properties: {
        tag: { type: 'number', description: 'Tag number (0 to 127), e.g. 0, 2, 4, 20, 22' }
      },
      required: ['tag']
    }
  },
  {
    name: 'get_flaw',
    description: 'Explains a cenotaph flaw, trigger conditions, controlling rule, and burn consequence.',
    inputSchema: {
      type: 'object',
      properties: {
        flawName: { type: 'string', description: 'Flaw name, e.g. "Opcode", "Varint", "UnrecognizedEvenTag", "SupplyOverflow"' }
      },
      required: ['flawName']
    }
  },
  {
    name: 'get_vector',
    description: 'Retrieves conformance test vector details, script hex, and expected decoding.',
    inputSchema: {
      type: 'object',
      properties: {
        vectorId: { type: 'string', description: 'Vector ID, e.g. "V1", "V8", "C7", "N1"' }
      },
      required: ['vectorId']
    }
  },
  {
    name: 'get_fixture',
    description: 'Returns chain-level fixture details and consensus assertions.',
    inputSchema: {
      type: 'object',
      properties: {
        fixtureId: { type: 'string', description: 'Fixture ID, e.g. "F1", "F5", "F12"' }
      },
      required: ['fixtureId']
    }
  },
  {
    name: 'get_case',
    description: 'Fetches real transaction atlas case studies from Bitcoin mainnet.',
    inputSchema: {
      type: 'object',
      properties: {
        caseId: { type: 'string', description: 'Case ID, e.g. "CASE-01", "CASE-08"' }
      },
      required: ['caseId']
    }
  },
  {
    name: 'get_glossary_term',
    description: 'Retrieves authoritative definition and rule citations for protocol terms.',
    inputSchema: {
      type: 'object',
      properties: {
        term: { type: 'string', description: 'Protocol term, e.g. "Runestone", "Cenotaph", "Edict", "Spacers"' }
      },
      required: ['term']
    }
  },
  {
    name: 'decode_script',
    description: 'Deciphers raw OP_RETURN script hex into structured Runestone fields and checks for cenotaph flaws.',
    inputSchema: {
      type: 'object',
      properties: {
        scriptHex: { type: 'string', description: 'Hex encoded OP_RETURN script' },
        outputs: { type: 'number', description: 'Optional transaction output count for range checks' }
      },
      required: ['scriptHex']
    }
  },
  {
    name: 'encode_runestone',
    description: 'Enciphers structured fields (etching, mint, pointer, edicts) into minimal OP_RETURN script hex.',
    inputSchema: {
      type: 'object',
      properties: {
        etching: { type: 'object', description: 'Optional etching parameters' },
        mint: { type: 'object', description: 'Optional mint target { block, tx }' },
        pointer: { type: 'number', description: 'Optional pointer output index' },
        edicts: { type: 'array', description: 'Optional array of { id: { block, tx }, amount, output }' }
      }
    }
  },
  {
    name: 'inspect_raw_transaction',
    description: 'Parses raw serialized Bitcoin transaction hex, extracts inputs/outputs, and deciphers candidate runestones.',
    inputSchema: {
      type: 'object',
      properties: {
        rawTxHex: { type: 'string', description: 'Raw Bitcoin transaction hex' }
      },
      required: ['rawTxHex']
    }
  },
  {
    name: 'simulate_allocation',
    description: 'Simulates deterministic state machine balance transitions across transaction outputs.',
    inputSchema: {
      type: 'object',
      properties: {
        numOutputs: { type: 'number', description: 'Total output count' },
        inputBalances: { type: 'object', description: 'Map of "block:tx" -> amount' },
        edicts: { type: 'array', description: 'Array of edict objects' },
        pointer: { type: 'number', description: 'Pointer output index' }
      },
      required: ['numOutputs', 'inputBalances']
    }
  },
  {
    name: 'analyze_size',
    description: 'Audits script byte size against standard Bitcoin Core relay limits (83 bytes).',
    inputSchema: {
      type: 'object',
      properties: {
        scriptHex: { type: 'string', description: 'Script hex to evaluate' }
      },
      required: ['scriptHex']
    }
  },
  {
    name: 'explain_bytes',
    description: 'Dissects raw OP_RETURN hex byte-by-byte with technical annotations.',
    inputSchema: {
      type: 'object',
      properties: {
        scriptHex: { type: 'string', description: 'Script hex to dissect' }
      },
      required: ['scriptHex']
    }
  },
  {
    name: 'compare_runestones',
    description: 'Diffs two runestone script payloads side-by-side.',
    inputSchema: {
      type: 'object',
      properties: {
        scriptA: { type: 'string', description: 'First script hex' },
        scriptB: { type: 'string', description: 'Second script hex' }
      },
      required: ['scriptA', 'scriptB']
    }
  },
  {
    name: 'run_conformance',
    description: 'Executes all 24 authoritative vectors and returns execution statistics.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'query_protocol',
    description: 'Searches across rules, flaws, vectors, and documentation using keyword queries.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term or question' }
      },
      required: ['query']
    }
  },
  {
    name: 'get_provenance',
    description: 'Returns upstream ord source commit, file mapping, and reference test locations.',
    inputSchema: {
      type: 'object',
      properties: {
        ruleId: { type: 'string', description: 'Optional Rule ID' }
      }
    }
  }
];

function handleToolCall(name: string, args: any): any {
  switch (name) {
    case 'get_rule': {
      const q = String(args.ruleId).toUpperCase().trim();
      const r = rulesData.find((x: any) => x.id === q);
      return r || { error: `Rule ${args.ruleId} not found.` };
    }
    case 'get_tag': {
      const t = tagsData.find((x: any) => x.tag === Number(args.tag));
      return t || { error: `Tag ${args.tag} not found.` };
    }
    case 'get_flaw': {
      const q = String(args.flawName).toLowerCase().trim();
      const f = flawsData.find((x: any) => x.flaw.toLowerCase() === q);
      return f || { error: `Flaw ${args.flawName} not found.` };
    }
    case 'get_vector': {
      const q = String(args.vectorId).toUpperCase().trim();
      const v = vectorsData.find((x: any) => x.id === q);
      return v || { error: `Vector ${args.vectorId} not found.` };
    }
    case 'get_fixture': {
      const q = String(args.fixtureId).toUpperCase().trim();
      const f = fixturesData.find((x: any) => x.id === q);
      return f || { error: `Fixture ${args.fixtureId} not found.` };
    }
    case 'get_case': {
      const q = String(args.caseId).toUpperCase().trim();
      const c = casesData.find((x: any) => x.id === q);
      return c || { error: `Case ${args.caseId} not found.` };
    }
    case 'get_glossary_term': {
      const q = String(args.term).toLowerCase().trim();
      const g = glossaryData.find((x: any) => x.term.toLowerCase() === q || (x.aliases && x.aliases.map((a: string) => a.toLowerCase()).includes(q)));
      return g || { error: `Glossary term ${args.term} not found.` };
    }
    case 'decode_script': {
      const res = decipher(args.scriptHex, args.outputs ?? null);
      return JSON.parse(JSON.stringify(res, (_k, v) => typeof v === 'bigint' ? v.toString() : v));
    }
    case 'encode_runestone': {
      const input: any = {};
      if (args.etching) {
        input.etching = {
          rune: args.etching.rune ? BigInt(args.etching.rune) : undefined,
          divisibility: args.etching.divisibility !== undefined ? BigInt(args.etching.divisibility) : undefined,
          spacers: args.etching.spacers !== undefined ? BigInt(args.etching.spacers) : undefined,
          symbol: args.etching.symbol !== undefined ? BigInt(args.etching.symbol) : undefined,
          premine: args.etching.premine !== undefined ? BigInt(args.etching.premine) : undefined,
          turbo: args.etching.turbo,
        };
      }
      if (args.mint) {
        input.mint = { block: BigInt(args.mint.block), tx: Number(args.mint.tx) };
      }
      if (args.pointer !== undefined) input.pointer = Number(args.pointer);
      if (args.edicts) {
        input.edicts = args.edicts.map((e: any) => ({
          id: { block: BigInt(e.id.block), tx: Number(e.id.tx) },
          amount: BigInt(e.amount),
          output: Number(e.output)
        }));
      }
      const res = encipher(input);
      return {
        scriptHex: res.scriptHex,
        payloadHex: res.payloadHex,
        integers: res.integers.map(String),
        roundTripValid: res.roundTripValid
      };
    }
    case 'inspect_raw_transaction': {
      const res = parseRawTransaction(args.rawTxHex);
      return JSON.parse(JSON.stringify(res, (_k, v) => typeof v === 'bigint' ? v.toString() : v));
    }
    case 'simulate_allocation': {
      const inputBalances: Record<string, bigint> = {};
      for (const [k, v] of Object.entries(args.inputBalances || {})) {
        inputBalances[k] = BigInt(v as any);
      }
      const edicts = (args.edicts || []).map((e: any) => ({
        id: { block: BigInt(e.id.block), tx: Number(e.id.tx) },
        amount: BigInt(e.amount),
        output: Number(e.output)
      }));
      const res = simulateAllocation({
        numOutputs: Number(args.numOutputs),
        inputBalances,
        edicts,
        pointer: args.pointer !== undefined ? Number(args.pointer) : null
      });
      return JSON.parse(JSON.stringify(res, (_k, v) => typeof v === 'bigint' ? v.toString() : v));
    }
    case 'analyze_size': {
      const parsed = parseHex(args.scriptHex);
      if ('error' in parsed) return { error: parsed.error };
      const res = analyzeSize(parsed.bytes, parsed.bytes.subarray(2), 1);
      return res;
    }
    case 'explain_bytes': {
      const clean = args.scriptHex.replace(/\s+/g, '');
      const bytes: any[] = [];
      for (let i = 0; i < clean.length; i += 2) {
        const hex = clean.substring(i, i + 2);
        let note = `Offset ${i / 2}`;
        if (i === 0 && hex.toLowerCase() === '6a') note = 'OP_RETURN (0x6a)';
        else if (i === 2 && hex.toLowerCase() === '5d') note = 'OP_13 (0x5d) Protocol ID';
        bytes.push({ offset: i / 2, hex, note });
      }
      return { totalBytes: clean.length / 2, bytes };
    }
    case 'compare_runestones': {
      const resA = decipher(args.scriptA);
      const resB = decipher(args.scriptB);
      return {
        scriptA: { cenotaph: resA.cenotaph, flaw: resA.flaw, edictsCount: resA.edicts.length },
        scriptB: { cenotaph: resB.cenotaph, flaw: resB.flaw, edictsCount: resB.edicts.length },
        identicalHex: args.scriptA.trim().toLowerCase() === args.scriptB.trim().toLowerCase()
      };
    }
    case 'run_conformance': {
      let passed = 0;
      let failed = 0;
      for (const vec of vectorsData) {
        const res = decipher(vec.scriptHex, vec.outputs);
        let ok = false;
        if (vec.expectedStatus === 'valid' && !res.cenotaph && !res.notRunestone) ok = true;
        else if (vec.expectedStatus === 'cenotaph' && res.cenotaph && res.flaw === vec.flaw) ok = true;
        else if (vec.expectedStatus === 'not-runestone' && res.notRunestone) ok = true;
        if (ok) passed++; else failed++;
      }
      return { total: vectorsData.length, passed, failed, rate: `${Math.round((passed / vectorsData.length) * 100)}%` };
    }
    case 'query_protocol': {
      const q = String(args.query).toLowerCase().trim();
      const matchedRules = rulesData.filter((r: any) => r.title.toLowerCase().includes(q) || r.text.toLowerCase().includes(q)).slice(0, 5);
      const matchedFlaws = flawsData.filter((f: any) => f.flaw.toLowerCase().includes(q) || f.condition.toLowerCase().includes(q));
      return { query: q, matchedRules, matchedFlaws };
    }
    case 'get_provenance': {
      if (args.ruleId) {
        const q = String(args.ruleId).toUpperCase().trim();
        const r = provenanceData.records.find((x: any) => x.ruleId === q);
        return r || { error: `Provenance for ${args.ruleId} not found.` };
      }
      return provenanceData;
    }
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const msg = JSON.parse(line);
    const id = msg.id;

    if (msg.method === 'initialize') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          serverInfo: {
            name: '@bitcoinuniverse/runes-docs-mcp',
            version: '3.0.0'
          },
          capabilities: {
            tools: {}
          }
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (msg.method === 'notifications/initialized') {
      // no response needed
    } else if (msg.method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          tools: TOOLS
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (msg.method === 'tools/call') {
      const toolName = msg.params?.name;
      const toolArgs = msg.params?.arguments || {};
      const resultData = handleToolCall(toolName, toolArgs);
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(resultData, null, 2)
            }
          ]
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (msg.method === 'ping') {
      process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result: {} }) + '\n');
    } else {
      process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } }) + '\n');
    }
  } catch (err: any) {
    process.stderr.write(`MCP Server parse error: ${err.message}\n`);
  }
});
