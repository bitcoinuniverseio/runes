/**
 * RuneId definitions and delta operations (ordinals::rune_id)
 */
export interface RuneId {
    block: bigint;
    tx: number;
}
export declare function nextRuneId(id: RuneId, blockDelta: bigint, txDelta: bigint): RuneId | null;
export declare function deltaRuneId(previous: RuneId, target: RuneId): [bigint, bigint] | null;
export declare function formatRuneId(id: RuneId): string;
export declare function parseRuneId(s: string): RuneId | null;
//# sourceMappingURL=rune_id.d.ts.map