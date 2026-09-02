/**
 * Rune name encoding, decoding, spacers, and commitment calculations
 */
export declare function encodeRuneName(s: string): bigint;
export declare function decodeRuneName(value: bigint): string;
export declare function formatSpacedName(nameValue: bigint, spacers: bigint): string;
export declare function parseSpacedName(text: string): {
    name: string;
    nameValue: bigint;
    spacers: bigint;
};
/**
 * Returns little-endian bytes of the name's integer value with trailing zeros trimmed,
 * matching ordinals Taproot commitment push.
 */
export declare function getRuneCommitmentBytes(nameValue: bigint): Uint8Array;
export declare function minimumLengthAtHeight(height: number): number;
export declare function isNameUnlocked(name: string, height: number): boolean;
export declare function isUnicodeScalar(v: bigint): boolean;
//# sourceMappingURL=rune.d.ts.map