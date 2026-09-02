/**
 * Bitcoin raw transaction parser and Runestone output inspection
 */
import { parseHex, bytesToHex } from './script.js';
import { decipher } from './runestone.js';
function readVarInt(bytes, offset) {
    if (offset >= bytes.length)
        throw new Error('Unexpected EOF reading varint');
    const first = bytes[offset];
    if (first < 0xfd) {
        return { value: BigInt(first), length: 1 };
    }
    else if (first === 0xfd) {
        if (offset + 3 > bytes.length)
            throw new Error('Unexpected EOF reading varint 0xfd');
        const val = bytes[offset + 1] | (bytes[offset + 2] << 8);
        return { value: BigInt(val), length: 3 };
    }
    else if (first === 0xfe) {
        if (offset + 5 > bytes.length)
            throw new Error('Unexpected EOF reading varint 0xfe');
        let val = 0n;
        for (let i = 0; i < 4; i++) {
            val |= BigInt(bytes[offset + 1 + i]) << BigInt(8 * i);
        }
        return { value: val, length: 5 };
    }
    else {
        if (offset + 9 > bytes.length)
            throw new Error('Unexpected EOF reading varint 0xff');
        let val = 0n;
        for (let i = 0; i < 8; i++) {
            val |= BigInt(bytes[offset + 1 + i]) << BigInt(8 * i);
        }
        return { value: val, length: 9 };
    }
}
export function parseRawTransaction(rawHex) {
    const parsed = parseHex(rawHex);
    if ('error' in parsed) {
        throw new Error(parsed.error);
    }
    const bytes = parsed.bytes;
    let offset = 0;
    if (bytes.length < 10) {
        throw new Error('Transaction too short to be valid');
    }
    // Version: 4 bytes LE
    const version = bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24);
    offset += 4;
    // Check SegWit marker and flag
    let isSegwit = false;
    if (bytes[offset] === 0x00 && bytes[offset + 1] === 0x01) {
        isSegwit = true;
        offset += 2;
    }
    // Input count
    const vinCountVar = readVarInt(bytes, offset);
    const vinCount = Number(vinCountVar.value);
    offset += vinCountVar.length;
    const inputs = [];
    for (let i = 0; i < vinCount; i++) {
        if (offset + 36 > bytes.length)
            throw new Error(`Unexpected EOF reading input ${i}`);
        // Txid: 32 bytes (display reversed)
        const txidBytes = bytes.subarray(offset, offset + 32);
        const txid = Array.from(txidBytes).reverse().map(b => b.toString(16).padStart(2, '0')).join('');
        offset += 32;
        const vout = bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24);
        offset += 4;
        const scriptLenVar = readVarInt(bytes, offset);
        const scriptLen = Number(scriptLenVar.value);
        offset += scriptLenVar.length;
        if (offset + scriptLen > bytes.length)
            throw new Error(`Unexpected EOF reading scriptSig in input ${i}`);
        const scriptSigHex = bytesToHex(bytes.subarray(offset, offset + scriptLen));
        offset += scriptLen;
        const sequence = bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24);
        offset += 4;
        inputs.push({
            index: i,
            txid,
            vout: vout >>> 0,
            scriptSigHex,
            sequence: sequence >>> 0,
            witnessHex: []
        });
    }
    // Output count
    const voutCountVar = readVarInt(bytes, offset);
    const voutCount = Number(voutCountVar.value);
    offset += voutCountVar.length;
    const outputs = [];
    const nonOpReturnOutputIndices = [];
    let runestoneOutputIndex = null;
    for (let i = 0; i < voutCount; i++) {
        if (offset + 8 > bytes.length)
            throw new Error(`Unexpected EOF reading value for output ${i}`);
        let valueSats = 0n;
        for (let b = 0; b < 8; b++) {
            valueSats |= BigInt(bytes[offset + b]) << BigInt(8 * b);
        }
        offset += 8;
        const scriptLenVar = readVarInt(bytes, offset);
        const scriptLen = Number(scriptLenVar.value);
        offset += scriptLenVar.length;
        if (offset + scriptLen > bytes.length)
            throw new Error(`Unexpected EOF reading scriptPubKey for output ${i}`);
        const scriptBytes = bytes.subarray(offset, offset + scriptLen);
        const scriptPubKeyHex = bytesToHex(scriptBytes);
        offset += scriptLen;
        const isOpReturn = scriptBytes.length > 0 && scriptBytes[0] === 0x6a;
        const isRunestoneCandidate = scriptBytes.length >= 2 && scriptBytes[0] === 0x6a && scriptBytes[1] === 0x5d;
        let selectedRunestone = false;
        if (isRunestoneCandidate && runestoneOutputIndex === null) {
            runestoneOutputIndex = i;
            selectedRunestone = true;
        }
        if (!isOpReturn) {
            nonOpReturnOutputIndices.push(i);
        }
        outputs.push({
            index: i,
            valueSats,
            scriptPubKeyHex,
            isOpReturn,
            isRunestoneCandidate,
            selectedRunestone
        });
    }
    // Witness data
    if (isSegwit) {
        for (let i = 0; i < vinCount; i++) {
            const itemCountVar = readVarInt(bytes, offset);
            const itemCount = Number(itemCountVar.value);
            offset += itemCountVar.length;
            const witnessItems = [];
            for (let j = 0; j < itemCount; j++) {
                const itemLenVar = readVarInt(bytes, offset);
                const itemLen = Number(itemLenVar.value);
                offset += itemLenVar.length;
                if (offset + itemLen > bytes.length)
                    throw new Error(`Unexpected EOF reading witness item in input ${i}`);
                witnessItems.push(bytesToHex(bytes.subarray(offset, offset + itemLen)));
                offset += itemLen;
            }
            inputs[i].witnessHex = witnessItems;
        }
    }
    // Locktime: 4 bytes LE
    if (offset + 4 > bytes.length)
        throw new Error('Unexpected EOF reading locktime');
    const locktime = bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24);
    // Decipher runestone if found
    let runestone = null;
    if (runestoneOutputIndex !== null) {
        const selectedScript = parseHex(outputs[runestoneOutputIndex].scriptPubKeyHex);
        if (!('error' in selectedScript)) {
            runestone = decipher(selectedScript.bytes, outputs.length);
        }
    }
    return {
        version,
        isSegwit,
        inputs,
        outputs,
        locktime: locktime >>> 0,
        runestoneOutputIndex,
        runestone,
        nonOpReturnOutputIndices
    };
}
//# sourceMappingURL=raw_transaction.js.map