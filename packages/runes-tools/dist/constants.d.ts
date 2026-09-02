/**
 * Runes Protocol Constants (ord 0.29.0 / ordinals crate 0.0.17)
 */
export declare const U32_MAX: bigint;
export declare const U64_MAX: bigint;
export declare const U128_MAX: bigint;
export declare const MAX_DIVISIBILITY = 38n;
export declare const MAX_SPACERS = 134217727n;
export declare const RESERVED_RUNE_THRESHOLD = 6402364363415443603228541259936211926n;
export declare const COMMIT_CONFIRMATIONS = 6;
export declare const FIRST_RUNE_HEIGHT = 840000;
export declare const UNLOCK_INTERVAL = 17500;
export declare const ALL_UNLOCKED_HEIGHT = 1050000;
export declare const MAX_SCRIPT_ELEMENT_SIZE = 520;
export declare const MAGIC_NUMBER = 93;
export declare const OP_RETURN = 106;
export declare enum Tag {
    Body = 0,
    Flags = 2,
    Rune = 4,
    Premine = 6,
    Cap = 8,
    Amount = 10,
    HeightStart = 12,
    HeightEnd = 14,
    OffsetStart = 16,
    OffsetEnd = 18,
    Mint = 20,
    Pointer = 22,
    Cenotaph = 126,
    Divisibility = 1,
    Spacers = 3,
    Symbol = 5,
    Nop = 127
}
export declare const TAG_NAMES: Record<number, string>;
export declare enum Flag {
    Etching = 0,
    Terms = 1,
    Turbo = 2,
    Cenotaph = 127
}
export declare const FLAWS: {
    readonly Opcode: "non-pushdata opcode in OP_RETURN";
    readonly InvalidScript: "invalid script in OP_RETURN";
    readonly Varint: "invalid varint";
    readonly TruncatedField: "field with missing value";
    readonly TrailingIntegers: "trailing integers in body";
    readonly UnrecognizedEvenTag: "unrecognized even tag";
    readonly UnrecognizedFlag: "unrecognized flag";
    readonly SupplyOverflow: "supply overflows u128";
    readonly EdictRuneId: "invalid rune ID in edict";
    readonly EdictOutput: "edict output greater than transaction output count";
};
export type FlawType = keyof typeof FLAWS;
//# sourceMappingURL=constants.d.ts.map