/**
 * Runes Protocol Constants (ord 0.29.0 / ordinals crate 0.0.17)
 */

export const U32_MAX = (1n << 32n) - 1n;
export const U64_MAX = (1n << 64n) - 1n;
export const U128_MAX = (1n << 128n) - 1n;

export const MAX_DIVISIBILITY = 38n;
export const MAX_SPACERS = 0b00000111_11111111_11111111_11111111n; // 0x07FFFFFF
export const RESERVED_RUNE_THRESHOLD = 6402364363415443603228541259936211926n; // 27 'A's

export const COMMIT_CONFIRMATIONS = 6;
export const FIRST_RUNE_HEIGHT = 840000;
export const UNLOCK_INTERVAL = 17500;
export const ALL_UNLOCKED_HEIGHT = 1050000;
export const MAX_SCRIPT_ELEMENT_SIZE = 520;

export const MAGIC_NUMBER = 0x5d; // OP_13 (OP_PUSHNUM_13)
export const OP_RETURN = 0x6a;

export enum Tag {
  Body = 0,
  Flags = 2,
  Rune = 4,
  Premine = 6,
  Cap = 8,
  Amount = 10,
  HeightStart = 12,
  HeightEnd = 14,
  OffsetStart = 16,
  OffsetEnd = 18,
  Mint = 20,
  Pointer = 22,
  Cenotaph = 126,

  Divisibility = 1,
  Spacers = 3,
  Symbol = 5,
  Nop = 127,
}

export const TAG_NAMES: Record<number, string> = {
  0: "Body",
  2: "Flags",
  4: "Rune",
  6: "Premine",
  8: "Cap",
  10: "Amount",
  12: "HeightStart",
  14: "HeightEnd",
  16: "OffsetStart",
  18: "OffsetEnd",
  20: "Mint",
  22: "Pointer",
  126: "Cenotaph (reserved)",
  1: "Divisibility",
  3: "Spacers",
  5: "Symbol",
  127: "Nop"
};

export enum Flag {
  Etching = 0,
  Terms = 1,
  Turbo = 2,
  Cenotaph = 127,
}

export const FLAWS = {
  Opcode: "non-pushdata opcode in OP_RETURN",
  InvalidScript: "invalid script in OP_RETURN",
  Varint: "invalid varint",
  TruncatedField: "field with missing value",
  TrailingIntegers: "trailing integers in body",
  UnrecognizedEvenTag: "unrecognized even tag",
  UnrecognizedFlag: "unrecognized flag",
  SupplyOverflow: "supply overflows u128",
  EdictRuneId: "invalid rune ID in edict",
  EdictOutput: "edict output greater than transaction output count",
} as const;

export type FlawType = keyof typeof FLAWS;
