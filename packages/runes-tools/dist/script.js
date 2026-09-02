/**
 * Bitcoin script parsing and construction for Runestones
 */
import { OP_RETURN, MAGIC_NUMBER, MAX_SCRIPT_ELEMENT_SIZE } from './constants.js';
export function parseHex(text) {
    const clean = text.replace(/0x/gi, '').replace(/[\s,]+/g, '');
    if (clean.length === 0) {
        return { error: 'No input provided. Expected hex-encoded script.' };
    }
    if (!/^[0-9a-fA-F]*$/.test(clean)) {
        return { error: 'Input contains non-hex characters.' };
    }
    if (clean.length % 2 !== 0) {
        return { error: 'Odd number of hex digits.' };
    }
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(clean.substring(i * 2, i * 2 + 2), 16);
    }
    return { bytes };
}
export function bytesToHex(bytes) {
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, '0');
    }
    return hex;
}
export function extractPayload(bytes) {
    if (bytes.length < 1 || bytes[0] !== OP_RETURN) {
        return {
            notRunestone: "Script does not begin with OP_RETURN (0x6a). This output carries no runestone; indexers skip it and examine the transaction's other outputs.",
        };
    }
    if (bytes.length < 2 || bytes[1] !== MAGIC_NUMBER) {
        return {
            notRunestone: 'OP_RETURN is not followed by OP_13 (0x5d), the Runes protocol identifier. This is an ordinary data carrier output, not a runestone.',
        };
    }
    const payloadParts = [];
    let i = 2;
    let pushes = 0;
    while (i < bytes.length) {
        const op = bytes[i];
        let len;
        let lenBytes = 0;
        if (op <= 75) {
            len = op;
            lenBytes = 0;
        }
        else if (op === 76) {
            lenBytes = 1;
            len = 0;
        }
        else if (op === 77) {
            lenBytes = 2;
            len = 0;
        }
        else if (op === 78) {
            lenBytes = 4;
            len = 0;
        }
        else {
            // Non-pushdata opcode (0x4f and above)
            return { flaw: 'Opcode', at: i, op };
        }
        i += 1;
        if (lenBytes > 0) {
            if (i + lenBytes > bytes.length) {
                return { flaw: 'InvalidScript', at: i };
            }
            len = 0;
            for (let b = 0; b < lenBytes; b++) {
                len |= bytes[i + b] << (8 * b);
            }
            len = len >>> 0;
            i += lenBytes;
        }
        if (i + len > bytes.length) {
            return { flaw: 'InvalidScript', at: i };
        }
        for (let j = 0; j < len; j++) {
            payloadParts.push(bytes[i + j]);
        }
        i += len;
        pushes++;
    }
    return {
        payload: new Uint8Array(payloadParts),
        pushes,
    };
}
export function buildRunestoneScript(payload) {
    const parts = [OP_RETURN, MAGIC_NUMBER];
    if (payload.length === 0) {
        return new Uint8Array(parts);
    }
    let offset = 0;
    while (offset < payload.length) {
        const chunkSize = Math.min(payload.length - offset, MAX_SCRIPT_ELEMENT_SIZE);
        const chunk = payload.subarray(offset, offset + chunkSize);
        if (chunkSize === 0) {
            parts.push(0x00);
        }
        else if (chunkSize <= 75) {
            parts.push(chunkSize);
        }
        else if (chunkSize <= 255) {
            parts.push(76);
            parts.push(chunkSize);
        }
        else if (chunkSize <= 65535) {
            parts.push(77);
            parts.push(chunkSize & 0xff);
            parts.push((chunkSize >> 8) & 0xff);
        }
        else {
            parts.push(78);
            parts.push(chunkSize & 0xff);
            parts.push((chunkSize >> 8) & 0xff);
            parts.push((chunkSize >> 16) & 0xff);
            parts.push((chunkSize >> 24) & 0xff);
        }
        for (let b = 0; b < chunk.length; b++) {
            parts.push(chunk[b]);
        }
        offset += chunkSize;
    }
    return new Uint8Array(parts);
}
//# sourceMappingURL=script.js.map