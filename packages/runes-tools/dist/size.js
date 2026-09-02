/**
 * Runestone size, relay policy, and weight analysis
 */
export const STANDARD_OP_RETURN_MAX_BYTES = 83;
export const MAX_STANDARD_TX_WEIGHT = 400000;
export function analyzeSize(scriptBytes, payloadBytes, pushes) {
    const scriptSizeBytes = scriptBytes.length;
    const payloadSizeBytes = payloadBytes.length;
    const withinStandardOpReturnLimit = scriptSizeBytes <= STANDARD_OP_RETURN_MAX_BYTES;
    const standardLimitDifference = scriptSizeBytes - STANDARD_OP_RETURN_MAX_BYTES;
    let policyRecommendation;
    if (withinStandardOpReturnLimit) {
        policyRecommendation = `The runestone script (${scriptSizeBytes} bytes) is within standard Bitcoin relay policy (max ${STANDARD_OP_RETURN_MAX_BYTES} bytes for OP_RETURN). Standard nodes will relay this transaction without special policy configuration.`;
    }
    else {
        policyRecommendation = `The runestone script (${scriptSizeBytes} bytes) exceeds standard Bitcoin relay policy of ${STANDARD_OP_RETURN_MAX_BYTES} bytes by ${standardLimitDifference} bytes. While consensus-valid if included in a block, ordinary mempools will reject it unless configured with a higher -datacarriersize. Consider using sweeps or compact delta encoding to reduce script size.`;
    }
    return {
        scriptSizeBytes,
        payloadSizeBytes,
        dataPushesCount: pushes,
        withinStandardOpReturnLimit,
        standardLimitDifference,
        policyRecommendation
    };
}
//# sourceMappingURL=size.js.map