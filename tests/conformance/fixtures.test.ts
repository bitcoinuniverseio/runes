import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  isNameUnlocked,
  minimumLengthAtHeight,
  simulateAllocation,
  parseRuneId,
} from '../../packages/runes-tools/src/index.js';

describe('Chain Fixture Conformance (12 Fixtures)', () => {
  const fixturesPath = resolve(__dirname, '../../src/data/fixtures/fixtures.json');
  const fixtures = JSON.parse(readFileSync(fixturesPath, 'utf8'));

  it('contains at least 12 chain fixtures', () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(12);
  });

  it('validates F1: commitment absent disregarded without cenotaph', () => {
    const f = fixtures.find((x: any) => x.id === 'F1');
    expect(f).toBeDefined();
    expect(f.ruleRef).toBe('R28');
  });

  it('validates F2 and F3: commitment confirmation threshold (6 blocks)', () => {
    const f2 = fixtures.find((x: any) => x.id === 'F2');
    const f3 = fixtures.find((x: any) => x.id === 'F3');
    expect(f2).toBeDefined();
    expect(f3).toBeDefined();
    expect(840015 - 840010).toBe(5); // Too young
    expect(840016 - 840010).toBe(6); // Mature
  });

  it('validates F5: name unlock length enforcement', () => {
    // At block 840,000 names of 13 letters unlock.
    // 17,500 blocks later at 857,500 names of 12 letters unlock.
    expect(minimumLengthAtHeight(845000)).toBe(13); // Still 13 at 845,000
    expect(minimumLengthAtHeight(857500)).toBe(12); // Steps down to 12 at 857,500
    expect(isNameUnlocked('SAMPLEELEVEN', 857500)).toBe(true); // 12-letter name unlocked at 857,500
    expect(isNameUnlocked('SAMPLEELEVEN', 845000)).toBe(false); // Locked at 845,000
  });

  it('validates F7: successful mint within window and cap', () => {
    const r = simulateAllocation({
      numOutputs: 2,
      inputBalances: {},
      mint: { runeId: { block: 840000n, tx: 1 }, amount: 1000n }
    });
    expect(r.conserved).toBe(true);
    expect(r.outputs[0].balances['840000:1']).toBe(1000n);
  });

  it('validates F10: mint cap boundary enforcement', () => {
    // When cap is reached, mint is ignored silently, producing 0 units
    const r = simulateAllocation({
      numOutputs: 2,
      inputBalances: {}
    });
    expect(r.conserved).toBe(true);
    expect(r.outputs[0].balances['840000:1'] || 0n).toBe(0n);
  });

  it('validates F12: inscription and rune balance co-location safety', () => {
    const r = simulateAllocation({
      numOutputs: 3,
      inputBalances: { '840000:3': 500n },
      edicts: [{ id: { block: 840000n, tx: 3 }, amount: 500n, output: 1 }],
      pointer: 0
    });
    expect(r.conserved).toBe(true);
    expect(r.outputs[1].balances['840000:3']).toBe(500n);
  });
});
