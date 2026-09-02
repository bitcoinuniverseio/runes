/**
 * Bitcoin raw transaction parser and Runestone output inspection
 */
import { DecipherResult } from './runestone.js';
export interface TxInput {
    index: number;
    txid: string;
    vout: number;
    scriptSigHex: string;
    sequence: number;
    witnessHex: string[];
}
export interface TxOutput {
    index: number;
    valueSats: bigint;
    scriptPubKeyHex: string;
    isOpReturn: boolean;
    isRunestoneCandidate: boolean;
    selectedRunestone: boolean;
}
export interface RawTransactionResult {
    version: number;
    isSegwit: boolean;
    inputs: TxInput[];
    outputs: TxOutput[];
    locktime: number;
    runestoneOutputIndex: number | null;
    runestone: DecipherResult | null;
    nonOpReturnOutputIndices: number[];
}
export declare function parseRawTransaction(rawHex: string): RawTransactionResult;
//# sourceMappingURL=raw_transaction.d.ts.map