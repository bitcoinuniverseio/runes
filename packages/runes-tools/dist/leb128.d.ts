/**
 * LEB128 unsigned varint encoding and decoding, mirroring ordinals::varint
 */
export interface VarintDecodeSuccess {
    value: bigint;
    length: number;
}
export interface VarintDecodeError {
    error: "Overlong" | "Overflow" | "Unterminated";
}
export type VarintDecodeResult = VarintDecodeSuccess | VarintDecodeError;
export declare function decodeVarint(buffer: Uint8Array, start?: number): VarintDecodeResult;
export declare function encodeVarint(n: bigint): Uint8Array;
export interface IntegersDecodeSuccess {
    integers: bigint[];
}
export interface IntegersDecodeError {
    error: "Overlong" | "Overflow" | "Unterminated";
}
export type IntegersDecodeResult = IntegersDecodeSuccess | IntegersDecodeError;
export declare function decodeIntegers(payload: Uint8Array): IntegersDecodeResult;
export declare function encodeIntegers(integers: bigint[]): Uint8Array;
//# sourceMappingURL=leb128.d.ts.map