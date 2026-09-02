/**
 * Rune name encoding, decoding, spacers, and commitment calculations
 */
import { FIRST_RUNE_HEIGHT, UNLOCK_INTERVAL, ALL_UNLOCKED_HEIGHT } from './constants.js';
export function encodeRuneName(s) {
    const upper = s.toUpperCase().replace(/[^A-Z]/g, '');
    if (upper.length === 0) {
        throw new Error('Rune name must contain at least one A-Z character');
    }
    let n = 0n;
    for (let i = 0; i < upper.length; i++) {
        const code = BigInt(upper.charCodeAt(i) - 65);
        if (i === 0) {
            n = code;
        }
        else {
            n = (n + 1n) * 26n + code;
        }
    }
    return n;
}
export function decodeRuneName(value) {
    if (value < 0n) {
        throw new Error('Rune value cannot be negative');
    }
    let n = value + 1n;
    let name = '';
    while (n > 0n) {
        name = String.fromCharCode(Number((n - 1n) % 26n) + 65) + name;
        n = (n - 1n) / 26n;
    }
    return name;
}
export function formatSpacedName(nameValue, spacers) {
    const name = decodeRuneName(nameValue);
    let out = '';
    for (let i = 0; i < name.length; i++) {
        out += name[i];
        if (i < name.length - 1 && (spacers & (1n << BigInt(i))) !== 0n) {
            out += '•';
        }
    }
    return out;
}
export function parseSpacedName(text) {
    let name = '';
    let spacers = 0n;
    const clean = text.trim().toUpperCase();
    let letterCount = 0;
    for (let i = 0; i < clean.length; i++) {
        const char = clean[i];
        if (char >= 'A' && char <= 'Z') {
            name += char;
            letterCount++;
        }
        else if (char === '•' || char === '.' || char === '_') {
            if (letterCount > 0 && letterCount < 27) {
                spacers |= 1n << BigInt(letterCount - 1);
            }
        }
    }
    if (name.length === 0) {
        throw new Error('No valid letters found in rune name');
    }
    const nameValue = encodeRuneName(name);
    return { name, nameValue, spacers };
}
/**
 * Returns little-endian bytes of the name's integer value with trailing zeros trimmed,
 * matching ordinals Taproot commitment push.
 */
export function getRuneCommitmentBytes(nameValue) {
    if (nameValue === 0n) {
        return new Uint8Array([0]);
    }
    const bytes = [];
    let current = nameValue;
    while (current > 0n) {
        bytes.push(Number(current & 0xffn));
        current >>= 8n;
    }
    // Trim trailing zero bytes
    while (bytes.length > 0 && bytes[bytes.length - 1] === 0) {
        bytes.pop();
    }
    return new Uint8Array(bytes);
}
export function minimumLengthAtHeight(height) {
    if (height < FIRST_RUNE_HEIGHT) {
        return Infinity;
    }
    if (height >= ALL_UNLOCKED_HEIGHT) {
        return 1;
    }
    const elapsed = height - FIRST_RUNE_HEIGHT;
    const steps = Math.floor(elapsed / UNLOCK_INTERVAL);
    const minLength = 13 - steps;
    return Math.max(1, minLength);
}
export function isNameUnlocked(name, height) {
    const clean = name.replace(/[^A-Za-z]/g, '');
    const minLen = minimumLengthAtHeight(height);
    return clean.length >= minLen;
}
export function isUnicodeScalar(v) {
    if (v > 0x10ffffn || v < 0n)
        return false;
    if (v >= 0xd800n && v <= 0xdfffn)
        return false;
    return true;
}
//# sourceMappingURL=rune.js.map