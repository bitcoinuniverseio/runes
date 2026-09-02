/**
 * LEB128 unsigned varint encoding and decoding, mirroring ordinals::varint
 */
export function decodeVarint(buffer, start = 0) {
    let n = 0n;
    for (let i = 0; start + i < buffer.length; i++) {
        if (i > 18) {
            return { error: "Overlong" };
        }
        const byte = buffer[start + i];
        const value = BigInt(byte & 0x7f);
        if (i === 18 && (value & 124n) !== 0n) {
            return { error: "Overflow" };
        }
        n |= value << BigInt(7 * i);
        if ((byte & 0x80) === 0) {
            return { value: n, length: i + 1 };
        }
    }
    return { error: "Unterminated" };
}
export function encodeVarint(n) {
    if (n < 0n) {
        throw new Error("Varint must be an unsigned integer");
    }
    const bytes = [];
    let current = n;
    while (current >= 0x80n) {
        bytes.push(Number((current & 0x7fn) | 0x80n));
        current >>= 7n;
    }
    bytes.push(Number(current & 0x7fn));
    return new Uint8Array(bytes);
}
export function decodeIntegers(payload) {
    const integers = [];
    let i = 0;
    while (i < payload.length) {
        const res = decodeVarint(payload, i);
        if ("error" in res) {
            return { error: res.error };
        }
        integers.push(res.value);
        i += res.length;
    }
    return { integers };
}
export function encodeIntegers(integers) {
    const chunks = [];
    let totalLength = 0;
    for (const int of integers) {
        const encoded = encodeVarint(int);
        chunks.push(encoded);
        totalLength += encoded.length;
    }
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
    }
    return result;
}
//# sourceMappingURL=leb128.js.map