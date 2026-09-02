/**
 * LEB128 unsigned varint encoding and decoding, mirroring ordinals::varint
 */

export interface VarintDecodeSuccess {
  value: bigint;
  length: number;
}

export interface VarintDecodeError {
  error: "Overlong" | "Overflow" | "Unterminated";
}

export type VarintDecodeResult = VarintDecodeSuccess | VarintDecodeError;

export function decodeVarint(buffer: Uint8Array, start = 0): VarintDecodeResult {
  let n = 0n;
  for (let i = 0; start + i < buffer.length; i++) {
    if (i > 18) {
      return { error: "Overlong" };
    }
    const byte = buffer[start + i];
    const value = BigInt(byte & 0x7f);
    if (i === 18 && (value & 0b0111_1100n) !== 0n) {
      return { error: "Overflow" };
    }
    n |= value << BigInt(7 * i);
    if ((byte & 0x80) === 0) {
      return { value: n, length: i + 1 };
    }
  }
  return { error: "Unterminated" };
}

export function encodeVarint(n: bigint): Uint8Array {
  if (n < 0n) {
    throw new Error("Varint must be an unsigned integer");
  }
  const bytes: number[] = [];
  let current = n;
  while (current >= 0x80n) {
    bytes.push(Number((current & 0x7fn) | 0x80n));
    current >>= 7n;
  }
  bytes.push(Number(current & 0x7fn));
  return new Uint8Array(bytes);
}

export interface IntegersDecodeSuccess {
  integers: bigint[];
}

export interface IntegersDecodeError {
  error: "Overlong" | "Overflow" | "Unterminated";
}

export type IntegersDecodeResult = IntegersDecodeSuccess | IntegersDecodeError;

export function decodeIntegers(payload: Uint8Array): IntegersDecodeResult {
  const integers: bigint[] = [];
  let i = 0;
  while (i < payload.length) {
    const res = decodeVarint(payload, i);
    if ("error" in res) {
      return { error: res.error };
    }
    integers.push(res.value);
    i += res.length;
  }
  return { integers };
}

export function encodeIntegers(integers: bigint[]): Uint8Array {
  const chunks: Uint8Array[] = [];
  let totalLength = 0;
  for (const int of integers) {
    const encoded = encodeVarint(int);
    chunks.push(encoded);
    totalLength += encoded.length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
