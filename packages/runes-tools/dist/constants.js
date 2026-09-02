/**
 * Runes Protocol Constants (ord 0.29.0 / ordinals crate 0.0.17)
 */
export const U32_MAX = (1n << 32n) - 1n;
export const U64_MAX = (1n << 64n) - 1n;
export const U128_MAX = (1n << 128n) - 1n;
export const MAX_DIVISIBILITY = 38n;
export const MAX_SPACERS = 134217727n; // 0x07FFFFFF
export const RESERVED_RUNE_THRESHOLD = 6402364363415443603228541259936211926n; // 27 'A's
export const COMMIT_CONFIRMATIONS = 6;
export const FIRST_RUNE_HEIGHT = 840000;
export const UNLOCK_INTERVAL = 17500;
export const ALL_UNLOCKED_HEIGHT = 1050000;
export const MAX_SCRIPT_ELEMENT_SIZE = 520;
export const MAGIC_NUMBER = 0x5d; // OP_13 (OP_PUSHNUM_13)
export const OP_RETURN = 0x6a;
export var Tag;
(function (Tag) {
    Tag[Tag["Body"] = 0] = "Body";
    Tag[Tag["Flags"] = 2] = "Flags";
    Tag[Tag["Rune"] = 4] = "Rune";
    Tag[Tag["Premine"] = 6] = "Premine";
    Tag[Tag["Cap"] = 8] = "Cap";
    Tag[Tag["Amount"] = 10] = "Amount";
    Tag[Tag["HeightStart"] = 12] = "HeightStart";
    Tag[Tag["HeightEnd"] = 14] = "HeightEnd";
    Tag[Tag["OffsetStart"] = 16] = "OffsetStart";
    Tag[Tag["OffsetEnd"] = 18] = "OffsetEnd";
    Tag[Tag["Mint"] = 20] = "Mint";
    Tag[Tag["Pointer"] = 22] = "Pointer";
    Tag[Tag["Cenotaph"] = 126] = "Cenotaph";
    Tag[Tag["Divisibility"] = 1] = "Divisibility";
    Tag[Tag["Spacers"] = 3] = "Spacers";
    Tag[Tag["Symbol"] = 5] = "Symbol";
    Tag[Tag["Nop"] = 127] = "Nop";
})(Tag || (Tag = {}));
export const TAG_NAMES = {
    0: "Body",
    2: "Flags",
    4: "Rune",
    6: "Premine",
    8: "Cap",
    10: "Amount",
    12: "HeightStart",
    14: "HeightEnd",
    16: "OffsetStart",
    18: "OffsetEnd",
    20: "Mint",
    22: "Pointer",
    126: "Cenotaph (reserved)",
    1: "Divisibility",
    3: "Spacers",
    5: "Symbol",
    127: "Nop"
};
export var Flag;
(function (Flag) {
    Flag[Flag["Etching"] = 0] = "Etching";
    Flag[Flag["Terms"] = 1] = "Terms";
    Flag[Flag["Turbo"] = 2] = "Turbo";
    Flag[Flag["Cenotaph"] = 127] = "Cenotaph";
})(Flag || (Flag = {}));
export const FLAWS = {
    Opcode: "non-pushdata opcode in OP_RETURN",
    InvalidScript: "invalid script in OP_RETURN",
    Varint: "invalid varint",
    TruncatedField: "field with missing value",
    TrailingIntegers: "trailing integers in body",
    UnrecognizedEvenTag: "unrecognized even tag",
    UnrecognizedFlag: "unrecognized flag",
    SupplyOverflow: "supply overflows u128",
    EdictRuneId: "invalid rune ID in edict",
    EdictOutput: "edict output greater than transaction output count",
};
//# sourceMappingURL=constants.js.map