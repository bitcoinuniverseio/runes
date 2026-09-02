/**
 * RuneId definitions and delta operations (ordinals::rune_id)
 */

import { U32_MAX, U64_MAX } from './constants.js';

export interface RuneId {
  block: bigint;
  tx: number;
}

export function nextRuneId(id: RuneId, blockDelta: bigint, txDelta: bigint): RuneId | null {
  const block = id.block + blockDelta;
  if (block > U64_MAX || block < 0n) return null;

  let tx: bigint;
  if (blockDelta === 0n) {
    tx = BigInt(id.tx) + txDelta;
  } else {
    tx = txDelta;
  }

  if (tx > U32_MAX || tx < 0n) return null;
  if (block === 0n && tx > 0n) return null;

  return { block, tx: Number(tx) };
}

export function deltaRuneId(previous: RuneId, target: RuneId): [bigint, bigint] | null {
  if (target.block < previous.block) {
    return null;
  }
  const blockDelta = target.block - previous.block;
  let txDelta: bigint;
  if (blockDelta === 0n) {
    if (target.tx < previous.tx) {
      return null;
    }
    txDelta = BigInt(target.tx - previous.tx);
  } else {
    txDelta = BigInt(target.tx);
  }

  return [blockDelta, txDelta];
}

export function formatRuneId(id: RuneId): string {
  return `${id.block}:${id.tx}`;
}

export function parseRuneId(s: string): RuneId | null {
  const parts = s.trim().split(':');
  if (parts.length !== 2) return null;
  try {
    const block = BigInt(parts[0]);
    const tx = parseInt(parts[1], 10);
    if (isNaN(tx) || tx < 0 || tx > Number(U32_MAX)) return null;
    if (block < 0n || block > U64_MAX) return null;
    if (block === 0n && tx > 0) return null;
    return { block, tx };
  } catch {
    return null;
  }
}
