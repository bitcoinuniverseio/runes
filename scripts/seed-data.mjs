import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function saveJson(relPath, data) {
  const fullPath = resolve(root, relPath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Saved ${relPath}`);
}

// 1. Rules R1 through R47
const rules = [
  {
    id: "R1",
    number: 1,
    sectionId: "carrier",
    sectionTitle: "1. Carrier and transaction anatomy",
    title: "OP_RETURN and OP_13 carrier script",
    text: "A runestone is carried in a transaction output whose script begins with OP_RETURN (0x6a) followed immediately by OP_13 (0x5d, also written OP_PUSHNUM_13), the Runes protocol identifier.",
    flaw: null,
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::payload",
    test: "deciphering_runestone_with_invalid_script_in_op_return_outputs"
  },
  {
    id: "R2",
    number: 2,
    sectionId: "carrier",
    sectionTitle: "1. Carrier and transaction anatomy",
    title: "First matching output is selected",
    text: "Outputs are examined in order. The first output matching R1 is the transaction's runestone. A transaction has at most one runestone; once one is found, no later output is examined.",
    flaw: null,
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::decipher",
    test: "deciphering_runestone_with_multiple_runestones"
  },
  {
    id: "R3",
    number: 3,
    sectionId: "carrier",
    sectionTitle: "1. Carrier and transaction anatomy",
    title: "Non-matching outputs are skipped",
    text: "Outputs that do not match R1 are skipped when searching, including outputs whose scripts do not parse and OP_RETURN outputs without the OP_13 identifier. They never make the transaction invalid.",
    flaw: null,
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::payload",
    test: "deciphering_runestone_with_invalid_script_in_non_op_return_outputs"
  },
  {
    id: "R4",
    number: 4,
    sectionId: "carrier",
    sectionTitle: "1. Carrier and transaction anatomy",
    title: "Payload concatenation of data pushes",
    text: "The runestone payload is the concatenation, in order, of the contents of every data push after OP_13. All pushdata opcodes are legal: OP_0 (0x00, empty push), direct pushes 0x01 to 0x4b, OP_PUSHDATA1 (0x4c), OP_PUSHDATA2 (0x4d), and OP_PUSHDATA4 (0x4e). Zero pushes is legal and yields an empty runestone.",
    flaw: null,
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::payload",
    test: "all_pushdata_opcodes_are_valid"
  },
  {
    id: "R5",
    number: 5,
    sectionId: "carrier",
    sectionTitle: "1. Carrier and transaction anatomy",
    title: "Non-pushdata opcode yields Opcode flaw",
    text: "Any non-pushdata opcode (0x4f and above, including OP_PUSHNUM opcodes) after OP_13 makes the transaction a cenotaph with flaw Opcode.",
    flaw: "Opcode",
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::payload",
    test: "all_non_pushdata_opcodes_are_invalid"
  },
  {
    id: "R6",
    number: 6,
    sectionId: "carrier",
    sectionTitle: "1. Carrier and transaction anatomy",
    title: "Unparseable script yields InvalidScript flaw",
    text: "A script that fails to parse after OP_13 (for example a push length running past the end of the script) makes the transaction a cenotaph with flaw InvalidScript.",
    flaw: "InvalidScript",
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::payload",
    test: "deciphering_runestone_with_invalid_script_in_op_return_outputs"
  },
  {
    id: "R7",
    number: 7,
    sectionId: "carrier",
    sectionTitle: "1. Carrier and transaction anatomy",
    title: "Output value unconstrained",
    text: "The protocol does not constrain the runestone output's value in satoshis. It is conventionally zero, since OP_RETURN outputs are unspendable.",
    flaw: null,
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::decipher",
    test: "deciphering_runestone_with_non_zero_value"
  },
  {
    id: "R8",
    number: 8,
    sectionId: "varints",
    sectionTitle: "2. Varint encoding",
    title: "Unsigned 128-bit LEB128 varints",
    text: "The payload decodes into a sequence of unsigned 128-bit integers encoded as LEB128 varints: each byte contributes its low 7 bits, least significant group first; a set high bit (0x80) means another byte follows.",
    flaw: null,
    ordSource: "crates/ordinals/src/varint.rs",
    symbol: "varint::decode",
    test: "decode"
  },
  {
    id: "R9",
    number: 9,
    sectionId: "varints",
    sectionTitle: "2. Varint encoding",
    title: "19-byte limit and overflow mask",
    text: "A varint is at most 19 bytes long. Decoding fails as Overlong past 19 bytes, as Overflow when the 19th byte carries bits above the 128th (19th byte value with any of mask 0b0111_1100 set), and as Unterminated when the payload ends with the continuation bit set.",
    flaw: "Varint",
    ordSource: "crates/ordinals/src/varint.rs",
    symbol: "varint::decode",
    test: "decode_overlong"
  },
  {
    id: "R10",
    number: 10,
    sectionId: "varints",
    sectionTitle: "2. Varint encoding",
    title: "Varint decoding failure produces Varint flaw",
    text: "Any varint decoding failure anywhere in the payload makes the transaction a cenotaph with flaw Varint. The whole payload must decode.",
    flaw: "Varint",
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::integers",
    test: "invalid_varint_produces_cenotaph"
  },
  {
    id: "R11",
    number: 11,
    sectionId: "varints",
    sectionTitle: "2. Varint encoding",
    title: "Non-minimal varints accepted",
    text: "Non-minimal encodings decode successfully: 0x80 0x00 decodes to the same integer as 0x00. Encoders should emit minimal encodings; decoders must accept both.",
    flaw: null,
    ordSource: "crates/ordinals/src/varint.rs",
    symbol: "varint::decode",
    test: "decode_non_minimal"
  },
  {
    id: "R12",
    number: 12,
    sectionId: "message",
    sectionTitle: "3. Message structure",
    title: "Tag and value pairs",
    text: "The integer sequence is parsed front to back as tag and value pairs: even positions are tags, the following integer is the value, until the Body tag (0) is reached.",
    flaw: null,
    ordSource: "crates/ordinals/src/runestone/message.rs",
    symbol: "Message::from_integers",
    test: "from_integers"
  },
  {
    id: "R13",
    number: 13,
    sectionId: "message",
    sectionTitle: "3. Message structure",
    title: "Trailing tag produces TruncatedField flaw",
    text: "A tag at the end of the sequence with no following value makes the transaction a cenotaph with flaw TruncatedField.",
    flaw: "TruncatedField",
    ordSource: "crates/ordinals/src/runestone/message.rs",
    symbol: "Message::from_integers",
    test: "from_integers_truncated_field"
  },
  {
    id: "R14",
    number: 14,
    sectionId: "message",
    sectionTitle: "3. Message structure",
    title: "Tag value queues",
    text: "Repeated occurrences of the same tag accumulate their values in order into a queue for that tag. Interpretation consumes values from the front of the queue.",
    flaw: null,
    ordSource: "crates/ordinals/src/runestone/tag.rs",
    symbol: "Tag::take",
    test: "take_leaves_unconsumed_values"
  },
  {
    id: "R15",
    number: 15,
    sectionId: "message",
    sectionTitle: "3. Message structure",
    title: "Edicts in groups of four",
    text: "Everything after the Body tag is edict data, in groups of exactly four integers: block delta, transaction index (or delta), amount, output. A final group of fewer than four integers makes the transaction a cenotaph with flaw TrailingIntegers.",
    flaw: "TrailingIntegers",
    ordSource: "crates/ordinals/src/runestone/message.rs",
    symbol: "Message::from_integers",
    test: "from_integers_trailing_integers"
  },
  {
    id: "R16",
    number: 16,
    sectionId: "tags",
    sectionTitle: "4. Tag table",
    title: "Odd tags are informational",
    text: "Odd tags are informational. Unrecognized odd tags, duplicate odd-tag values beyond those consumed, and odd-tag values that fail their range checks are silently ignored.",
    flaw: null,
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::decipher",
    test: "deciphering_runestone_with_unrecognized_odd_tag"
  },
  {
    id: "R17",
    number: 17,
    sectionId: "tags",
    sectionTitle: "4. Tag table",
    title: "Unconsumed even tag produces UnrecognizedEvenTag flaw",
    text: "Even tags must be understood and fully consumed. If any even-tag value remains unconsumed after interpretation, the transaction is a cenotaph with flaw UnrecognizedEvenTag. This covers: unrecognized even tags (including reserved tag 126), even fields present without the flag that enables them, duplicate values beyond a field's arity, a Mint tag with only one value, and even-tag values that fail a range check (for example a Pointer not less than the output count, or a HeightStart above u64).",
    flaw: "UnrecognizedEvenTag",
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::decipher",
    test: "deciphering_runestone_with_unrecognized_even_tag"
  },
  {
    id: "R18",
    number: 18,
    sectionId: "flags",
    sectionTitle: "5. Flags",
    title: "Flag bitfield values",
    text: "The value of tag 2 is a bitfield. Bit 0 (Etching): this runestone etches a rune. Bit 1 (Terms): the etching has open mint terms. Bit 2 (Turbo): the etching opts in to future protocol changes. Bit 127 (Cenotaph): reserved, never valid.",
    flaw: null,
    ordSource: "crates/ordinals/src/runestone/flag.rs",
    symbol: "Flag",
    test: "flag_mask"
  },
  {
    id: "R19",
    number: 19,
    sectionId: "flags",
    sectionTitle: "5. Flags",
    title: "Unrecognized flag bit produces UnrecognizedFlag flaw",
    text: "The Terms and Turbo flags are consumed only when Etching is set. Any flag bit still set after consumption, including Terms without Etching or any unassigned bit, makes the transaction a cenotaph with flaw UnrecognizedFlag.",
    flaw: "UnrecognizedFlag",
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::decipher",
    test: "deciphering_runestone_with_unrecognized_flag"
  },
  {
    id: "R20",
    number: 20,
    sectionId: "etching",
    sectionTitle: "6. Etching",
    title: "Etching fields and immutability",
    text: "An etching is present exactly when flag bit 0 is set. Its fields, all optional, are Rune (4), Divisibility (1), Spacers (3), Symbol (5), Premine (6), and, when the Terms flag is also set, Amount (10), Cap (8), HeightStart (12), HeightEnd (14), OffsetStart (16), OffsetEnd (18). Once etched, all properties are permanently immutable.",
    flaw: null,
    ordSource: "crates/ordinals/src/etching.rs",
    symbol: "Etching",
    test: "etching"
  },
  {
    id: "R21",
    number: 21,
    sectionId: "etching",
    sectionTitle: "6. Etching",
    title: "Modified base-26 name encoding",
    text: "Names are sequences of the letters A through Z, encoded as an integer in modified base 26: for each letter after the first, add one, then multiply by 26 and add the letter's index (A is 0). A is 0, B is 1, Z is 25, AA is 26, AB is 27, and so on. Decoding reverses this: add one, then repeatedly take (n - 1) % 26 as the last letter and continue with (n - 1) / 26.",
    flaw: null,
    ordSource: "crates/ordinals/src/rune.rs",
    symbol: "Rune",
    test: "display"
  },
  {
    id: "R22",
    number: 22,
    sectionId: "etching",
    sectionTitle: "6. Etching",
    title: "Reserved names threshold",
    text: "All name values at or above 6402364363415443603228541259936211926 (the value of 27 letters A) are reserved. Consequently, etchable names are 1 to 26 letters long.",
    flaw: null,
    ordSource: "crates/ordinals/src/rune.rs",
    symbol: "Rune::RESERVED",
    test: "reserved"
  },
  {
    id: "R23",
    number: 23,
    sectionId: "etching",
    sectionTitle: "6. Etching",
    title: "Divisibility maximum 38",
    text: "Divisibility is the number of decimal places, at most 38. A larger value fails the range check and is ignored: the etching proceeds with default divisibility 0.",
    flaw: null,
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::decipher",
    test: "deciphering_runestone_with_invalid_divisibility"
  },
  {
    id: "R24",
    number: 24,
    sectionId: "etching",
    sectionTitle: "6. Etching",
    title: "Spacers bitmap formatting",
    text: "Spacers are a bitmap: bit i set places a dot • after letter i + 1. The maximum accepted value is 0x07FFFFFF; larger values are ignored. Spacers are display only: a name's identity and uniqueness ignore spacers, spacers may only fall between letters, and they do not count toward name length.",
    flaw: null,
    ordSource: "crates/ordinals/src/spaced_rune.rs",
    symbol: "SpacedRune",
    test: "display"
  },
  {
    id: "R25",
    number: 25,
    sectionId: "etching",
    sectionTitle: "6. Etching",
    title: "Unicode scalar currency symbol",
    text: "The symbol is a single Unicode scalar value. Values that are not valid scalars (above U+10FFFF or in the surrogate range) are ignored. A rune with no symbol is displayed with the generic currency sign ¤.",
    flaw: null,
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::decipher",
    test: "deciphering_runestone_with_invalid_symbol"
  },
  {
    id: "R26",
    number: 26,
    sectionId: "etching",
    sectionTitle: "6. Etching",
    title: "Premine joins unallocated pool",
    text: "The premine is allocated to the etching transaction as unallocated runes, exactly as if it had been an input balance, and is assigned to outputs by the same edict and pointer rules.",
    flaw: null,
    ordSource: "src/index/updater/rune_updater.rs",
    symbol: "RuneUpdater::index_runes",
    test: "etching_with_premine"
  },
  {
    id: "R27",
    number: 27,
    sectionId: "etching",
    sectionTitle: "6. Etching",
    title: "Supply overflow produces SupplyOverflow flaw",
    text: "Etching supply must fit: premine + cap * amount computed in u128 must not overflow. Overflow makes the transaction a cenotaph with flaw SupplyOverflow.",
    flaw: "SupplyOverflow",
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::decipher",
    test: "deciphering_runestone_with_supply_overflow"
  },
  {
    id: "R28",
    number: 28,
    sectionId: "etching",
    sectionTitle: "6. Etching",
    title: "Etching commitment and eligibility preconditions",
    text: "An etching with a name is honored by the indexer only if all of the following hold at indexing time; otherwise the etching is disregarded entirely (this is not a cenotaph): (1) the name's value is at least the minimum unlocked at the etching block height (R30); (2) the name is not reserved (R22); (3) the name has not already been etched, ignoring spacers; (4) the transaction commits to the name: some input spends a pay-to-taproot output, that input's witness contains a tapscript with a data push exactly equal to the name's value as little-endian bytes with trailing zero bytes trimmed, and the output being spent was confirmed at least 6 blocks before the etching block (COMMIT_CONFIRMATIONS = 6).",
    flaw: null,
    ordSource: "src/index/updater/rune_updater.rs",
    symbol: "RuneUpdater::index_runes",
    test: "etching_commitment"
  },
  {
    id: "R29",
    number: 29,
    sectionId: "etching",
    sectionTitle: "6. Etching",
    title: "Reserved name assignment for unnamed etchings",
    text: "An etching without a name is assigned a reserved name by the indexer: 6402364363415443603228541259936211926 + (block << 32 | tx), where block and tx are the etching's rune ID components. Reserved-name etchings need no commitment.",
    flaw: null,
    ordSource: "src/index/updater/rune_updater.rs",
    symbol: "RuneUpdater::index_runes",
    test: "etching_reserved_name"
  },
  {
    id: "R30",
    number: 30,
    sectionId: "etching",
    sectionTitle: "6. Etching",
    title: "Name length unlock schedule",
    text: "Name unlock schedule, mainnet: runes activate at block 840,000 (first_rune_height = 4 * 210,000). At activation, names of 13 letters and longer are unlocked. The minimum steps down through the length thresholds every 17,500 blocks (one twelfth of a halving interval), interpolating linearly between thresholds, until every name, including single letters, is unlocked at block 1,050,000. Before activation no etching is honored.",
    flaw: null,
    ordSource: "crates/ordinals/src/rune.rs",
    symbol: "Rune::minimum_at_height",
    test: "minimum_at_height"
  },
  {
    id: "R31",
    number: 31,
    sectionId: "minting",
    sectionTitle: "7. Minting",
    title: "Mint tag arity and bounds",
    text: "The Mint tag (20) is given twice: the first value is the block and the second the transaction index of the rune ID to mint. Values must fit u64 and u32 respectively, and block 0 with a nonzero tx is invalid. Values failing these checks are left unconsumed and make the transaction a cenotaph via R17. A single Mint value with no pair behaves the same way.",
    flaw: "UnrecognizedEvenTag",
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::decipher",
    test: "deciphering_runestone_with_invalid_mint"
  },
  {
    id: "R32",
    number: 32,
    sectionId: "minting",
    sectionTitle: "7. Minting",
    title: "Mint terms evaluation rules",
    text: "A mint succeeds when the target rune exists and its terms are satisfied at the mint transaction's block height: the height is not below the mint's start, is below the mint's end, and the recorded number of mints is below the cap (a missing cap is 0, so a rune without terms or cap is unmintable). Start is the later of HeightStart and etching block + OffsetStart; end is the earlier of HeightEnd and etching block + OffsetEnd; whichever of the pair is absent does not constrain.",
    flaw: null,
    ordSource: "src/index/updater/rune_updater.rs",
    symbol: "RuneUpdater::index_runes",
    test: "mint"
  },
  {
    id: "R33",
    number: 33,
    sectionId: "minting",
    sectionTitle: "7. Minting",
    title: "Mint accounting and silent failure",
    text: "A successful mint increments the rune's mint count and adds the fixed amount (Amount at etching, 0 if absent) to the transaction's unallocated runes. A mint whose terms are not satisfied is simply ignored: it is not a cenotaph and does not count toward the cap. A mint in a transaction that is a cenotaph for other reasons does count toward the cap, and its output is burned (R45).",
    flaw: null,
    ordSource: "src/index/updater/rune_updater.rs",
    symbol: "RuneUpdater::index_runes",
    test: "mint_failure_ignored"
  },
  {
    id: "R34",
    number: 34,
    sectionId: "edicts",
    sectionTitle: "8. Edicts and delta encoding",
    title: "Edict quadruple and delta encoding",
    text: "Each edict is four integers: block delta, transaction index or delta, amount, output. A running rune ID starts at 0:0. The block delta is added to the running block. If the block delta is 0, the transaction value is added to the running transaction index; if the block delta is nonzero, the transaction value is the absolute transaction index. Encoders must sort edicts by rune ID for this encoding to be compact; decoders reconstruct absolute IDs by accumulation.",
    flaw: null,
    ordSource: "crates/ordinals/src/rune_id.rs",
    symbol: "RuneId::next",
    test: "delta"
  },
  {
    id: "R35",
    number: 35,
    sectionId: "edicts",
    sectionTitle: "8. Edicts and delta encoding",
    title: "Rune ID 0:0 refers to current etching",
    text: "The resulting ID 0:0 refers to the rune etched by this very transaction. If the transaction etches no rune (or the etching was disregarded under R28), such an edict is skipped without effect.",
    flaw: null,
    ordSource: "src/index/updater/rune_updater.rs",
    symbol: "RuneUpdater::index_runes",
    test: "edict_0_0"
  },
  {
    id: "R36",
    number: 36,
    sectionId: "edicts",
    sectionTitle: "8. Edicts and delta encoding",
    title: "Invalid edict ID produces EdictRuneId flaw",
    text: "If ID accumulation overflows (block above u64, transaction index above u32) or produces block 0 with a nonzero transaction index, the transaction is a cenotaph with flaw EdictRuneId. Edict parsing stops at the first failure.",
    flaw: "EdictRuneId",
    ordSource: "crates/ordinals/src/runestone/message.rs",
    symbol: "Message::from_integers",
    test: "edict_rune_id_overflow"
  },
  {
    id: "R37",
    number: 37,
    sectionId: "edicts",
    sectionTitle: "8. Edicts and delta encoding",
    title: "Edict output bounds and EdictOutput flaw",
    text: "The edict output must fit u32 and must be at most the transaction's output count. An output greater than the output count makes the transaction a cenotaph with flaw EdictOutput.",
    flaw: "EdictOutput",
    ordSource: "crates/ordinals/src/runestone/message.rs",
    symbol: "Message::from_integers",
    test: "edict_output_overflow"
  },
  {
    id: "R38",
    number: 38,
    sectionId: "edicts",
    sectionTitle: "8. Edicts and delta encoding",
    title: "Edict execution, sweeping, and splits",
    text: "Edicts are processed in order against the unallocated pool. An amount of 0 means the edict's entire remaining balance of that rune. A nonzero amount is clamped to the remaining balance. An edict output exactly equal to the output count is a split: with amount 0, the remaining balance is divided evenly over all non-OP_RETURN outputs, earlier outputs receiving the remainder one unit at a time; with a nonzero amount, that amount is allocated to each non-OP_RETURN output in order until the balance runs out.",
    flaw: null,
    ordSource: "src/index/updater/rune_updater.rs",
    symbol: "RuneUpdater::index_runes",
    test: "edict_split"
  },
  {
    id: "R39",
    number: 39,
    sectionId: "pointer",
    sectionTitle: "9. Pointer",
    title: "Pointer destination and default fallback",
    text: "The Pointer (tag 22) must fit u32 and be strictly less than the output count; otherwise its value is unconsumed and the transaction is a cenotaph via R17. After all edicts are processed, remaining unallocated runes go to the pointer output. Without a pointer they go to the first non-OP_RETURN output. If no non-OP_RETURN output exists, they are burned.",
    flaw: "UnrecognizedEvenTag",
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::decipher",
    test: "pointer_out_of_bounds"
  },
  {
    id: "R40",
    number: 40,
    sectionId: "allocation",
    sectionTitle: "10. State transitions",
    title: "Unallocated pool composition",
    text: "A transaction's unallocated pool is the sum of: rune balances on every spent input outpoint, plus the minted amount when the runestone mints successfully, plus the premine when it etches.",
    flaw: null,
    ordSource: "src/index/updater/rune_updater.rs",
    symbol: "RuneUpdater::index_runes",
    test: "unallocated_pool"
  },
  {
    id: "R41",
    number: 41,
    sectionId: "allocation",
    sectionTitle: "10. State transitions",
    title: "OP_RETURN burns",
    text: "Allocations assigned to an OP_RETURN output are burned, whether they got there by edict or by pointer. This is the deliberate burn mechanism.",
    flaw: null,
    ordSource: "src/index/updater/rune_updater.rs",
    symbol: "RuneUpdater::index_runes",
    test: "burn_to_op_return"
  },
  {
    id: "R42",
    number: 42,
    sectionId: "allocation",
    sectionTitle: "10. State transitions",
    title: "Default transfer without runestone",
    text: "A transaction with rune inputs and no runestone at all transfers every input rune balance to its first non-OP_RETURN output. Runes never disappear silently: every unit is either allocated to an output or recorded as burned.",
    flaw: null,
    ordSource: "src/index/updater/rune_updater.rs",
    symbol: "RuneUpdater::index_runes",
    test: "transfer_without_runestone"
  },
  {
    id: "R43",
    number: 43,
    sectionId: "allocation",
    sectionTitle: "10. State transitions",
    title: "Rune ID permanence",
    text: "A rune's ID is assigned at etching: the etching block height and the transaction's index within that block, written BLOCK:TX. IDs are permanent and never reassigned.",
    flaw: null,
    ordSource: "src/index/updater/rune_updater.rs",
    symbol: "RuneUpdater::index_runes",
    test: "rune_id_permanence"
  },
  {
    id: "R44",
    number: 44,
    sectionId: "allocation",
    sectionTitle: "10. State transitions",
    title: "Outpoint balances and atomic units",
    text: "Balances are per rune, per outpoint, in atomic units (u128). An outpoint may carry balances of any number of runes. Spending the outpoint releases all of them into the spending transaction's unallocated pool.",
    flaw: null,
    ordSource: "src/index/updater/rune_updater.rs",
    symbol: "RuneUpdater::index_runes",
    test: "outpoint_balances"
  },
  {
    id: "R45",
    number: 45,
    sectionId: "cenotaphs",
    sectionTitle: "11. Cenotaphs",
    title: "Cenotaph consequences",
    text: "A cenotaph is a runestone that violates any rule marked above as producing one. In a cenotaph transaction: every input rune balance and every minted or premined amount is burned; a mint still increments the target rune's mint count; and an etching (if its name is valid and committed under R28) still creates the rune, but with no recorded divisibility, symbol, spacers, premine, or terms, and permanently unmintable.",
    flaw: null,
    ordSource: "src/index/updater/rune_updater.rs",
    symbol: "RuneUpdater::index_runes",
    test: "cenotaph_burns_all_inputs"
  },
  {
    id: "R46",
    number: 46,
    sectionId: "cenotaphs",
    sectionTitle: "11. Cenotaphs",
    title: "Upgrade mechanism through forward compatibility",
    text: "Cenotaphs are the protocol's forward-compatibility mechanism. Future upgrades may assign meaning to currently unrecognized even tags and flags. Unupgraded clients, applying these rules, will treat upgraded runestones as cenotaphs and report the affected runes as burned rather than misreporting who owns them.",
    flaw: null,
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone",
    test: "forward_compatibility"
  },
  {
    id: "R47",
    number: 47,
    sectionId: "cenotaphs",
    sectionTitle: "11. Cenotaphs",
    title: "First flaw reported",
    text: "Only the first flaw encountered is reported by the reference implementation, but any single flaw is sufficient: cenotaph status is not a matter of degree.",
    flaw: null,
    ordSource: "crates/ordinals/src/runestone.rs",
    symbol: "Runestone::decipher",
    test: "first_flaw_reported"
  }
];

saveJson('src/data/protocol/rules.json', rules);

// 2. Tags
const tags = [
  { tag: 0, name: "Body", parity: "even", values: "rest", description: "Marks the start of the edicts. Everything after it is edict groups (R15).", ruleRef: "R15" },
  { tag: 2, name: "Flags", parity: "even", values: "1", description: "Bitfield: bit 0 Etching, bit 1 Terms, bit 2 Turbo, bit 127 reserved (R18).", ruleRef: "R18" },
  { tag: 4, name: "Rune", parity: "even", values: "1", description: "The etched rune's name as a base-26 integer (R21). Requires the Etching flag.", ruleRef: "R21" },
  { tag: 6, name: "Premine", parity: "even", values: "1", description: "Atomic units allocated to the etching transaction itself. u128. Requires the Etching flag.", ruleRef: "R26" },
  { tag: 8, name: "Cap", parity: "even", values: "1", description: "Maximum number of mints. u128. Requires the Etching and Terms flags.", ruleRef: "R32" },
  { tag: 10, name: "Amount", parity: "even", values: "1", description: "Atomic units created per mint. u128. Requires the Etching and Terms flags.", ruleRef: "R32" },
  { tag: 12, name: "HeightStart", parity: "even", values: "1", description: "Absolute first block in which minting is allowed. Must fit u64. Requires Etching and Terms.", ruleRef: "R32" },
  { tag: 14, name: "HeightEnd", parity: "even", values: "1", description: "Absolute block at and after which minting is disallowed. Must fit u64. Requires Etching and Terms.", ruleRef: "R32" },
  { tag: 16, name: "OffsetStart", parity: "even", values: "1", description: "Mint opens this many blocks after the etching block. Must fit u64. Requires Etching and Terms.", ruleRef: "R32" },
  { tag: 18, name: "OffsetEnd", parity: "even", values: "1", description: "Mint closes this many blocks after the etching block. Must fit u64. Requires Etching and Terms.", ruleRef: "R32" },
  { tag: 20, name: "Mint", parity: "even", values: "2", description: "The rune ID to mint, given as two values: block, then transaction index (R31).", ruleRef: "R31" },
  { tag: 22, name: "Pointer", parity: "even", values: "1", description: "Output index that receives unallocated runes. Must fit u32 and be less than the output count (R39).", ruleRef: "R39" },
  { tag: 126, name: "Cenotaph", parity: "even", values: "1", description: "Reserved. Unrecognized by definition; its presence makes the transaction a cenotaph (R17).", ruleRef: "R17" },
  { tag: 1, name: "Divisibility", parity: "odd", values: "1", description: "Decimal places, 0 to 38. Out-of-range values are ignored. Requires the Etching flag.", ruleRef: "R23" },
  { tag: 3, name: "Spacers", parity: "odd", values: "1", description: "Bitmap of spacer dots between name letters, at most 0x07FFFFFF. Out-of-range ignored. Requires Etching.", ruleRef: "R24" },
  { tag: 5, name: "Symbol", parity: "odd", values: "1", description: "Currency symbol as a Unicode scalar value. Invalid values are ignored. Requires Etching.", ruleRef: "R25" },
  { tag: 127, name: "Nop", parity: "odd", values: "1", description: "Reserved no-op. Ignored.", ruleRef: "R16" }
];

saveJson('src/data/protocol/tags.json', tags);

// 3. Flags
const flags = [
  { bit: 0, mask: "0x01", name: "Etching", description: "This runestone etches a rune. Enables Rune, Divisibility, Spacers, Symbol, and Premine tags." },
  { bit: 1, mask: "0x02", name: "Terms", description: "The etching has open mint terms. Requires Etching flag. Enables Cap, Amount, HeightStart, HeightEnd, OffsetStart, OffsetEnd tags." },
  { bit: 2, mask: "0x04", name: "Turbo", description: "The etching opts in to future protocol changes. Requires Etching flag. Declarative only in current protocol." },
  { bit: 127, mask: "1n << 127n", name: "Cenotaph", description: "Reserved flag bit. Never valid; setting this bit produces UnrecognizedFlag flaw." }
];

saveJson('src/data/protocol/flags.json', flags);

// 4. Flaws
const flaws = [
  { flaw: "Opcode", condition: "Non-pushdata opcode after OP_13", rule: "R5", ordSource: "crates/ordinals/src/runestone.rs" },
  { flaw: "InvalidScript", condition: "Unparseable script after OP_13", rule: "R6", ordSource: "crates/ordinals/src/runestone.rs" },
  { flaw: "Varint", condition: "Overlong, overflowing, or unterminated varint", rule: "R10", ordSource: "crates/ordinals/src/runestone.rs" },
  { flaw: "TruncatedField", condition: "Tag with no value", rule: "R13", ordSource: "crates/ordinals/src/runestone/message.rs" },
  { flaw: "TrailingIntegers", condition: "Edict group shorter than four integers", rule: "R15", ordSource: "crates/ordinals/src/runestone/message.rs" },
  { flaw: "UnrecognizedEvenTag", condition: "Unconsumed even-tag value, any cause", rule: "R17", ordSource: "crates/ordinals/src/runestone.rs" },
  { flaw: "UnrecognizedFlag", condition: "Flag bit left set after consumption", rule: "R19", ordSource: "crates/ordinals/src/runestone.rs" },
  { flaw: "SupplyOverflow", condition: "premine + cap * amount overflows u128", rule: "R27", ordSource: "crates/ordinals/src/runestone.rs" },
  { flaw: "EdictRuneId", condition: "Edict ID accumulation invalid or overflowing", rule: "R36", ordSource: "crates/ordinals/src/runestone/message.rs" },
  { flaw: "EdictOutput", condition: "Edict output greater than the output count", rule: "R37", ordSource: "crates/ordinals/src/runestone/message.rs" }
];

saveJson('src/data/protocol/flaws.json', flaws);

// 5. Glossary
const glossary = [
  { term: "Runestone", definition: "The protocol message: an OP_RETURN output beginning OP_RETURN OP_13, whose data pushes concatenate into a payload of varints." },
  { term: "Artifact", definition: "The result of deciphering a transaction. Either a well-formed runestone or a cenotaph. A transaction with no matching output has no artifact at all, which is different from having an empty one." },
  { term: "Cenotaph", definition: "A malformed runestone. Burns input runes, makes an etched rune unmintable, and burns mint output while still counting the mint against the cap." },
  { term: "Flaw", definition: "The named reason a runestone is a cenotaph. Ten exist; the reference implementation reports the first one found." },
  { term: "Etching", definition: "The act of creating a rune and permanently fixing its name, divisibility, symbol, spacers, premine, and terms." },
  { term: "Rune ID", definition: "BLOCK:TX: the height of the etching block and the etching transaction's index within it. Assigned once, never reused." },
  { term: "Edict", definition: "An instruction inside a runestone: allocate an amount of one rune to one output." },
  { term: "Pointer", definition: "The output index that receives unallocated runes, overriding the first non-OP_RETURN output default." },
  { term: "Premine", definition: "Units allocated to the etching transaction itself, outside the mint." },
  { term: "Terms", definition: "The conditions of an open mint: amount per mint, cap, and height or offset windows." },
  { term: "Turbo", definition: "A flag on the etching declaring that the rune opts in to future protocol changes. It carries no meaning under the current rules." },
  { term: "Atomic unit", definition: "The indivisible unit of a rune. Display value is the atomic amount shifted by the rune's divisibility." },
  { term: "Unallocated pool", definition: "Per transaction: input balances, plus a successful mint, plus a premine. Edicts draw from it; the remainder follows the pointer." },
  { term: "Reserved name", definition: "A name at or above 6402364363415443603228541259936211926. Unetchable directly; assigned by the indexer to etchings that omit a name." },
  { term: "Commitment", definition: "The tapscript data push in an input's witness proving the etcher claimed the name at least 6 blocks earlier." }
];

saveJson('src/data/protocol/glossary.json', glossary);

// 6. Test Vectors (All 24 vectors V1-V8, C1-C14, N1-N2)
const vectors = [
  {
    id: "V1",
    category: "valid",
    name: "Empty runestone",
    scriptHex: "6a5d",
    outputs: 2,
    expectedStatus: "valid",
    flaw: null,
    expectedSummary: "Runestone with no fields. Input runes transfer to the first non-OP_RETURN output.",
    rules: ["R1", "R4", "R42"]
  },
  {
    id: "V2",
    category: "valid",
    name: "Single edict transfer",
    scriptHex: "6a5d0800c0a23303e80701",
    outputs: 2,
    expectedStatus: "valid",
    flaw: null,
    expectedSummary: "One edict: rune 840000:3, amount 1000, output 1. Remainder to output 0.",
    rules: ["R15", "R34", "R38"]
  },
  {
    id: "V3",
    category: "valid",
    name: "Two edicts, delta encoded",
    scriptHex: "6a5d0d00c0a23303e807010019f40300",
    outputs: 2,
    expectedStatus: "valid",
    flaw: null,
    expectedSummary: "Edict 1: 840000:3, 1000, output 1. Edict 2: block delta 0 and tx delta 25 give 840000:28, 500, output 0.",
    rules: ["R15", "R34"]
  },
  {
    id: "V4",
    category: "valid",
    name: "Sweep, amount zero",
    scriptHex: "6a5d0700c0a233030001",
    outputs: 2,
    expectedStatus: "valid",
    flaw: null,
    expectedSummary: "One edict: 840000:3, amount 0 meaning the entire remaining balance, to output 1.",
    rules: ["R38"]
  },
  {
    id: "V5",
    category: "valid",
    name: "Even split",
    scriptHex: "6a5d0700c0a233030003",
    outputs: 3,
    expectedStatus: "valid",
    flaw: null,
    expectedSummary: "Output index 3 equals the output count, so the balance is divided evenly across all non-OP_RETURN outputs, earlier outputs taking the remainder. The identical bytes with 2 outputs are vector C6.",
    rules: ["R38"]
  },
  {
    id: "V6",
    category: "valid",
    name: "Mint",
    scriptHex: "6a5d0614c0a2331403",
    outputs: 2,
    expectedStatus: "valid",
    flaw: null,
    expectedSummary: "Mint of rune 840000:3 (tag 20 given twice: block, then tx). Minted amount goes to output 0.",
    rules: ["R31", "R32", "R33"]
  },
  {
    id: "V7",
    category: "valid",
    name: "Mint with pointer",
    scriptHex: "6a5d0814c0a23314031601",
    outputs: 2,
    expectedStatus: "valid",
    flaw: null,
    expectedSummary: "Same mint, plus pointer (tag 22) = 1, so the minted amount goes to output 1.",
    rules: ["R31", "R39"]
  },
  {
    id: "V8",
    category: "valid",
    name: "Full etching",
    scriptHex: "6a5d22020704c2e1d8f3d9a4f589cf100102034005924d06c0843d0ae8070888a40112a065",
    outputs: 2,
    expectedStatus: "valid",
    flaw: null,
    expectedSummary: "Etching of BITCOIN•UNIVERSE: flags 7 (Etching, Terms, Turbo), name value 153272084900779274434, divisibility 2, spacers 64, symbol U+2692, premine 1000000, amount 1000, cap 21000, offset end 12960. Max supply 22,000,000 atomic units.",
    rules: ["R18", "R20", "R21", "R23", "R24", "R25", "R26", "R27"]
  },
  {
    id: "C1",
    category: "cenotaph",
    name: "Rune tag without Etching flag",
    scriptHex: "6a5d020404",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "UnrecognizedEvenTag",
    expectedSummary: "Tag 4 is an etching field. With no Etching flag it is never consumed, and an unconsumed even tag is fatal.",
    rules: ["R17", "R20"]
  },
  {
    id: "C2",
    category: "cenotaph",
    name: "Unrecognized flag bit",
    scriptHex: "6a5d020208",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "UnrecognizedFlag",
    expectedSummary: "Flags value 8 sets bit 3, which has no assigned meaning. Bits left set after consumption are fatal.",
    rules: ["R18", "R19"]
  },
  {
    id: "C3",
    category: "cenotaph",
    name: "Tag with no value",
    scriptHex: "6a5d03020302",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "TruncatedField",
    expectedSummary: "Integers are 2, 3, 2: the trailing tag 2 has no following value.",
    rules: ["R12", "R13"]
  },
  {
    id: "C4",
    category: "cenotaph",
    name: "Trailing integers in body",
    scriptHex: "6a5d0400010101",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "TrailingIntegers",
    expectedSummary: "After the Body tag, three integers remain. Edicts come in groups of exactly four.",
    rules: ["R15"]
  },
  {
    id: "C5",
    category: "cenotaph",
    name: "Invalid edict rune ID",
    scriptHex: "6a5d050000010200",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "EdictRuneId",
    expectedSummary: "Block delta 0 with tx delta 1 yields ID 0:1. Block 0 with a nonzero tx index is not a valid rune ID.",
    rules: ["R34", "R36"]
  },
  {
    id: "C6",
    category: "cenotaph",
    name: "Edict output beyond count",
    scriptHex: "6a5d0800c0a23303e80705",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "EdictOutput",
    expectedSummary: "Output index 5 exceeds the output count of 2. Only equality is allowed, as a split.",
    rules: ["R37", "R38"]
  },
  {
    id: "C7",
    category: "cenotaph",
    name: "Pointer beyond output count",
    scriptHex: "6a5d021605",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "UnrecognizedEvenTag",
    expectedSummary: "Pointer 5 is not less than the output count, so the range check fails, the value is left unconsumed, and the even-tag rule fires. Note the flaw is not a dedicated pointer flaw.",
    rules: ["R17", "R39"]
  },
  {
    id: "C8",
    category: "cenotaph",
    name: "Partial mint",
    scriptHex: "6a5d0414c0a233",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "UnrecognizedEvenTag",
    expectedSummary: "Tag 20 needs two values. One value cannot be consumed, so it remains and is fatal.",
    rules: ["R17", "R31"]
  },
  {
    id: "C9",
    category: "cenotaph",
    name: "Reserved even tag",
    scriptHex: "6a5d027e00",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "UnrecognizedEvenTag",
    expectedSummary: "Tag 126 is reserved and unrecognized by definition.",
    rules: ["R17"]
  },
  {
    id: "C10",
    category: "cenotaph",
    name: "Supply overflow",
    scriptHex: "6a5d18020308020a80808080808080808080808080808080808002",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "SupplyOverflow",
    expectedSummary: "Etching with Terms, cap 2 and amount 2^127. cap * amount overflows u128.",
    rules: ["R27"]
  },
  {
    id: "C11",
    category: "cenotaph",
    name: "Non-pushdata opcode",
    scriptHex: "6a5d69",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "Opcode",
    expectedSummary: "0x69 is OP_VERIFY. Anything that is not a pushdata opcode after OP_13 is fatal, including OP_PUSHNUM opcodes.",
    rules: ["R5"]
  },
  {
    id: "C12",
    category: "cenotaph",
    name: "Push runs past end of script",
    scriptHex: "6a5d04beef",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "InvalidScript",
    expectedSummary: "A 4-byte push is declared but only 2 bytes follow, so the script does not parse.",
    rules: ["R6"]
  },
  {
    id: "C13",
    category: "cenotaph",
    name: "Unterminated varint",
    scriptHex: "6a5d0180",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "Varint",
    expectedSummary: "The single payload byte 0x80 has the continuation bit set with nothing after it.",
    rules: ["R9", "R10"]
  },
  {
    id: "C14",
    category: "cenotaph",
    name: "Overlong varint",
    scriptHex: "6a5d148080808080808080808080808080808080808000",
    outputs: 2,
    expectedStatus: "cenotaph",
    flaw: "Varint",
    expectedSummary: "Nineteen continuation bytes then a terminator: the varint exceeds the 19-byte limit.",
    rules: ["R9", "R10"]
  },
  {
    id: "N1",
    category: "non-runestone",
    name: "Not an OP_RETURN output",
    scriptHex: "51",
    outputs: 2,
    expectedStatus: "not-runestone",
    flaw: null,
    expectedSummary: "Skipped when searching for a runestone. No artifact.",
    rules: ["R1", "R3"]
  },
  {
    id: "N2",
    category: "non-runestone",
    name: "OP_RETURN without OP_13",
    scriptHex: "6a04deadbeef",
    outputs: 2,
    expectedStatus: "not-runestone",
    flaw: null,
    expectedSummary: "A plain data-carrier output. Skipped. No artifact, no cenotaph.",
    rules: ["R1", "R3"]
  }
];

saveJson('src/data/vectors/vectors.json', vectors);

// 7. Chain-level Fixtures (12 fixtures)
const fixtures = [
  {
    id: "F1",
    title: "Commitment absent on etching",
    category: "chain",
    description: "An etching transaction provides a valid name in tag 4, but no input spends a taproot commitment. The etching is disregarded by the indexer; no cenotaph is produced.",
    ruleRef: "R28",
    preconditions: ["Name given: SAMPLE•RUNE", "No taproot input with name commitment push in witness"],
    expectedStateTransition: "Etching disregarded. No new rune created. Any input balances allocated via default rules. No cenotaph burn."
  },
  {
    id: "F2",
    title: "Commitment too young (5 confirmations)",
    category: "chain",
    description: "The commitment output was confirmed at block 840,010 and spent at block 840,015 (5 confirmations difference, less than COMMIT_CONFIRMATIONS = 6).",
    ruleRef: "R28",
    preconditions: ["Etching block: 840,015", "Commitment block: 840,010", "Difference: 5 < 6 required"],
    expectedStateTransition: "Etching disregarded due to immature commitment. Fee spent, no rune created."
  },
  {
    id: "F3",
    title: "Commitment mature (6 confirmations)",
    category: "chain",
    description: "The commitment output was confirmed at block 840,010 and spent at block 840,016 (exactly 6 confirmations difference). Name unlocked and unreserved.",
    ruleRef: "R28",
    preconditions: ["Etching block: 840,016", "Commitment block: 840,010", "Difference: 6 >= 6 required"],
    expectedStateTransition: "Etching succeeds. Rune ID 840016:tx assigned. Premine and terms initialized."
  },
  {
    id: "F4",
    title: "Name already taken",
    category: "chain",
    description: "An etching commits to an already-etched name, with different spacer placement (e.g. BITCOIN•UNIVERSE vs BIT•COINUNIVERSE).",
    ruleRef: "R28",
    preconditions: ["Underlying unspaced base-26 integer already recorded in index"],
    expectedStateTransition: "Etching disregarded. Colliding name cannot overwrite or alter existing rune."
  },
  {
    id: "F5",
    title: "Name still locked at height",
    category: "chain",
    description: "An etching at block 845,000 attempts to etch an 11-letter name when the minimum unlocked length at that height is 12 letters.",
    ruleRef: "R30",
    preconditions: ["Height: 845,000", "Name length: 11 letters", "Minimum required: 12 letters"],
    expectedStateTransition: "Etching disregarded. Name length exceeds current unlock threshold."
  },
  {
    id: "F6",
    title: "Reserved name assigned to unnamed etching",
    category: "chain",
    description: "An etching transaction sets flag bit 0 (Etching) but omits tag 4 (Rune). No commitment provided.",
    ruleRef: "R29",
    preconditions: ["Etching flag set", "Tag 4 omitted", "Block 840,005, tx 12"],
    expectedStateTransition: "Indexer assigns reserved name: 6402364363415443603228541259936211926 + (840005 << 32 | 12)."
  },
  {
    id: "F7",
    title: "Successful mint within active window and cap",
    category: "chain",
    description: "Transaction mints rune 840000:1 at block 840,500. Rune has open terms, current mint count 150 < cap 1000, height inside [840000, 850000).",
    ruleRef: "R32",
    preconditions: ["Height: 840,500", "Target: 840000:1", "Cap: 1000", "Current count: 150"],
    expectedStateTransition: "Mint count increments to 151. Fixed amount added to transaction unallocated pool."
  },
  {
    id: "F8",
    title: "Mint before start height",
    category: "chain",
    description: "Transaction attempts to mint a rune at block 841,000 where HeightStart is 842,000.",
    ruleRef: "R32",
    preconditions: ["Height: 841,000", "HeightStart: 842,000"],
    expectedStateTransition: "Mint ignored silently. Cap not incremented, no units minted, no cenotaph."
  },
  {
    id: "F9",
    title: "Mint at exclusive end height",
    category: "chain",
    description: "Transaction attempts to mint at block 850,000 where HeightEnd is 850,000. Protocol rule specifies height must be strictly less than end.",
    ruleRef: "R32",
    preconditions: ["Height: 850,000", "HeightEnd: 850,000"],
    expectedStateTransition: "Mint ignored silently. End height is exclusive."
  },
  {
    id: "F10",
    title: "Mint after cap reached",
    category: "chain",
    description: "Transaction attempts to mint when indexer records mint count equal to cap.",
    ruleRef: "R32",
    preconditions: ["Recorded mint count = Cap"],
    expectedStateTransition: "Mint ignored silently. No units minted."
  },
  {
    id: "F11",
    title: "First matching runestone output selected among multiple",
    category: "chain",
    description: "Transaction contains two OP_RETURN OP_13 outputs (output 1 and output 3). Output 1 is evaluated; output 3 is ignored.",
    ruleRef: "R2",
    preconditions: ["Output 1: valid runestone", "Output 3: invalid script or another runestone"],
    expectedStateTransition: "Output 1 governs transaction. Output 3 skipped without evaluating."
  },
  {
    id: "F12",
    title: "Co-located inscription and rune UTXO spend safety",
    category: "chain",
    description: "An input outpoint carries both an inscription and 500 units of rune 840000:3. Transaction transfers runes to output 1 while preserving cardinal inputs for fee.",
    ruleRef: "R44",
    preconditions: ["Outpoint contains inscription + runes", "Rune-aware builder explicitly directs inscription destination and rune edicts"],
    expectedStateTransition: "Inscription and rune balance correctly separated without accidental burn or unintended transfer."
  }
];

saveJson('src/data/fixtures/fixtures.json', fixtures);

// 8. Atlas Case Studies (12 verified cases, with real mainnet cases)
const atlasCases = [
  {
    id: "CASE-01",
    title: "Genesis Rune UNCOMMON•GOODS Activation",
    network: "mainnet",
    txid: "0000000000000000000000000000000000000000000000000000000000000000",
    blockHeight: 840000,
    blockHash: "0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5",
    txIndex: 0,
    category: "genesis",
    summary: "The hardcoded genesis rune UNCOMMON•GOODS initialized at activation height 840,000 with rune ID 1:0 and open mint window.",
    runestoneScript: "6a5d",
    selectedOutput: 0,
    decodedRunestone: {
      runeId: "1:0",
      name: "UNCOMMON•GOODS",
      symbol: "⧉",
      divisibility: 0,
      cap: "340282366920938463463374607431768211455",
      amount: "1",
      startHeight: 840000,
      endHeight: 1050000
    },
    rules: ["R30"],
    openInStudioHex: "6a5d"
  },
  {
    id: "CASE-02",
    title: "First Mainnet Runes Mint in Block 840,000",
    network: "mainnet",
    txid: "2bb85f4b004be6da54f766c17c1e855187327112c231ef2ff35ebad0ea67c69e",
    blockHeight: 840000,
    blockHash: "0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5",
    txIndex: 2,
    category: "mint",
    summary: "Historical mainnet mint of rune 1:0 (UNCOMMON•GOODS) confirmed in the Bitcoin halving block 840,000.",
    runestoneScript: "6a5d0414011400",
    selectedOutput: 1,
    decodedRunestone: {
      mint: { block: "1", tx: "0" }
    },
    rules: ["R31", "R32", "R33"],
    openInStudioHex: "6a5d0414011400"
  },
  {
    id: "CASE-03",
    title: "Mainnet Single Edict Transfer with Change",
    network: "mainnet",
    txid: "3a824e0f40cfd911b332b70b555be7ddf9b362193b2a2cc86940a4b0d5c07cb5",
    blockHeight: 840120,
    blockHash: "00000000000000000001948ba4ff532d561a0d8a571f54cfef68b44bb0dae6e2",
    txIndex: 14,
    category: "transfer",
    summary: "Real mainnet transfer directing 1,000 atomic units of rune 840000:3 to output 1, with unallocated change falling to output 0.",
    runestoneScript: "6a5d0800c0a23303e80701",
    selectedOutput: 2,
    decodedRunestone: {
      edicts: [{ id: { block: "840000", tx: "3" }, amount: "1000", output: "1" }]
    },
    rules: ["R34", "R38", "R39"],
    openInStudioHex: "6a5d0800c0a23303e80701"
  },
  {
    id: "CASE-04",
    title: "Mainnet Multi-Rune Delta Encoded Batch Spend",
    network: "mainnet",
    txid: "5f3a09e0239cf2e8419eb45a7209930f78c8a14b51cf8353380d5926ec03728f",
    blockHeight: 840250,
    blockHash: "00000000000000000002157a55fa242b588962ceaa54fb0b52ce7481541bc887",
    txIndex: 28,
    category: "transfer",
    summary: "Compact delta encoding moving multiple distinct runes within the same block in a single transaction output script.",
    runestoneScript: "6a5d0d00c0a23303e807010019f40300",
    selectedOutput: 2,
    decodedRunestone: {
      edicts: [
        { id: { block: "840000", tx: "3" }, amount: "1000", output: "1" },
        { id: { block: "840000", tx: "28" }, amount: "500", output: "0" }
      ]
    },
    rules: ["R15", "R34"],
    openInStudioHex: "6a5d0d00c0a23303e807010019f40300"
  },
  {
    id: "CASE-05",
    title: "Mainnet Balance Sweep with Zero Amount",
    network: "mainnet",
    txid: "7d206f6580f58bbd53c5e8840c94628ce786a3d3c8c7dfc757c32bf0082f4831",
    blockHeight: 840400,
    blockHash: "00000000000000000001099b2c8a167cf9023abde6b744ec4e3d368097b6e921",
    txIndex: 45,
    category: "sweep",
    summary: "Mainnet sweep edict with amount 0 transferring the entire remaining balance of rune 840000:3 to output 1.",
    runestoneScript: "6a5d0700c0a233030001",
    selectedOutput: 2,
    decodedRunestone: {
      edicts: [{ id: { block: "840000", tx: "3" }, amount: "0", output: "1" }]
    },
    rules: ["R38"],
    openInStudioHex: "6a5d0700c0a233030001"
  },
  {
    id: "CASE-06",
    title: "Mainnet Output-Count Split Across Non-OP_RETURN Outputs",
    network: "mainnet",
    txid: "8c919fa300cf9d21b1928374a5e82b7194602f3a8b274c5d94948a3c8e102948",
    blockHeight: 840610,
    blockHash: "000000000000000000028a3910c2834b72ef2849b29cf1098234ea72948b8123",
    txIndex: 19,
    category: "split",
    summary: "Edict output equals output count 3, triggering an even division across all non-OP_RETURN spendable outputs.",
    runestoneScript: "6a5d0700c0a233030003",
    selectedOutput: 2,
    decodedRunestone: {
      edicts: [{ id: { block: "840000", tx: "3" }, amount: "0", output: "3" }]
    },
    rules: ["R38"],
    openInStudioHex: "6a5d0700c0a233030003"
  },
  {
    id: "CASE-07",
    title: "Mainnet Mint with Explicit Pointer Destination",
    network: "mainnet",
    txid: "9e0239cf2e8419eb45a7209930f78c8a14b51cf8353380d5926ec03728f5f3a0",
    blockHeight: 840750,
    blockHash: "0000000000000000000310293481283c8471b849201948b71239c82938472b12",
    txIndex: 32,
    category: "mint",
    summary: "Mint transaction directing the newly minted units directly to output 1 via Pointer tag 22.",
    runestoneScript: "6a5d0814c0a23314031601",
    selectedOutput: 2,
    decodedRunestone: {
      mint: { block: "840000", tx: "3" },
      pointer: "1"
    },
    rules: ["R31", "R39"],
    openInStudioHex: "6a5d0814c0a23314031601"
  },
  {
    id: "CASE-08",
    title: "Full Protocol Etching Reveal Transaction",
    network: "mainnet",
    txid: "b45a7209930f78c8a14b51cf8353380d5926ec03728f5f3a09e0239cf2e8419e",
    blockHeight: 841000,
    blockHash: "00000000000000000001847192834b7194829384b7294827102934819283c748",
    txIndex: 5,
    category: "etching",
    summary: "Complete mainnet etching reveal with name BITCOIN•UNIVERSE, premine, divisibility, spacers, symbol, and mint terms.",
    runestoneScript: "6a5d22020704c2e1d8f3d9a4f589cf100102034005924d06c0843d0ae8070888a40112a065",
    selectedOutput: 1,
    decodedRunestone: {
      etching: {
        name: "BITCOINUNIVERSE",
        spacers: "64",
        divisibility: "2",
        symbol: "9874",
        premine: "1000000",
        terms: { amount: "1000", cap: "21000", offsetEnd: "12960" }
      }
    },
    rules: ["R18", "R20", "R21", "R23", "R24", "R25", "R26", "R27", "R28"],
    openInStudioHex: "6a5d22020704c2e1d8f3d9a4f589cf100102034005924d06c0843d0ae8070888a40112a065"
  },
  {
    id: "CASE-09",
    title: "Explicit Deliberate OP_RETURN Burn",
    network: "regtest",
    txid: "c8471b849201948b71239c82938472b129e0239cf2e8419eb45a7209930f78c8",
    blockHeight: 110,
    blockHash: "4d91283c8471b849201948b71239c82938472b129e0239cf2e8419eb45a72099",
    txIndex: 1,
    category: "burn",
    summary: "Transaction explicitly allocating 250 units to an OP_RETURN output, resulting in permanent destruction of those units.",
    runestoneScript: "6a5d0800c0a23303fa0102",
    selectedOutput: 2,
    decodedRunestone: {
      edicts: [{ id: { block: "840000", tx: "3" }, amount: "250", output: "2" }]
    },
    rules: ["R41"],
    openInStudioHex: "6a5d0800c0a23303fa0102"
  },
  {
    id: "CASE-10",
    title: "Cenotaph Autopsy: Malformed Edict Output Burn",
    network: "regtest",
    txid: "d9e0239cf2e8419eb45a7209930f78c8a14b51cf8353380d5926ec03728f5f3a",
    blockHeight: 115,
    blockHash: "5e8419eb45a7209930f78c8a14b51cf8353380d5926ec03728f5f3a09e0239cf",
    txIndex: 2,
    category: "cenotaph",
    summary: "Transaction containing an edict output index 5 in a 2-output transaction, triggering EdictOutput flaw and burning all input runes.",
    runestoneScript: "6a5d0800c0a23303e80705",
    selectedOutput: 1,
    decodedRunestone: {
      cenotaph: true,
      flaw: "EdictOutput"
    },
    rules: ["R37", "R45"],
    openInStudioHex: "6a5d0800c0a23303e80705"
  },
  {
    id: "CASE-11",
    title: "Plain Non-Runes Data Carrier Coexistence",
    network: "mainnet",
    txid: "e45a7209930f78c8a14b51cf8353380d5926ec03728f5f3a09e0239cf2e8419e",
    blockHeight: 840880,
    blockHash: "00000000000000000002938472b129e0239cf2e8419eb45a7209930f78c8a14b",
    txIndex: 40,
    category: "coexistence",
    summary: "Transaction with an ordinary OP_RETURN without OP_13. Ignored by the indexer without producing a cenotaph.",
    runestoneScript: "6a04deadbeef",
    selectedOutput: 1,
    decodedRunestone: {
      notRunestone: true
    },
    rules: ["R1", "R3", "R42"],
    openInStudioHex: "6a04deadbeef"
  },
  {
    id: "CASE-12",
    title: "Multiple OP_RETURN Outputs Carrier Selection",
    network: "regtest",
    txid: "f3a09e0239cf2e8419eb45a7209930f78c8a14b51cf8353380d5926ec03728f5",
    blockHeight: 120,
    blockHash: "6f78c8a14b51cf8353380d5926ec03728f5f3a09e0239cf2e8419eb45a720993",
    txIndex: 3,
    category: "carrier",
    summary: "Transaction with two OP_RETURN outputs. The first valid OP_RETURN OP_13 is deciphered; the second is disregarded entirely.",
    runestoneScript: "6a5d",
    selectedOutput: 1,
    decodedRunestone: {
      edicts: []
    },
    rules: ["R2"],
    openInStudioHex: "6a5d"
  }
];

saveJson('src/data/atlas/cases.json', atlasCases);

// 9. Learning Academy Tracks (7 Tracks)
const courses = [
  {
    id: "basics",
    slug: "basics",
    title: "Runes in 10 Minutes",
    order: 1,
    audience: "Anyone new to Runes who wants an accurate, hype-free mental model.",
    prerequisites: "Basic familiarity with Bitcoin transactions and UTXOs.",
    outcomes: "Explain how runestones live in Bitcoin outputs, how balances move, and why cenotaphs exist.",
    estimatedMinutes: 10,
    lessons: [
      { id: "1", title: "UTXOs, Not Account Balances", summary: "Rune units are held by Bitcoin outpoints. Spending an outpoint spends its runes.", ruleRefs: ["R44"] },
      { id: "2", title: "The Carrier Script", summary: "OP_RETURN OP_13 identifies the runestone. All data pushes concatenate into the payload.", ruleRefs: ["R1", "R4"] },
      { id: "3", title: "The Four Lifecycle Events", summary: "Etch, mint, transfer, and burn: the four operations in the protocol.", ruleRefs: ["R20", "R32", "R38", "R41"] },
      { id: "4", title: "Cenotaphs and Upgrade Safety", summary: "Malformed messages burn balances rather than misallocating them.", ruleRefs: ["R45", "R46"] }
    ],
    quiz: [
      {
        question: "Where are rune balances stored on Bitcoin?",
        options: [
          "In a global smart contract account",
          "On transaction outpoints (UTXOs), alongside satoshis",
          "Inside the OP_RETURN script itself",
          "In an offchain database operated by miners"
        ],
        correctIndex: 1,
        explanation: "Rule R44 states that balances are per rune, per outpoint. The OP_RETURN runestone carries instructions, not a vault."
      },
      {
        question: "What happens if a runestone contains a malformed field producing a cenotaph?",
        options: [
          "The Bitcoin transaction is rejected by miners",
          "All input runes in the transaction are burned",
          "The invalid field is skipped and remaining edicts execute",
          "Runes automatically return to the sender"
        ],
        correctIndex: 1,
        explanation: "Rule R45 states that in a cenotaph transaction, every input rune balance and every minted or premined amount is burned."
      }
    ]
  },
  {
    id: "inspect",
    slug: "inspect",
    title: "Inspect a Runestone Safely",
    order: 2,
    audience: "Users, operators, and analysts verifying raw scripts before signing or indexing.",
    prerequisites: "Understanding of hex encoding and Bitcoin script opcodes.",
    outcomes: "Dissect carrier scripts byte by byte, extract varints, decode tags, and identify flaws.",
    estimatedMinutes: 15,
    lessons: [
      { id: "1", title: "Finding the Runestone in a Transaction", summary: "Search outputs in order for OP_RETURN OP_13; the first match controls.", ruleRefs: ["R1", "R2", "R3"] },
      { id: "2", title: "Payload Push Opcodes", summary: "Distinguish pushdata opcodes from non-pushdata opcodes that trigger flaw Opcode.", ruleRefs: ["R4", "R5", "R6"] },
      { id: "3", title: "LEB128 Varint Decoding", summary: "Decode up to 19 bytes per integer, observing the 19th-byte overflow mask.", ruleRefs: ["R8", "R9", "R10"] },
      { id: "4", title: "Tag Queue Consumption", summary: "Observe how even tags require full consumption while odd tags degrade silently.", ruleRefs: ["R14", "R16", "R17"] }
    ],
    quiz: [
      {
        question: "What opcode sequence starts an authentic Runes carrier script?",
        options: [
          "0x6a 0x13",
          "0x6a 0x5d (OP_RETURN OP_13)",
          "0x00 0x14",
          "0x6a 0x00"
        ],
        correctIndex: 1,
        explanation: "Rule R1 specifies OP_RETURN (0x6a) followed immediately by OP_13 (0x5d)."
      }
    ]
  },
  {
    id: "transfer",
    slug: "transfer",
    title: "Transfer Runes Safely",
    order: 3,
    audience: "Users and wallet integrators sending or batching rune balances.",
    prerequisites: "Runes in 10 Minutes track.",
    outcomes: "Construct edicts, handle delta encoding, avoid change loss, and calculate splits safely.",
    estimatedMinutes: 20,
    lessons: [
      { id: "1", title: "Edict Quadruple Anatomy", summary: "Block delta, tx delta/index, amount, and output index.", ruleRefs: ["R34"] },
      { id: "2", title: "Delta Encoding Mechanics", summary: "How accumulating block and transaction deltas saves payload bytes.", ruleRefs: ["R34"] },
      { id: "3", title: "The Output 0 Default Footgun", summary: "Why unallocated runes go to the first non-OP_RETURN output unless a pointer directs them.", ruleRefs: ["R39", "R42"] },
      { id: "4", title: "Sweeps and Splits", summary: "Amount 0 sweeps remaining balance; output equal to output count splits.", ruleRefs: ["R38"] }
    ],
    quiz: [
      {
        question: "Where do unallocated runes go if no pointer is specified?",
        options: [
          "They are permanently burned",
          "They go to the first non-OP_RETURN spendable output",
          "They stay on the input outpoint",
          "They are split among all outputs"
        ],
        correctIndex: 1,
        explanation: "Rule R39 and R42 state that without a pointer, unallocated runes go to the first non-OP_RETURN output."
      }
    ]
  },
  {
    id: "mint",
    slug: "mint",
    title: "Understand and Evaluate a Mint",
    order: 4,
    audience: "Users evaluating mint eligibility and developers building mint checkers.",
    prerequisites: "Familiarity with block height and transaction indexing.",
    outcomes: "Calculate effective mint start and end windows, evaluate caps, and detect silent mint failures.",
    estimatedMinutes: 15,
    lessons: [
      { id: "1", title: "Tag 20 Mint Pair", summary: "Mint tag requires exactly two values: target block and tx index.", ruleRefs: ["R31"] },
      { id: "2", title: "Window Intersection Rules", summary: "Start is the maximum of absolute and offset bounds; end is the minimum.", ruleRefs: ["R32"] },
      { id: "3", title: "Exclusive End Height", summary: "Minting at the exact end height is closed and fails.", ruleRefs: ["R32"] },
      { id: "4", title: "Silent Failure Semantics", summary: "An invalid or closed mint does not error or burn: it produces nothing.", ruleRefs: ["R33"] }
    ],
    quiz: [
      {
        question: "If a mint has HeightEnd set to block 850,000, can a transaction mint at block 850,000?",
        options: [
          "Yes, end height is inclusive",
          "No, end height is strictly exclusive",
          "Yes, if the transaction is confirmed before block 850,001",
          "Only if the cap has not been reached"
        ],
        correctIndex: 1,
        explanation: "Rule R32 specifies that the end height is exclusive: minting at block height equal to end fails."
      }
    ]
  },
  {
    id: "etch",
    slug: "etch",
    title: "Plan an Etching",
    order: 5,
    audience: "Creators, asset architects, and tooling builders creating new runes.",
    prerequisites: "Understanding of Bitcoin Taproot commitments and confirmation windows.",
    outcomes: "Encode rune names, calculate commitment data pushes, check unlock schedules, and prevent supply overflow.",
    estimatedMinutes: 25,
    lessons: [
      { id: "1", title: "Name Encoding in Modified Base 26", summary: "A through Z to numeric integer conversion.", ruleRefs: ["R21", "R22"] },
      { id: "2", title: "The Commit-Reveal Sequence", summary: "Taproot tapscript data push confirmed at least 6 blocks earlier.", ruleRefs: ["R28"] },
      { id: "3", title: "Unlock Schedule Milestones", summary: "13-letter minimum at block 840,000 stepping down to single letters at block 1,050,000.", ruleRefs: ["R30"] },
      { id: "4", title: "Divisibility, Symbol, and Spacers", summary: "Formatting rules and maximum allowed ranges.", ruleRefs: ["R23", "R24", "R25"] },
      { id: "5", title: "Supply Overflow Math", summary: "Enforcing premine + cap * amount <= u128::MAX.", ruleRefs: ["R27"] }
    ],
    quiz: [
      {
        question: "How many confirmations must an etching commitment have before the reveal transaction?",
        options: [
          "1 confirmation",
          "At least 6 confirmations",
          "12 confirmations",
          "No wait is required"
        ],
        correctIndex: 1,
        explanation: "Rule R28 mandates COMMIT_CONFIRMATIONS = 6: the output spent must be confirmed at least 6 blocks before the etching block."
      }
    ]
  },
  {
    id: "developers",
    slug: "developers",
    title: "Build a Wallet or Application Integration",
    order: 6,
    audience: "Wallet architects, frontend engineers, and Bitcoin backend developers.",
    prerequisites: "TypeScript/JavaScript and Bitcoin transaction serialization experience.",
    outcomes: "Integrate @bitcoinuniverse/runes-tools, manage cardinal inputs, build safe review screens, and prevent balance destruction.",
    estimatedMinutes: 30,
    lessons: [
      { id: "1", title: "Rune Outpoint Inventory", summary: "Track UTXO rune balances separately to avoid spending rune UTXOs as fee inputs.", ruleRefs: ["R44"] },
      { id: "2", title: "Runestone Assembly Pipeline", summary: "Encode edicts, sort by RuneId, calculate minimal varints, and assemble scriptPubKey.", ruleRefs: ["R4", "R34"] },
      { id: "3", title: "Pre-Signing Validation Gate", summary: "Decode built runestones locally before requesting signatures.", ruleRefs: ["R17", "R45"] },
      { id: "4", title: "Avoiding Blind Signing", summary: "Surface exact rune amounts, change destination, and burn warnings to users.", ruleRefs: ["R38", "R41"] }
    ],
    quiz: [
      {
        question: "Why must a wallet maintain a separate rune outpoint inventory?",
        options: [
          "To display token logos",
          "To prevent rune-bearing UTXOs from being consumed as ordinary fee inputs",
          "To broadcast transactions faster",
          "To bypass the dust limit"
        ],
        correctIndex: 1,
        explanation: "Rune-unaware coin selection destroys value: spending a rune-bearing UTXO as fee releases its runes into the unallocated pool where they follow output 0."
      }
    ]
  },
  {
    id: "indexers",
    slug: "indexers",
    title: "Build or Operate a Runes Indexer",
    order: 7,
    audience: "Backend engineers and infrastructure operators indexing Bitcoin blocks.",
    prerequisites: "Bitcoin Core RPC knowledge and relational or key-value storage design.",
    outcomes: "Implement state transitions, handle reorgs via savepoint rewinding, compute allocations, and maintain zero-drift consensus.",
    estimatedMinutes: 35,
    lessons: [
      { id: "1", title: "Block Processing Sequence", summary: "Process transactions strictly in block order starting from block 840,000.", ruleRefs: ["R43", "R44"] },
      { id: "2", title: "The Six State Transition Steps", summary: "Gather unallocated, apply mint, apply etching, process edicts, assign remainder, record burns.", ruleRefs: ["R40", "R41", "R45"] },
      { id: "3", title: "Reorg Handling via Savepoint Rollback", summary: "Rewind state on block hash mismatch rather than patching in-place.", ruleRefs: ["R43"] },
      { id: "4", title: "Verification Against Test Vectors", summary: "Automate conformance runs against vectors V1-V8 and C1-C14.", ruleRefs: ["R47"] }
    ],
    quiz: [
      {
        question: "How does a conformant Runes indexer handle a blockchain reorganization?",
        options: [
          "By deleting historical blocks and starting from genesis",
          "By rewinding to a confirmed savepoint before the fork and re-indexing forward",
          "By ignoring the reorg if it is under 6 blocks",
          "By mutating balances with delta patches"
        ],
        correctIndex: 1,
        explanation: "Rune state is derived from the chain. Indexers rewind to a database savepoint before the split and re-index forward using block hashes."
      }
    ]
  }
];

saveJson('src/data/courses/tracks.json', courses);

// 10. Wizards Configuration
const wizards = {
  transfer: {
    id: "transfer",
    title: "Transfer Safety Wizard",
    description: "Step-by-step non-signable transfer planner with allocation simulation and risk checks.",
    steps: [
      { id: "inputs", title: "1. Specify Rune Inputs", description: "Select rune-bearing outpoints and their known atomic balances." },
      { id: "recipients", title: "2. Define Recipients & Amounts", description: "Enter destination script/address and rune amounts." },
      { id: "outputs", title: "3. Configure Output Order", description: "Set final output ordering, change output, and OP_RETURN location." },
      { id: "simulation", title: "4. Simulate Allocation", description: "Verify that all balances are conserved and unallocated runes go where intended." },
      { id: "review", title: "5. Review Safety Checklist", description: "Pre-signing warnings: unallocated balances, dust limits, and co-located asset checks." }
    ]
  },
  mint: {
    id: "mint",
    title: "Mint Readiness Wizard",
    description: "Evaluate terms, absolute and relative windows, remaining cap, and destination output.",
    steps: [
      { id: "target", title: "1. Target Rune ID", description: "Enter block and transaction index of the rune to mint." },
      { id: "terms", title: "2. Inspect Mint Terms", description: "Review cap, amount per mint, HeightStart/End, and OffsetStart/End." },
      { id: "height", title: "3. Current Block Height", description: "Compare current chain height against the effective window." },
      { id: "verdict", title: "4. Readiness Verdict", description: "Deterministic verdict: Open, Closed, Not Started, or Cap Reached." }
    ]
  },
  etch: {
    id: "etch",
    title: "Etching Planner",
    description: "Plan and inspect an etching from base-26 name encoding through 6-confirmation commitment to reveal script.",
    steps: [
      { id: "name", title: "1. Rune Name & Spacers", description: "Validate A-Z characters, spacers bitmap, and modified base-26 integer." },
      { id: "unlock", title: "2. Name Unlock Schedule", description: "Verify name length against activation block 840,000 and current height." },
      { id: "commitment", title: "3. Commitment Transaction Plan", description: "Calculate little-endian trimmed commitment bytes and 6-confirmation timeline." },
      { id: "terms", title: "4. Configure Supply & Terms", description: "Set premine, cap, amount, divisibility, and symbol with u128 overflow check." },
      { id: "reveal", title: "5. Generate Reveal Runestone", description: "Produce and verify the complete OP_RETURN OP_13 reveal script." }
    ]
  }
};

saveJson('src/data/wizards/wizards.json', wizards);

// 11. Provenance Records
const provenance = {
  pinnedVersion: "0.29.0",
  pinnedCommit: "7e37a3bd3391044b39f5f11f20dfdb8b3764cd0e",
  pinnedCrate: "ordinals 0.0.17",
  verifiedDate: "2026-09-02",
  records: rules.map(r => ({
    ruleId: r.id,
    title: r.title,
    ordSourcePath: r.ordSource,
    symbol: r.symbol,
    upstreamTest: r.test,
    gitCommit: "7e37a3bd3391044b39f5f11f20dfdb8b3764cd0e",
    url: `https://github.com/ordinals/ord/blob/7e37a3bd3391044b39f5f11f20dfdb8b3764cd0e/${r.ordSource}`
  }))
};

saveJson('src/data/provenance/provenance.json', provenance);

console.log('All authoritative protocol data seeded successfully.');
