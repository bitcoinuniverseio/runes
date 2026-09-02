import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { decipher } from '../../packages/runes-tools/src/index.js';

describe('Vector Conformance Test Suite (24 vectors)', () => {
  const vectorsPath = resolve(__dirname, '../../src/data/vectors/vectors.json');
  const vectors = JSON.parse(readFileSync(vectorsPath, 'utf8'));

  for (const vec of vectors) {
    it(`Vector ${vec.id}: ${vec.name} (${vec.expectedStatus})`, () => {
      const res = decipher(vec.scriptHex, vec.outputs);
      if (vec.expectedStatus === 'valid') {
        expect(res.cenotaph).toBe(false);
        expect(res.flaw).toBeNull();
        expect(res.notRunestone).toBeUndefined();
      } else if (vec.expectedStatus === 'cenotaph') {
        expect(res.cenotaph).toBe(true);
        expect(res.flaw).toBe(vec.flaw);
      } else if (vec.expectedStatus === 'not-runestone') {
        expect(res.notRunestone).toBeDefined();
      }
    });
  }
});
