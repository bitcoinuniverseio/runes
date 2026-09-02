/**
 * Bitcoin script parsing and construction for Runestones
 */
import { FlawType } from './constants.js';
export declare function parseHex(text: string): {
    bytes: Uint8Array;
} | {
    error: string;
};
export declare function bytesToHex(bytes: Uint8Array): string;
export interface PayloadSuccess {
    payload: Uint8Array;
    pushes: number;
}
export interface PayloadNotRunestone {
    notRunestone: string;
}
export interface PayloadFlaw {
    flaw: FlawType;
    at?: number;
    op?: number;
}
export type ExtractPayloadResult = PayloadSuccess | PayloadNotRunestone | PayloadFlaw;
export declare function extractPayload(bytes: Uint8Array): ExtractPayloadResult;
export declare function buildRunestoneScript(payload: Uint8Array): Uint8Array;
//# sourceMappingURL=script.d.ts.map