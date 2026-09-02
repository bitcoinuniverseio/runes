/**
 * Edict parsing and delta encoding (ordinals::edict)
 */
import { FlawType } from './constants.js';
import { RuneId } from './rune_id.js';
export interface Edict {
    id: RuneId;
    amount: bigint;
    output: number;
}
export interface ParseEdictsResult {
    edicts: Edict[];
    flaw: FlawType | null;
    caveats: string[];
}
export declare function parseEdicts(integers: bigint[], numOutputs?: number | null): ParseEdictsResult;
export declare function encodeEdicts(edicts: Edict[]): bigint[];
//# sourceMappingURL=edict.d.ts.map