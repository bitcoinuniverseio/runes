/**
 * Full Runestone deciphering and enciphering (ordinals::runestone)
 */

import {
  U32_MAX,
  U64_MAX,
  U128_MAX,
  MAX_DIVISIBILITY,
  MAX_SPACERS,
  Tag,
  Flag,
  FlawType,
  FLAWS,
} from './constants.js';
import { decodeIntegers, encodeIntegers } from './leb128.js';
import { parseHex, bytesToHex, extractPayload, buildRunestoneScript } from './script.js';
import { isUnicodeScalar } from './rune.js';
import { RuneId, formatRuneId } from './rune_id.js';
import { Edict, parseEdicts, encodeEdicts } from './edict.js';

export interface EtchingTerms {
  amount: bigint | null;
  cap: bigint | null;
  heightStart: bigint | null;
  heightEnd: bigint | null;
  offsetStart: bigint | null;
  offsetEnd: bigint | null;
}

export interface Etching {
  divisibility: bigint | null;
  premine: bigint | null;
  rune: bigint | null;
  spacers: bigint | null;
  symbol: bigint | null;
  terms: EtchingTerms | null;
  turbo: boolean;
}

export interface DecipherResult {
  inputError?: string;
  notRunestone?: string;
  cenotaph: boolean;
  flaw: FlawType | null;
  stage?: 'script' | 'varint' | 'fields' | 'edicts';
  payload?: Uint8Array;
  pushes?: number;
  integers?: bigint[];
  etching: Etching | null;
  mint: RuneId | null;
  pointer: number | null;
  edicts: Edict[];
  fields?: Map<string, bigint[]>;
  leftoverEven?: string[];
  caveats: string[];
}

function take<T>(
  fields: Map<string, bigint[]>,
  tag: bigint,
  n: number,
  interpret: (values: bigint[]) => T | null
): T | null {
  const key = tag.toString();
  const values = fields.get(key);
  if (!values || values.length < n) return null;
  const slice = values.slice(0, n);
  const out = interpret(slice);
  if (out === null) return null;
  values.splice(0, n);
  if (values.length === 0) {
    fields.delete(key);
  }
  return out;
}

export function decipher(
  input: string | Uint8Array,
  numOutputs: number | null = null
): DecipherResult {
  let bytes: Uint8Array;
  if (typeof input === 'string') {
    const parsed = parseHex(input);
    if ('error' in parsed) {
      return {
        inputError: parsed.error,
        cenotaph: false,
        flaw: null,
        etching: null,
        mint: null,
        pointer: null,
        edicts: [],
        caveats: [],
      };
    }
    bytes = parsed.bytes;
  } else {
    bytes = input;
  }

  const extracted = extractPayload(bytes);
  if ('notRunestone' in extracted) {
    return {
      notRunestone: extracted.notRunestone,
      cenotaph: false,
      flaw: null,
      etching: null,
      mint: null,
      pointer: null,
      edicts: [],
      caveats: [],
    };
  }

  if ('flaw' in extracted) {
    return {
      cenotaph: true,
      flaw: extracted.flaw,
      stage: 'script',
      etching: null,
      mint: null,
      pointer: null,
      edicts: [],
      caveats: [],
    };
  }

  const ints = decodeIntegers(extracted.payload);
  if ('error' in ints) {
    return {
      cenotaph: true,
      flaw: 'Varint',
      stage: 'varint',
      payload: extracted.payload,
      pushes: extracted.pushes,
      etching: null,
      mint: null,
      pointer: null,
      edicts: [],
      caveats: [],
    };
  }

  const integers = ints.integers;
  const fields = new Map<string, bigint[]>();
  const caveats: string[] = [];
  let flaw: FlawType | null = null;
  let edicts: Edict[] = [];

  for (let i = 0; i < integers.length; i += 2) {
    const tag = integers[i];
    if (tag === 0n) {
      // Body tag reached; rest are edicts
      const rest = integers.slice(i + 1);
      const edictResult = parseEdicts(rest, numOutputs);
      edicts = edictResult.edicts;
      if (edictResult.flaw && !flaw) {
        flaw = edictResult.flaw;
      }
      caveats.push(...edictResult.caveats);
      break;
    }

    if (i + 1 >= integers.length) {
      flaw = flaw || 'TruncatedField';
      break;
    }

    const key = tag.toString();
    if (!fields.has(key)) {
      fields.set(key, []);
    }
    fields.get(key)!.push(integers[i + 1]);
  }

  // Consume Flags (tag 2)
  let flags = take(fields, 2n, 1, (v) => v[0]);
  if (flags === null) flags = 0n;

  let etching: Etching | null = null;
  const hasEtching = (flags & (1n << BigInt(Flag.Etching))) !== 0n;
  const hasTerms = (flags & (1n << BigInt(Flag.Terms))) !== 0n;
  const hasTurbo = (flags & (1n << BigInt(Flag.Turbo))) !== 0n;

  if (hasEtching) {
    flags &= ~(1n << BigInt(Flag.Etching));

    etching = {
      divisibility: take(fields, 1n, 1, (v) => (v[0] <= MAX_DIVISIBILITY ? v[0] : null)),
      premine: take(fields, 6n, 1, (v) => v[0]),
      rune: take(fields, 4n, 1, (v) => v[0]),
      spacers: take(fields, 3n, 1, (v) => (v[0] <= MAX_SPACERS ? v[0] : null)),
      symbol: take(fields, 5n, 1, (v) => (isUnicodeScalar(v[0]) ? v[0] : null)),
      terms: null,
      turbo: false,
    };

    if (hasTerms) {
      flags &= ~(1n << BigInt(Flag.Terms));
      etching.terms = {
        cap: take(fields, 8n, 1, (v) => v[0]),
        heightStart: take(fields, 12n, 1, (v) => (v[0] <= U64_MAX ? v[0] : null)),
        heightEnd: take(fields, 14n, 1, (v) => (v[0] <= U64_MAX ? v[0] : null)),
        amount: take(fields, 10n, 1, (v) => v[0]),
        offsetStart: take(fields, 16n, 1, (v) => (v[0] <= U64_MAX ? v[0] : null)),
        offsetEnd: take(fields, 18n, 1, (v) => (v[0] <= U64_MAX ? v[0] : null)),
      };
    }

    if (hasTurbo) {
      flags &= ~(1n << BigInt(Flag.Turbo));
      etching.turbo = true;
    }
  }

  // Consume Mint (tag 20)
  const mint = take(fields, 20n, 2, (v) => {
    if (v[0] > U64_MAX || v[1] > U32_MAX) return null;
    if (v[0] === 0n && v[1] > 0n) return null;
    return { block: v[0], tx: Number(v[1]) };
  });

  // Consume Pointer (tag 22)
  const pointerBigInt = take(fields, 22n, 1, (v) => {
    if (v[0] > U32_MAX) return null;
    if (numOutputs !== null) {
      return v[0] < BigInt(numOutputs) ? v[0] : null;
    }
    return v[0];
  });

  const pointer = pointerBigInt !== null ? Number(pointerBigInt) : null;
  if (pointer !== null && numOutputs === null) {
    caveats.push(
      `Pointer ${pointer} could not be range-checked against output count. If pointer >= output count, ord treats the transaction as a cenotaph.`
    );
  }

  // Supply overflow check: premine + cap * amount must fit in u128
  if (etching) {
    const premine = etching.premine ?? 0n;
    const cap = etching.terms?.cap ?? 0n;
    const amount = etching.terms?.amount ?? 0n;
    if (cap * amount > U128_MAX || premine + cap * amount > U128_MAX) {
      flaw = flaw || 'SupplyOverflow';
    }
  }

  if (flags !== 0n) {
    flaw = flaw || 'UnrecognizedFlag';
  }

  const leftoverEven: string[] = [];
  fields.forEach((_v, key) => {
    if (BigInt(key) % 2n === 0n) {
      leftoverEven.push(key);
    }
  });

  if (leftoverEven.length > 0) {
    flaw = flaw || 'UnrecognizedEvenTag';
  }

  return {
    cenotaph: flaw !== null,
    flaw,
    payload: extracted.payload,
    pushes: extracted.pushes,
    integers,
    etching,
    mint,
    pointer,
    edicts,
    fields,
    leftoverEven,
    caveats,
  };
}

export interface RunestoneInput {
  etching?: {
    rune?: bigint;
    divisibility?: bigint;
    spacers?: bigint;
    symbol?: bigint;
    premine?: bigint;
    turbo?: boolean;
    terms?: {
      cap?: bigint;
      amount?: bigint;
      heightStart?: bigint;
      heightEnd?: bigint;
      offsetStart?: bigint;
      offsetEnd?: bigint;
    };
  };
  mint?: RuneId;
  pointer?: number;
  edicts?: Edict[];
}

export interface EncipherResult {
  scriptHex: string;
  scriptBytes: Uint8Array;
  payloadHex: string;
  payloadBytes: Uint8Array;
  integers: bigint[];
  roundTrip: DecipherResult;
  roundTripValid: boolean;
}

export function encipher(runestone: RunestoneInput): EncipherResult {
  const integers: bigint[] = [];

  if (runestone.etching) {
    let flags = 1n << BigInt(Flag.Etching);
    if (runestone.etching.terms) {
      flags |= 1n << BigInt(Flag.Terms);
    }
    if (runestone.etching.turbo) {
      flags |= 1n << BigInt(Flag.Turbo);
    }
    integers.push(BigInt(Tag.Flags), flags);

    if (runestone.etching.rune !== undefined) {
      integers.push(BigInt(Tag.Rune), runestone.etching.rune);
    }
    if (runestone.etching.divisibility !== undefined) {
      integers.push(BigInt(Tag.Divisibility), runestone.etching.divisibility);
    }
    if (runestone.etching.spacers !== undefined) {
      integers.push(BigInt(Tag.Spacers), runestone.etching.spacers);
    }
    if (runestone.etching.symbol !== undefined) {
      integers.push(BigInt(Tag.Symbol), runestone.etching.symbol);
    }
    if (runestone.etching.premine !== undefined) {
      integers.push(BigInt(Tag.Premine), runestone.etching.premine);
    }

    if (runestone.etching.terms) {
      const t = runestone.etching.terms;
      if (t.amount !== undefined) integers.push(BigInt(Tag.Amount), t.amount);
      if (t.cap !== undefined) integers.push(BigInt(Tag.Cap), t.cap);
      if (t.heightStart !== undefined) integers.push(BigInt(Tag.HeightStart), t.heightStart);
      if (t.heightEnd !== undefined) integers.push(BigInt(Tag.HeightEnd), t.heightEnd);
      if (t.offsetStart !== undefined) integers.push(BigInt(Tag.OffsetStart), t.offsetStart);
      if (t.offsetEnd !== undefined) integers.push(BigInt(Tag.OffsetEnd), t.offsetEnd);
    }
  }

  if (runestone.mint) {
    integers.push(BigInt(Tag.Mint), runestone.mint.block);
    integers.push(BigInt(Tag.Mint), BigInt(runestone.mint.tx));
  }

  if (runestone.pointer !== undefined && runestone.pointer !== null) {
    integers.push(BigInt(Tag.Pointer), BigInt(runestone.pointer));
  }

  if (runestone.edicts && runestone.edicts.length > 0) {
    integers.push(BigInt(Tag.Body));
    const edictInts = encodeEdicts(runestone.edicts);
    integers.push(...edictInts);
  }

  const payloadBytes = encodeIntegers(integers);
  const scriptBytes = buildRunestoneScript(payloadBytes);
  const scriptHex = bytesToHex(scriptBytes);
  const payloadHex = bytesToHex(payloadBytes);

  // Decipher to assert round-trip parity
  const roundTrip = decipher(scriptBytes, 100);
  const roundTripValid = !roundTrip.cenotaph && roundTrip.flaw === null;

  return {
    scriptHex,
    scriptBytes,
    payloadHex,
    payloadBytes,
    integers,
    roundTrip,
    roundTripValid,
  };
}
