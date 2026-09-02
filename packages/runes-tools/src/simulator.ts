/**
 * Runes allocation and state transition simulator (ord 0.29.0 rules R38-R45)
 */

import { RuneId, formatRuneId } from './rune_id.js';
import { Edict } from './edict.js';
import { FlawType } from './constants.js';

export interface AllocationSimulationInput {
  numOutputs: number;
  outputTypes?: ('spendable' | 'op_return')[];
  inputBalances: Record<string, bigint>; // Rune ID string -> atomic units
  mint?: { runeId: RuneId; amount: bigint };
  etching?: { runeId: RuneId; premine: bigint };
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

export function simulateAllocation(input: AllocationSimulationInput): AllocationSimulationResult {
  const numOutputs = Math.max(1, input.numOutputs);
  const outputTypes: ('spendable' | 'op_return')[] = input.outputTypes || [];
  while (outputTypes.length < numOutputs) {
    outputTypes.push('spendable');
  }

  const spendableIndices: number[] = [];
  for (let i = 0; i < numOutputs; i++) {
    if (outputTypes[i] !== 'op_return') {
      spendableIndices.push(i);
    }
  }

  const traces: SimulationStepTrace[] = [];
  let stepCounter = 1;

  // 1. Gather unallocated pool
  const unallocated: Map<string, bigint> = new Map();
  const inputsTotal: Record<string, bigint> = {};
  const totalMinted: Record<string, bigint> = {};
  const totalPremined: Record<string, bigint> = {};
  const burns: Record<string, bigint> = {};

  for (const [id, amount] of Object.entries(input.inputBalances)) {
    if (amount > 0n) {
      unallocated.set(id, (unallocated.get(id) || 0n) + amount);
      inputsTotal[id] = (inputsTotal[id] || 0n) + amount;
      traces.push({
        step: stepCounter++,
        action: 'DRAIN_INPUT',
        runeId: id,
        amount,
        destination: 'UNALLOCATED_POOL',
        detail: `Drained ${amount} atomic units of ${id} from spent inputs into unallocated pool.`
      });
    }
  }

  if (input.mint && input.mint.amount > 0n) {
    const mintId = formatRuneId(input.mint.runeId);
    unallocated.set(mintId, (unallocated.get(mintId) || 0n) + input.mint.amount);
    totalMinted[mintId] = input.mint.amount;
    traces.push({
      step: stepCounter++,
      action: 'APPLY_MINT',
      runeId: mintId,
      amount: input.mint.amount,
      destination: 'UNALLOCATED_POOL',
      detail: `Mint added ${input.mint.amount} atomic units of ${mintId} to unallocated pool.`
    });
  }

  let etchedIdStr: string | null = null;
  if (input.etching && input.etching.premine > 0n) {
    etchedIdStr = formatRuneId(input.etching.runeId);
    unallocated.set(etchedIdStr, (unallocated.get(etchedIdStr) || 0n) + input.etching.premine);
    totalPremined[etchedIdStr] = input.etching.premine;
    traces.push({
      step: stepCounter++,
      action: 'APPLY_PREMINE',
      runeId: etchedIdStr,
      amount: input.etching.premine,
      destination: 'UNALLOCATED_POOL',
      detail: `Premine added ${input.etching.premine} atomic units of etched rune ${etchedIdStr} to unallocated pool.`
    });
  }

  // Initialize per-output balances
  const outputBalances: Map<string, bigint>[] = [];
  for (let i = 0; i < numOutputs; i++) {
    outputBalances.push(new Map());
  }

  // 2. Handle Cenotaph
  if (input.isCenotaph) {
    for (const [id, amount] of unallocated.entries()) {
      if (amount > 0n) {
        burns[id] = (burns[id] || 0n) + amount;
        traces.push({
          step: stepCounter++,
          action: 'CENOTAPH_BURN',
          runeId: id,
          amount,
          destination: 'BURNED',
          detail: `Cenotaph flaw ${input.cenotaphFlaw || 'Unknown'} caused total destruction of ${amount} units of ${id}.`
        });
      }
    }

    const finalOutputs: OutputRuneAllocation[] = [];
    for (let i = 0; i < numOutputs; i++) {
      finalOutputs.push({
        outputIndex: i,
        outputType: outputTypes[i],
        balances: {}
      });
    }

    return {
      isCenotaph: true,
      cenotaphFlaw: input.cenotaphFlaw || null,
      inputsTotal,
      outputs: finalOutputs,
      burns,
      totalMinted,
      totalPremined,
      conserved: true,
      traces
    };
  }

  // 3. Process edicts in order
  if (input.edicts && input.edicts.length > 0) {
    for (let eIdx = 0; eIdx < input.edicts.length; eIdx++) {
      const edict = input.edicts[eIdx];
      let idStr: string;
      if (edict.id.block === 0n && edict.id.tx === 0) {
        if (!etchedIdStr) {
          traces.push({
            step: stepCounter++,
            action: 'SKIP_EDICT_0_0',
            runeId: '0:0',
            amount: edict.amount,
            destination: `output ${edict.output}`,
            detail: 'Edict 0:0 skipped because this transaction does not etch a rune.'
          });
          continue;
        }
        idStr = etchedIdStr;
      } else {
        idStr = formatRuneId(edict.id);
      }

      const available = unallocated.get(idStr) || 0n;
      if (available === 0n) {
        traces.push({
          step: stepCounter++,
          action: 'EDICT_ZERO_BALANCE',
          runeId: idStr,
          amount: 0n,
          destination: `output ${edict.output}`,
          detail: `Edict #${eIdx + 1} allocated 0 units because available balance of ${idStr} is 0.`
        });
        continue;
      }

      const allocatedAmount = (edict.amount === 0n || edict.amount > available) ? available : edict.amount;
      unallocated.set(idStr, available - allocatedAmount);

      // Check split
      if (edict.output === numOutputs) {
        if (spendableIndices.length === 0) {
          burns[idStr] = (burns[idStr] || 0n) + allocatedAmount;
          traces.push({
            step: stepCounter++,
            action: 'SPLIT_BURN',
            runeId: idStr,
            amount: allocatedAmount,
            destination: 'BURNED',
            detail: `Split instructed on transaction with no non-OP_RETURN outputs: all ${allocatedAmount} units burned.`
          });
        } else {
          if (edict.amount === 0n) {
            // Even split
            const share = allocatedAmount / BigInt(spendableIndices.length);
            const rem = allocatedAmount % BigInt(spendableIndices.length);
            for (let sIdx = 0; sIdx < spendableIndices.length; sIdx++) {
              const outIdx = spendableIndices[sIdx];
              const give = share + (BigInt(sIdx) < rem ? 1n : 0n);
              if (give > 0n) {
                outputBalances[outIdx].set(idStr, (outputBalances[outIdx].get(idStr) || 0n) + give);
              }
            }
            traces.push({
              step: stepCounter++,
              action: 'EVEN_SPLIT',
              runeId: idStr,
              amount: allocatedAmount,
              destination: `outputs [${spendableIndices.join(', ')}]`,
              detail: `Split ${allocatedAmount} units evenly across ${spendableIndices.length} non-OP_RETURN outputs.`
            });
          } else {
            // In order until balance runs out
            let left = allocatedAmount;
            for (const outIdx of spendableIndices) {
              const give = left < edict.amount ? left : edict.amount;
              outputBalances[outIdx].set(idStr, (outputBalances[outIdx].get(idStr) || 0n) + give);
              left -= give;
              if (left === 0n) break;
            }
            traces.push({
              step: stepCounter++,
              action: 'CHOP_SPLIT',
              runeId: idStr,
              amount: allocatedAmount,
              destination: `outputs [${spendableIndices.join(', ')}]`,
              detail: `Allocated ${allocatedAmount} units across non-OP_RETURN outputs with target amount ${edict.amount}.`
            });
          }
        }
      } else if (edict.output < numOutputs) {
        if (outputTypes[edict.output] === 'op_return') {
          burns[idStr] = (burns[idStr] || 0n) + allocatedAmount;
          traces.push({
            step: stepCounter++,
            action: 'EDICT_OP_RETURN_BURN',
            runeId: idStr,
            amount: allocatedAmount,
            destination: `output ${edict.output} (OP_RETURN)`,
            detail: `Explicit edict sent ${allocatedAmount} units of ${idStr} to OP_RETURN output ${edict.output}, deliberately burning them.`
          });
        } else {
          outputBalances[edict.output].set(idStr, (outputBalances[edict.output].get(idStr) || 0n) + allocatedAmount);
          traces.push({
            step: stepCounter++,
            action: 'EDICT_ALLOCATE',
            runeId: idStr,
            amount: allocatedAmount,
            destination: `output ${edict.output}`,
            detail: `Edict allocated ${allocatedAmount} units of ${idStr} to output ${edict.output}.`
          });
        }
      }
    }
  }

  // 4. Assign remainder to pointer or first non-OP_RETURN output
  for (const [idStr, rem] of unallocated.entries()) {
    if (rem > 0n) {
      let targetIdx = -1;
      if (input.pointer !== undefined && input.pointer !== null && input.pointer < numOutputs) {
        targetIdx = input.pointer;
      } else if (spendableIndices.length > 0) {
        targetIdx = spendableIndices[0];
      }

      if (targetIdx === -1 || outputTypes[targetIdx] === 'op_return') {
        burns[idStr] = (burns[idStr] || 0n) + rem;
        traces.push({
          step: stepCounter++,
          action: 'REMAINDER_BURN',
          runeId: idStr,
          amount: rem,
          destination: 'BURNED',
          detail: `Unallocated remainder of ${rem} units of ${idStr} burned because target output ${targetIdx} is OP_RETURN or missing.`
        });
      } else {
        outputBalances[targetIdx].set(idStr, (outputBalances[targetIdx].get(idStr) || 0n) + rem);
        const mechanism = (input.pointer !== undefined && input.pointer !== null) ? `pointer (output ${targetIdx})` : `default first non-OP_RETURN output (output ${targetIdx})`;
        traces.push({
          step: stepCounter++,
          action: 'REMAINDER_ROUTED',
          runeId: idStr,
          amount: rem,
          destination: `output ${targetIdx}`,
          detail: `Remaining ${rem} units of ${idStr} routed via ${mechanism}.`
        });
      }
    }
  }

  // Format outputs
  const finalOutputs: OutputRuneAllocation[] = [];
  for (let i = 0; i < numOutputs; i++) {
    const balancesObj: Record<string, bigint> = {};
    outputBalances[i].forEach((amt, id) => {
      if (amt > 0n) balancesObj[id] = amt;
    });
    finalOutputs.push({
      outputIndex: i,
      outputType: outputTypes[i],
      balances: balancesObj
    });
  }

  // Check conservation of supply
  let conserved = true;
  const allRuneIds = new Set([
    ...Object.keys(inputsTotal),
    ...Object.keys(totalMinted),
    ...Object.keys(totalPremined)
  ]);

  for (const rId of allRuneIds) {
    const totalIn = (inputsTotal[rId] || 0n) + (totalMinted[rId] || 0n) + (totalPremined[rId] || 0n);
    let totalOut = burns[rId] || 0n;
    for (const out of finalOutputs) {
      totalOut += out.balances[rId] || 0n;
    }
    if (totalIn !== totalOut) {
      conserved = false;
    }
  }

  return {
    isCenotaph: false,
    cenotaphFlaw: null,
    inputsTotal,
    outputs: finalOutputs,
    burns,
    totalMinted,
    totalPremined,
    conserved,
    traces
  };
}
