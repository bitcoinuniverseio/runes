/**
 * Structured trace generation for Runestone decoding and state transitions
 */
import { DecipherResult } from './runestone.js';
export interface DecipherTrace {
    stage: string;
    detail: string;
    status: 'info' | 'success' | 'warning' | 'error';
}
export declare function generateDecipherTrace(result: DecipherResult): DecipherTrace[];
//# sourceMappingURL=trace.d.ts.map