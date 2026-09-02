/**
 * Runes allocation and state transition simulator (ord 0.29.0 rules R38-R45)
 */
import { RuneId } from './rune_id.js';
import { Edict } from './edict.js';
import { FlawType } from './constants.js';
export interface AllocationSimulationInput {
    numOutputs: number;
    outputTypes?: ('spendable' | 'op_return')[];
    inputBalances: Record<string, bigint>;
    mint?: {
        runeId: RuneId;
        amount: bigint;
    };
    etching?: {
        runeId: RuneId;
        premine: bigint;
    };
    edicts?: Edict[];
    pointer?: number | null;
    isCenotaph?: boolean;
    cenotaphFlaw?: FlawType | null;
}
export interface OutputRuneAllocation {
    outputIndex: number;
    outputType: 'spendable' | 'op_return';
    balances: Record<string, bigint>;
}
export interface SimulationStepTrace {
    step: number;
    action: string;
    runeId: string;
    amount: bigint;
    destination: string;
    detail: string;
}
export interface AllocationSimulationResult {
    isCenotaph: boolean;
    cenotaphFlaw: FlawType | null;
    inputsTotal: Record<string, bigint>;
    outputs: OutputRuneAllocation[];
    burns: Record<string, bigint>;
    totalMinted: Record<string, bigint>;
    totalPremined: Record<string, bigint>;
    conserved: boolean;
    traces: SimulationStepTrace[];
}
export declare function simulateAllocation(input: AllocationSimulationInput): AllocationSimulationResult;
//# sourceMappingURL=simulator.d.ts.map