import { describe, it, expect } from 'vitest';
import {
  decipher,
  encipher,
  decodeVarint,
  encodeVarint,
  FLAWS,
  TAG_NAMES,
  Tag,
  Flag,
  MAX_DIVISIBILITY,
  MAX_SPACERS,
  U128_MAX,
} from '../../packages/runes-tools/src/index.js';

describe('Differential Checks Against Pinned ord 0.29.0', () => {
  it('matches all 10 ord cenotaph flaws exactly', () => {
    const expectedFlaws = [
      'Opcode',
      'InvalidScript',
      'Varint',
      'TruncatedField',
      'TrailingIntegers',
      'UnrecognizedEvenTag',
      'UnrecognizedFlag',
      'SupplyOverflow',
      'EdictRuneId',
      'EdictOutput',
    ];
    for (const f of expectedFlaws) {
      expect(FLAWS[f as keyof typeof FLAWS]).toBeDefined();
    }
    expect(Object.keys(FLAWS).length).toBe(10);
  });

  it('matches ord Tag enum values', () => {
    expect(Tag.Body).toBe(0);
    expect(Tag.Flags).toBe(2);
    expect(Tag.Rune).toBe(4);
    expect(Tag.Premine).toBe(6);
    expect(Tag.Cap).toBe(8);
    expect(Tag.Amount).toBe(10);
    expect(Tag.HeightStart).toBe(12);
    expect(Tag.HeightEnd).toBe(14);
    expect(Tag.OffsetStart).toBe(16);
    expect(Tag.OffsetEnd).toBe(18);
    expect(Tag.Mint).toBe(20);
    expect(Tag.Pointer).toBe(22);
    expect(Tag.Cenotaph).toBe(126);
    expect(Tag.Divisibility).toBe(1);
    expect(Tag.Spacers).toBe(3);
    expect(Tag.Symbol).toBe(5);
    expect(Tag.Nop).toBe(127);
  });

  it('matches ord Flag bit assignments', () => {
    expect(Flag.Etching).toBe(0);
    expect(Flag.Terms).toBe(1);
    expect(Flag.Turbo).toBe(2);
    expect(Flag.Cenotaph).toBe(127);
  });

  it('matches protocol boundary constants', () => {
    expect(MAX_DIVISIBILITY).toBe(38n);
    expect(MAX_SPACERS).toBe(0x07ffffffn);
  });

  it('verifies odd vs even tag asymmetry in action', () => {
    // Out-of-range divisibility (> 38) on odd tag 1 is ignored silently
    // 6a 5d 04 02 01 01 27 (Flags: 1 (Etching), Divisibility: 39)
    const oddRes = decipher('6a5d0402010127');
    expect(oddRes.cenotaph).toBe(false);
    expect(oddRes.etching?.divisibility).toBeNull(); // ignored, defaults to 0

    // Out-of-range pointer on even tag 22 produces UnrecognizedEvenTag flaw
    // 6a 5d 02 16 05 (outputs: 2) -> Pointer 5 >= 2
    const evenRes = decipher('6a5d021605', 2);
    expect(evenRes.cenotaph).toBe(true);
    expect(evenRes.flaw).toBe('UnrecognizedEvenTag');
  });

  it('verifies supply overflow detection at u128 boundaries', () => {
    // cap = 2, amount = 2^127 -> cap * amount overflows u128
    const hex = '6a5d18020308020a80808080808080808080808080808080808002';
    const res = decipher(hex, 2);
    expect(res.cenotaph).toBe(true);
    expect(res.flaw).toBe('SupplyOverflow');
  });
});
