/**
 * Edict parsing and delta encoding (ordinals::edict)
 */
import { U32_MAX } from './constants.js';
import { nextRuneId, deltaRuneId } from './rune_id.js';
export function parseEdicts(integers, numOutputs = null) {
    const edicts = [];
    const caveats = [];
    let flaw = null;
    let id = { block: 0n, tx: 0 };
    for (let c = 0; c < integers.length; c += 4) {
        const chunk = integers.slice(c, c + 4);
        if (chunk.length !== 4) {
            flaw = flaw || 'TrailingIntegers';
            break;
        }
        const next = nextRuneId(id, chunk[0], chunk[1]);
        if (!next) {
            flaw = flaw || 'EdictRuneId';
            break;
        }
        if (chunk[3] > U32_MAX || chunk[3] < 0n) {
            flaw = flaw || 'EdictOutput';
            break;
        }
        const outputNum = Number(chunk[3]);
        if (numOutputs !== null) {
            if (chunk[3] > BigInt(numOutputs)) {
                flaw = flaw || 'EdictOutput';
                break;
            }
        }
        else if (chunk[3] > 0n) {
            caveats.push(`Edict output index ${chunk[3]} could not be range-checked because transaction output count was not provided. If output > count, ord treats the transaction as a cenotaph.`);
        }
        id = next;
        edicts.push({
            id: next,
            amount: chunk[2],
            output: outputNum,
        });
    }
    return { edicts, flaw, caveats };
}
export function encodeEdicts(edicts) {
    if (edicts.length === 0) {
        return [];
    }
    // Edicts must be sorted by rune ID for compact delta encoding
    const sorted = [...edicts].sort((a, b) => {
        if (a.id.block !== b.id.block) {
            return a.id.block < b.id.block ? -1 : 1;
        }
        return a.id.tx - b.id.tx;
    });
    const integers = [];
    let running = { block: 0n, tx: 0 };
    for (const edict of sorted) {
        const delta = deltaRuneId(running, edict.id);
        if (!delta) {
            throw new Error(`Failed to calculate delta from ${running.block}:${running.tx} to ${edict.id.block}:${edict.id.tx}`);
        }
        integers.push(delta[0], delta[1], edict.amount, BigInt(edict.output));
        running = edict.id;
    }
    return integers;
}
//# sourceMappingURL=edict.js.map