import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  decipher,
  encipher,
  decodeVarint,
  encodeVarint,
  encodeRuneName,
  decodeRuneName,
  formatSpacedName,
  parseSpacedName,
  minimumLengthAtHeight,
  nextRuneId,
  deltaRuneId,
  formatRuneId,
  simulateAllocation,
  analyzeSize,
  parseRawTransaction,
} from '../../packages/runes-tools/src/index.js';

describe('Shared Runes Core Conformance', () => {
  const vectorsPath = resolve(__dirname, '../../src/data/vectors/vectors.json');
  const vectors = JSON.parse(readFileSync(vectorsPath, 'utf8'));

  it('passes all 24 authoritative vectors exactly', () => {
    for (const vec of vectors) {
      const res = decipher(vec.scriptHex, vec.outputs);
      if (vec.expectedStatus === 'valid') {
        expect(res.cenotaph, `Vector ${vec.id} expected valid`).toBe(false);
        expect(res.notRunestone, `Vector ${vec.id} notRunestone`).toBeUndefined();
      } else if (vec.expectedStatus === 'cenotaph') {
        expect(res.cenotaph, `Vector ${vec.id} expected cenotaph`).toBe(true);
        expect(res.flaw, `Vector ${vec.id} flaw mismatch`).toBe(vec.flaw);
      } else if (vec.expectedStatus === 'not-runestone') {
        expect(res.notRunestone, `Vector ${vec.id} expected notRunestone`).toBeDefined();
      }
    }
  });

  describe('Varint encoding & decoding', () => {
    it('round trips integers', () => {
      const cases = [0n, 1n, 127n, 128n, 255n, 16383n, 16384n, 840000n, 2n ** 64n - 1n, 2n ** 128n - 2n];
      for (const val of cases) {
        const enc = encodeVarint(val);
        const dec = decodeVarint(enc);
        expect('value' in dec).toBe(true);
        if ('value' in dec) {
          expect(dec.value).toBe(val);
        }
      }
    });

    it('accepts non-minimal varint encodings', () => {
      const nonMinimalZero = new Uint8Array([0x80, 0x00]);
      const dec = decodeVarint(nonMinimalZero);
      expect('value' in dec).toBe(true);
      if ('value' in dec) {
        expect(dec.value).toBe(0n);
      }
    });

    it('detects overlong varints past 19 bytes', () => {
      const overlong = new Uint8Array(20).fill(0x80);
      const dec = decodeVarint(overlong);
      expect('error' in dec).toBe(true);
      if ('error' in dec) {
        expect(dec.error).toBe('Overlong');
      }
    });
  });

  describe('Rune Name encoding & decoding', () => {
    it('encodes and decodes names in modified base 26', () => {
      const names = ['A', 'B', 'Z', 'AA', 'AB', 'ZZ', 'UNCOMMONGOODS', 'BITCOINUNIVERSE'];
      for (const name of names) {
        const val = encodeRuneName(name);
        const dec = decodeRuneName(val);
        expect(dec).toBe(name);
      }
    });

    it('formats and parses spacers correctly', () => {
      const spaced = formatSpacedName(encodeRuneName('BITCOINUNIVERSE'), 64n);
      expect(spaced).toBe('BITCOIN•UNIVERSE');
      const parsed = parseSpacedName('BITCOIN•UNIVERSE');
      expect(parsed.name).toBe('BITCOINUNIVERSE');
      expect(parsed.spacers).toBe(64n);
    });

    it('evaluates name unlock schedule', () => {
      expect(minimumLengthAtHeight(839999)).toBe(Infinity);
      expect(minimumLengthAtHeight(840000)).toBe(13);
      expect(minimumLengthAtHeight(857500)).toBe(12);
      expect(minimumLengthAtHeight(1050000)).toBe(1);
    });
  });

  describe('RuneId delta encoding', () => {
    it('accumulates deltas accurately', () => {
      const id0 = { block: 0n, tx: 0 };
      const id1 = nextRuneId(id0, 840000n, 3n);
      expect(id1).toEqual({ block: 840000n, tx: 3 });

      const id2 = nextRuneId(id1!, 0n, 25n);
      expect(id2).toEqual({ block: 840000n, tx: 28 });

      const id3 = nextRuneId(id2!, 10n, 5n);
      expect(id3).toEqual({ block: 840010n, tx: 5 });
    });

    it('produces correct deltas for edicts', () => {
      const p1 = { block: 840000n, tx: 3 };
      const p2 = { block: 840000n, tx: 28 };
      const [bDelta, txDelta] = deltaRuneId(p1, p2)!;
      expect(bDelta).toBe(0n);
      expect(txDelta).toBe(25n);
    });
  });

  describe('Allocation Simulation', () => {
    it('conserves balance on standard transfer', () => {
      const res = simulateAllocation({
        numOutputs: 3,
        inputBalances: { '840000:3': 1500n },
        edicts: [{ id: { block: 840000n, tx: 3 }, amount: 1000n, output: 1 }],
        pointer: 0
      });
      expect(res.conserved).toBe(true);
      expect(res.outputs[1].balances['840000:3']).toBe(1000n);
      expect(res.outputs[0].balances['840000:3']).toBe(500n);
      expect(res.burns['840000:3'] || 0n).toBe(0n);
    });

    it('burns all balances on cenotaph', () => {
      const res = simulateAllocation({
        numOutputs: 2,
        inputBalances: { '840000:3': 2000n },
        isCenotaph: true,
        cenotaphFlaw: 'EdictOutput'
      });
      expect(res.conserved).toBe(true);
      expect(res.burns['840000:3']).toBe(2000n);
      expect(res.outputs[0].balances['840000:3'] || 0n).toBe(0n);
      expect(res.outputs[1].balances['840000:3'] || 0n).toBe(0n);
    });

    it('splits evenly across non-OP_RETURN outputs', () => {
      const res = simulateAllocation({
        numOutputs: 3,
        outputTypes: ['spendable', 'spendable', 'op_return'],
        inputBalances: { '840000:3': 1000n },
        edicts: [{ id: { block: 840000n, tx: 3 }, amount: 0n, output: 3 }] // Split
      });
      expect(res.conserved).toBe(true);
      expect(res.outputs[0].balances['840000:3']).toBe(500n);
      expect(res.outputs[1].balances['840000:3']).toBe(500n);
    });
  });

  describe('Encipher & Decipher Round Trip', () => {
    it('round trips valid mint with pointer', () => {
      const enc = encipher({
        mint: { block: 840000n, tx: 3 },
        pointer: 1
      });
      expect(enc.roundTripValid).toBe(true);
      expect(enc.roundTrip.mint).toEqual({ block: 840000n, tx: 3 });
      expect(enc.roundTrip.pointer).toBe(1);
    });

    it('round trips etching with edicts', () => {
      const enc = encipher({
        etching: {
          rune: 153272084900779274434n,
          divisibility: 2n,
          spacers: 64n,
          symbol: 9874n,
          premine: 1000000n,
          turbo: true,
          terms: {
            amount: 1000n,
            cap: 21000n,
            offsetEnd: 12960n
          }
        },
        edicts: [
          { id: { block: 0n, tx: 0 }, amount: 500000n, output: 1 }
        ]
      });
      expect(enc.roundTripValid).toBe(true);
      expect(enc.roundTrip.etching?.rune).toBe(153272084900779274434n);
      expect(enc.roundTrip.edicts.length).toBe(1);
      expect(enc.roundTrip.edicts[0].amount).toBe(500000n);
    });
  });
});
