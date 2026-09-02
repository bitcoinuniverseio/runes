/**
 * Full Runestone deciphering and enciphering (ordinals::runestone)
 */
import { FlawType } from './constants.js';
import { RuneId } from './rune_id.js';
import { Edict } from './edict.js';
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
export declare function decipher(input: string | Uint8Array, numOutputs?: number | null): DecipherResult;
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
export declare function encipher(runestone: RunestoneInput): EncipherResult;
//# sourceMappingURL=runestone.d.ts.map