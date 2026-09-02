/**
 * Structured trace generation for Runestone decoding and state transitions
 */

import { DecipherResult } from './runestone.js';
import { AllocationSimulationResult } from './simulator.js';

export interface DecipherTrace {
  stage: string;
  detail: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export function generateDecipherTrace(result: DecipherResult): DecipherTrace[] {
  const trace: DecipherTrace[] = [];

  if (result.inputError) {
    trace.push({
      stage: 'INPUT_PARSING',
      detail: result.inputError,
      status: 'error'
    });
    return trace;
  }

  if (result.notRunestone) {
    trace.push({
      stage: 'CARRIER_SEARCH',
      detail: result.notRunestone,
      status: 'warning'
    });
    return trace;
  }

  trace.push({
    stage: 'CARRIER_VERIFICATION',
    detail: 'Output script begins with OP_RETURN (0x6a) followed by OP_13 (0x5d). Carrier verified.',
    status: 'success'
  });

  if (result.stage === 'script') {
    trace.push({
      stage: 'DATA_PUSHES',
      detail: `Script inspection failed with flaw: ${result.flaw}`,
      status: 'error'
    });
    return trace;
  }

  trace.push({
    stage: 'PAYLOAD_EXTRACTION',
    detail: `Extracted ${result.payload?.length || 0} bytes concatenated across ${result.pushes || 0} data pushes.`,
    status: 'success'
  });

  if (result.stage === 'varint') {
    trace.push({
      stage: 'VARINT_DECODING',
      detail: `Varint decoding failed with flaw: ${result.flaw}`,
      status: 'error'
    });
    return trace;
  }

  trace.push({
    stage: 'VARINT_DECODING',
    detail: `Decoded ${result.integers?.length || 0} LEB128 unsigned integers.`,
    status: 'success'
  });

  if (result.etching) {
    trace.push({
      stage: 'ETCHING_INTERPRETATION',
      detail: `Etching present. Name: ${result.etching.rune !== null ? result.etching.rune.toString() : 'None (Reserved)'}. Divisibility: ${result.etching.divisibility ?? 0n}. Symbol: ${result.etching.symbol ?? 'none'}.`,
      status: 'info'
    });
  }

  if (result.mint) {
    trace.push({
      stage: 'MINT_INTERPRETATION',
      detail: `Mint instruction for rune ${result.mint.block}:${result.mint.tx}.`,
      status: 'info'
    });
  }

  if (result.pointer !== null) {
    trace.push({
      stage: 'POINTER_INTERPRETATION',
      detail: `Pointer directed unallocated remainder to output ${result.pointer}.`,
      status: 'info'
    });
  }

  if (result.edicts.length > 0) {
    trace.push({
      stage: 'EDICTS_PARSED',
      detail: `Decoded ${result.edicts.length} edicts.`,
      status: 'info'
    });
  }

  if (result.cenotaph) {
    trace.push({
      stage: 'VERDICT',
      detail: `CENOTAPH detected. Flaw: ${result.flaw}. All input runes burned.`,
      status: 'error'
    });
  } else {
    trace.push({
      stage: 'VERDICT',
      detail: 'VALID RUNESTONE. Protocol deciphering succeeded without flaws.',
      status: 'success'
    });
  }

  return trace;
}
