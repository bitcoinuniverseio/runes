/**
 * Runestone size, relay policy, and weight analysis
 */
export declare const STANDARD_OP_RETURN_MAX_BYTES = 83;
export declare const MAX_STANDARD_TX_WEIGHT = 400000;
export interface SizeAnalysisResult {
    scriptSizeBytes: number;
    payloadSizeBytes: number;
    dataPushesCount: number;
    withinStandardOpReturnLimit: boolean;
    standardLimitDifference: number;
    policyRecommendation: string;
}
export declare function analyzeSize(scriptBytes: Uint8Array, payloadBytes: Uint8Array, pushes: number): SizeAnalysisResult;
//# sourceMappingURL=size.d.ts.map