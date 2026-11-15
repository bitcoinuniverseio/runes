# Runes Protocol Specification

[Runes](/runes/) / Runes Protocol Specification  Normative Protocol Specification

 # Runes Protocol Specification

 Normative consensus specification for the Runes protocol on Bitcoin, numbered rules R1 through R47, tag dictionaries, and cenotaph flaw definitions.

  
Pinned to Casey Rodarmor's [ord](https://github.com/ordinals/ord) 0.29.0 (ordinals crate 0.0.17, commit `7e37a3b`) · Activation Block: 840,000.
 
This document constitutes the authoritative, normative specification of the Runes protocol on Bitcoin.
    Every numbered statement (R1 through R47) defines an immutable protocol rule verified by consensus indexers.

     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></path></svg>  Zero External Dependencies    <p>
Runes is fully self-contained on the Bitcoin blockchain. It does not use witness data, external state commitments, off-chain DA layers, or second-layer sidechains. All state transitions derive purely from transaction inputs, outputs, and OP_RETURN script pushes.

    ## 1. Carrier Output

 
A transaction communicates protocol messages through a standard Bitcoin data carrier output.

    ####  [ <strong>R1</strong>: OP_RETURN and OP_13 carrier script ](#r1) 

 [1. Carrier and transaction anatomy]  A runestone is carried in a transaction output whose script begins with OP_RETURN (0x6a) followed immediately by OP_13 (0x5d, also written OP_PUSHNUM_13), the Runes protocol identifier.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`     ####  [ <strong>R2</strong>: First matching output is selected ](#r2) 

 [1. Carrier and transaction anatomy]  Outputs are examined in order. The first output matching R1 is the transaction&#39;s runestone. A transaction has at most one runestone; once one is found, no later output is examined.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`     ####  [ <strong>R3</strong>: Non-matching outputs are skipped ](#r3) 

 [1. Carrier and transaction anatomy]  Outputs that do not match R1 are skipped when searching, including outputs whose scripts do not parse and OP_RETURN outputs without the OP_13 identifier. They never make the transaction invalid.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`     ####  [ <strong>R4</strong>: Payload concatenation of data pushes ](#r4) 

 [1. Carrier and transaction anatomy]  The runestone payload is the concatenation, in order, of the contents of every data push after OP_13. All pushdata opcodes are legal: OP_0 (0x00, empty push), direct pushes 0x01 to 0x4b, OP_PUSHDATA1 (0x4c), OP_PUSHDATA2 (0x4d), and OP_PUSHDATA4 (0x4e). Zero pushes is legal and yields an empty runestone.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`     ####  [ <strong>R5</strong>: Non-pushdata opcode yields Opcode flaw ](#r5) 

 [1. Carrier and transaction anatomy]  Any non-pushdata opcode (0x4f and above, including OP_PUSHNUM opcodes) after OP_13 makes the transaction a cenotaph with flaw Opcode.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`  <strong>Violating Flaw:</strong> `Opcode`     ####  [ <strong>R6</strong>: Unparseable script yields InvalidScript flaw ](#r6) 

 [1. Carrier and transaction anatomy]  A script that fails to parse after OP_13 (for example a push length running past the end of the script) makes the transaction a cenotaph with flaw InvalidScript.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`  <strong>Violating Flaw:</strong> `InvalidScript`     ####  [ <strong>R7</strong>: Output value unconstrained ](#r7) 

 [1. Carrier and transaction anatomy]  The protocol does not constrain the runestone output&#39;s value in satoshis. It is conventionally zero, since OP_RETURN outputs are unspendable.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`     ## 2. Integers and Varints

 
All integers inside a Runestone payload are encoded using unsigned LEB128 varints.

    ####  [ <strong>R8</strong>: Unsigned 128-bit LEB128 varints ](#r8) 

 [2. Varint encoding]  The payload decodes into a sequence of unsigned 128-bit integers encoded as LEB128 varints: each byte contributes its low 7 bits, least significant group first; a set high bit (0x80) means another byte follows.

  <strong>ord Source:</strong> `crates/ordinals/src/varint.rs`     ####  [ <strong>R9</strong>: 19-byte limit and overflow mask ](#r9) 

 [2. Varint encoding]  A varint is at most 19 bytes long. Decoding fails as Overlong past 19 bytes, as Overflow when the 19th byte carries bits above the 128th (19th byte value with any of mask 0b0111_1100 set), and as Unterminated when the payload ends with the continuation bit set.

  <strong>ord Source:</strong> `crates/ordinals/src/varint.rs`  <strong>Violating Flaw:</strong> `Varint`     ####  [ <strong>R10</strong>: Varint decoding failure produces Varint flaw ](#r10) 

 [2. Varint encoding]  Any varint decoding failure anywhere in the payload makes the transaction a cenotaph with flaw Varint. The whole payload must decode.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`  <strong>Violating Flaw:</strong> `Varint`     ####  [ <strong>R11</strong>: Non-minimal varints accepted ](#r11) 

 [2. Varint encoding]  Non-minimal encodings decode successfully: 0x80 0x00 decodes to the same integer as 0x00. Encoders should emit minimal encodings; decoders must accept both.

  <strong>ord Source:</strong> `crates/ordinals/src/varint.rs`          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> LEB128 Encoding vs Decoding Asymmetry    
Under Rule R10, indexers accept non-minimal LEB128 encodings (such as `0x80 0x00` for zero). However, under Rule R11, serializers should always emit the minimal representation to conserve byte budget within the standard 83-byte relay limit.

    ## 3. Message Structure

 
The integer stream is partitioned into tag-value pairs followed by an optional edicts body.

    ####  [ <strong>R12</strong>: Tag and value pairs ](#r12) 

 [3. Message structure]  The integer sequence is parsed front to back as tag and value pairs: even positions are tags, the following integer is the value, until the Body tag (0) is reached.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone/message.rs`     ####  [ <strong>R13</strong>: Trailing tag produces TruncatedField flaw ](#r13) 

 [3. Message structure]  A tag at the end of the sequence with no following value makes the transaction a cenotaph with flaw TruncatedField.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone/message.rs`  <strong>Violating Flaw:</strong> `TruncatedField`     ####  [ <strong>R14</strong>: Tag value queues ](#r14) 

 [3. Message structure]  Repeated occurrences of the same tag accumulate their values in order into a queue for that tag. Interpretation consumes values from the front of the queue.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone/tag.rs`     ####  [ <strong>R15</strong>: Edicts in groups of four ](#r15) 

 [3. Message structure]  Everything after the Body tag is edict data, in groups of exactly four integers: block delta, transaction index (or delta), amount, output. A final group of fewer than four integers makes the transaction a cenotaph with flaw TrailingIntegers.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone/message.rs`  <strong>Violating Flaw:</strong> `TrailingIntegers`     ## 4. Tag Dictionary

 
Tags identify message fields. The parity of the tag determines indexer behavior when encountering an unrecognized field.

   <caption>Runestone tags. Even tags must be understood; odd tags may be ignored.</caption>   Tag Name Parity Values Meaning and Range     `0` <strong>Body</strong>  even  `rest`  Marks the start of the edicts. Everything after it is edict groups (R15).  ([R15](/runes/specification.html#r15))   `2` <strong>Flags</strong>  even  `1`  Bitfield: bit 0 Etching, bit 1 Terms, bit 2 Turbo, bit 127 reserved (R18).  ([R18](/runes/specification.html#r18))   `4` <strong>Rune</strong>  even  `1`  The etched rune&#39;s name as a base-26 integer (R21). Requires the Etching flag.  ([R21](/runes/specification.html#r21))   `6` <strong>Premine</strong>  even  `1`  Atomic units allocated to the etching transaction itself. u128. Requires the Etching flag.  ([R26](/runes/specification.html#r26))   `8` <strong>Cap</strong>  even  `1`  Maximum number of mints. u128. Requires the Etching and Terms flags.  ([R32](/runes/specification.html#r32))   `10` <strong>Amount</strong>  even  `1`  Atomic units created per mint. u128. Requires the Etching and Terms flags.  ([R32](/runes/specification.html#r32))   `12` <strong>HeightStart</strong>  even  `1`  Absolute first block in which minting is allowed. Must fit u64. Requires Etching and Terms.  ([R32](/runes/specification.html#r32))   `14` <strong>HeightEnd</strong>  even  `1`  Absolute block at and after which minting is disallowed. Must fit u64. Requires Etching and Terms.  ([R32](/runes/specification.html#r32))   `16` <strong>OffsetStart</strong>  even  `1`  Mint opens this many blocks after the etching block. Must fit u64. Requires Etching and Terms.  ([R32](/runes/specification.html#r32))   `18` <strong>OffsetEnd</strong>  even  `1`  Mint closes this many blocks after the etching block. Must fit u64. Requires Etching and Terms.  ([R32](/runes/specification.html#r32))   `20` <strong>Mint</strong>  even  `2`  The rune ID to mint, given as two values: block, then transaction index (R31).  ([R31](/runes/specification.html#r31))   `22` <strong>Pointer</strong>  even  `1`  Output index that receives unallocated runes. Must fit u32 and be less than the output count (R39).  ([R39](/runes/specification.html#r39))   `126` <strong>Cenotaph</strong>  even  `1`  Reserved. Unrecognized by definition; its presence makes the transaction a cenotaph (R17).  ([R17](/runes/specification.html#r17))   `1` <strong>Divisibility</strong>  odd  `1`  Decimal places, 0 to 38. Out-of-range values are ignored. Requires the Etching flag.  ([R23](/runes/specification.html#r23))   `3` <strong>Spacers</strong>  odd  `1`  Bitmap of spacer dots between name letters, at most 0x07FFFFFF. Out-of-range ignored. Requires Etching.  ([R24](/runes/specification.html#r24))   `5` <strong>Symbol</strong>  odd  `1`  Currency symbol as a Unicode scalar value. Invalid values are ignored. Requires Etching.  ([R25](/runes/specification.html#r25))   `127` <strong>Nop</strong>  odd  `1`  Reserved no-op. Ignored.  ([R16](/runes/specification.html#r16))         ####  [ <strong>R16</strong>: Odd tags are informational ](#r16) 

 [4. Tag table]  Odd tags are informational. Unrecognized odd tags, duplicate odd-tag values beyond those consumed, and odd-tag values that fail their range checks are silently ignored.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`     ####  [ <strong>R17</strong>: Unconsumed even tag produces UnrecognizedEvenTag flaw ](#r17) 

 [4. Tag table]  Even tags must be understood and fully consumed. If any even-tag value remains unconsumed after interpretation, the transaction is a cenotaph with flaw UnrecognizedEvenTag. This covers: unrecognized even tags (including reserved tag 126), even fields present without the flag that enables them, duplicate values beyond a field&#39;s arity, a Mint tag with only one value, and even-tag values that fail a range check (for example a Pointer not less than the output count, or a HeightStart above u64).

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`  <strong>Violating Flaw:</strong> `UnrecognizedEvenTag`     ## 5. Flag Bitfield

 
The Flags field (Tag 2) contains a bitfield controlling etching, open mint terms, and protocol flags.

    Flag BitNameMaskMeaning   0<strong>Etching</strong>`0x01 (1 << 0)`Transaction etches a new rune. Enables Tags 1, 3, 4, 5, 6. 1<strong>Terms</strong>`0x02 (1 << 1)`Etching includes open mint terms. Enables Tags 8, 10, 12, 14, 16, 18. 2<strong>Turbo</strong>`0x04 (1 << 2)`Opts the etched rune into future protocol rule additions. 127<strong>Cenotaph</strong>`1 << 127`Reserved for future cenotaph signaling.       ####  [ <strong>R18</strong>: Flag bitfield values ](#r18) 

 [5. Flags]  The value of tag 2 is a bitfield. Bit 0 (Etching): this runestone etches a rune. Bit 1 (Terms): the etching has open mint terms. Bit 2 (Turbo): the etching opts in to future protocol changes. Bit 127 (Cenotaph): reserved, never valid.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone/flag.rs`     ####  [ <strong>R19</strong>: Unrecognized flag bit produces UnrecognizedFlag flaw ](#r19) 

 [5. Flags]  The Terms and Turbo flags are consumed only when Etching is set. Any flag bit still set after consumption, including Terms without Etching or any unassigned bit, makes the transaction a cenotaph with flaw UnrecognizedFlag.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`  <strong>Violating Flaw:</strong> `UnrecognizedFlag`     ## 6. Etching

 
An etching creates a new fungible token on Bitcoin. It may be an open mint, premined, or fixed supply.

    ####  [ <strong>R20</strong>: Etching fields and immutability ](#r20) 

 [6. Etching]  An etching is present exactly when flag bit 0 is set. Its fields, all optional, are Rune (4), Divisibility (1), Spacers (3), Symbol (5), Premine (6), and, when the Terms flag is also set, Amount (10), Cap (8), HeightStart (12), HeightEnd (14), OffsetStart (16), OffsetEnd (18). Once etched, all properties are permanently immutable.

  <strong>ord Source:</strong> `crates/ordinals/src/etching.rs`     ####  [ <strong>R21</strong>: Modified base-26 name encoding ](#r21) 

 [6. Etching]  Names are sequences of the letters A through Z, encoded as an integer in modified base 26: for each letter after the first, add one, then multiply by 26 and add the letter&#39;s index (A is 0). A is 0, B is 1, Z is 25, AA is 26, AB is 27, and so on. Decoding reverses this: add one, then repeatedly take (n - 1) % 26 as the last letter and continue with (n - 1) / 26.

  <strong>ord Source:</strong> `crates/ordinals/src/rune.rs`     ####  [ <strong>R22</strong>: Reserved names threshold ](#r22) 

 [6. Etching]  All name values at or above 6402364363415443603228541259936211926 (the value of 27 letters A) are reserved. Consequently, etchable names are 1 to 26 letters long.

  <strong>ord Source:</strong> `crates/ordinals/src/rune.rs`     ####  [ <strong>R23</strong>: Divisibility maximum 38 ](#r23) 

 [6. Etching]  Divisibility is the number of decimal places, at most 38. A larger value fails the range check and is ignored: the etching proceeds with default divisibility 0.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`     ####  [ <strong>R24</strong>: Spacers bitmap formatting ](#r24) 

 [6. Etching]  Spacers are a bitmap: bit i set places a dot • after letter i + 1. The maximum accepted value is 0x07FFFFFF; larger values are ignored. Spacers are display only: a name&#39;s identity and uniqueness ignore spacers, spacers may only fall between letters, and they do not count toward name length.

  <strong>ord Source:</strong> `crates/ordinals/src/spaced_rune.rs`     ####  [ <strong>R25</strong>: Unicode scalar currency symbol ](#r25) 

 [6. Etching]  The symbol is a single Unicode scalar value. Values that are not valid scalars (above U+10FFFF or in the surrogate range) are ignored. A rune with no symbol is displayed with the generic currency sign ¤.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`     ####  [ <strong>R26</strong>: Premine joins unallocated pool ](#r26) 

 [6. Etching]  The premine is allocated to the etching transaction as unallocated runes, exactly as if it had been an input balance, and is assigned to outputs by the same edict and pointer rules.

  <strong>ord Source:</strong> `src/index/updater/rune_updater.rs`     ####  [ <strong>R27</strong>: Supply overflow produces SupplyOverflow flaw ](#r27) 

 [6. Etching]  Etching supply must fit: premine + cap * amount computed in u128 must not overflow. Overflow makes the transaction a cenotaph with flaw SupplyOverflow.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`  <strong>Violating Flaw:</strong> `SupplyOverflow`     ####  [ <strong>R28</strong>: Etching commitment and eligibility preconditions ](#r28) 

 [6. Etching]  An etching with a name is honored by the indexer only if all of the following hold at indexing time; otherwise the etching is disregarded entirely (this is not a cenotaph): (1) the name&#39;s value is at least the minimum unlocked at the etching block height (R30); (2) the name is not reserved (R22); (3) the name has not already been etched, ignoring spacers; (4) the transaction commits to the name: some input spends a pay-to-taproot output, that input&#39;s witness contains a tapscript with a data push exactly equal to the name&#39;s value as little-endian bytes with trailing zero bytes trimmed, and the output being spent was confirmed at least 6 blocks before the etching block (COMMIT_CONFIRMATIONS = 6).

  <strong>ord Source:</strong> `src/index/updater/rune_updater.rs`     ####  [ <strong>R29</strong>: Reserved name assignment for unnamed etchings ](#r29) 

 [6. Etching]  An etching without a name is assigned a reserved name by the indexer: 6402364363415443603228541259936211926 + (block << 32 | tx), where block and tx are the etching&#39;s rune ID components. Reserved-name etchings need no commitment.

  <strong>ord Source:</strong> `src/index/updater/rune_updater.rs`     ####  [ <strong>R30</strong>: Name length unlock schedule ](#r30) 

 [6. Etching]  Name unlock schedule, mainnet: runes activate at block 840,000 (first_rune_height = 4 * 210,000). At activation, names of 13 letters and longer are unlocked. The minimum steps down through the length thresholds every 17,500 blocks (one twelfth of a halving interval), interpolating linearly between thresholds, until every name, including single letters, is unlocked at block 1,050,000. Before activation no etching is honored.

  <strong>ord Source:</strong> `crates/ordinals/src/rune.rs`        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>   Commitment Requirement (Rule R27)    <p>
Any non-reserved rune name requires a prior Taproot commitment transaction confirmed at least 6 blocks prior. Revealing the etching earlier causes the name to be silently disregarded and replaced with a reserved sequence name.

    ## 7. Minting

 
A transaction may mint units of an active, open-mint rune using Tag 20.

    ####  [ <strong>R31</strong>: Mint tag arity and bounds ](#r31) 

 [7. Minting]  The Mint tag (20) is given twice: the first value is the block and the second the transaction index of the rune ID to mint. Values must fit u64 and u32 respectively, and block 0 with a nonzero tx is invalid. Values failing these checks are left unconsumed and make the transaction a cenotaph via R17. A single Mint value with no pair behaves the same way.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`  <strong>Violating Flaw:</strong> `UnrecognizedEvenTag`     ####  [ <strong>R32</strong>: Mint terms evaluation rules ](#r32) 

 [7. Minting]  A mint succeeds when the target rune exists and its terms are satisfied at the mint transaction&#39;s block height: the height is not below the mint&#39;s start, is below the mint&#39;s end, and the recorded number of mints is below the cap (a missing cap is 0, so a rune without terms or cap is unmintable). Start is the later of HeightStart and etching block + OffsetStart; end is the earlier of HeightEnd and etching block + OffsetEnd; whichever of the pair is absent does not constrain.

  <strong>ord Source:</strong> `src/index/updater/rune_updater.rs`     ####  [ <strong>R33</strong>: Mint accounting and silent failure ](#r33) 

 [7. Minting]  A successful mint increments the rune&#39;s mint count and adds the fixed amount (Amount at etching, 0 if absent) to the transaction&#39;s unallocated runes. A mint whose terms are not satisfied is simply ignored: it is not a cenotaph and does not count toward the cap. A mint in a transaction that is a cenotaph for other reasons does count toward the cap, and its output is burned (R45).

  <strong>ord Source:</strong> `src/index/updater/rune_updater.rs`     ## 8. Edicts

 
Edicts transfer rune balances from the transaction unallocated pool to specific output indices.

    ####  [ <strong>R34</strong>: Edict quadruple and delta encoding ](#r34) 

 [8. Edicts and delta encoding]  Each edict is four integers: block delta, transaction index or delta, amount, output. A running rune ID starts at 0:0. The block delta is added to the running block. If the block delta is 0, the transaction value is added to the running transaction index; if the block delta is nonzero, the transaction value is the absolute transaction index. Encoders must sort edicts by rune ID for this encoding to be compact; decoders reconstruct absolute IDs by accumulation.

  <strong>ord Source:</strong> `crates/ordinals/src/rune_id.rs`     ####  [ <strong>R35</strong>: Rune ID 0:0 refers to current etching ](#r35) 

 [8. Edicts and delta encoding]  The resulting ID 0:0 refers to the rune etched by this very transaction. If the transaction etches no rune (or the etching was disregarded under R28), such an edict is skipped without effect.

  <strong>ord Source:</strong> `src/index/updater/rune_updater.rs`     ####  [ <strong>R36</strong>: Invalid edict ID produces EdictRuneId flaw ](#r36) 

 [8. Edicts and delta encoding]  If ID accumulation overflows (block above u64, transaction index above u32) or produces block 0 with a nonzero transaction index, the transaction is a cenotaph with flaw EdictRuneId. Edict parsing stops at the first failure.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone/message.rs`  <strong>Violating Flaw:</strong> `EdictRuneId`     ####  [ <strong>R37</strong>: Edict output bounds and EdictOutput flaw ](#r37) 

 [8. Edicts and delta encoding]  The edict output must fit u32 and must be at most the transaction&#39;s output count. An output greater than the output count makes the transaction a cenotaph with flaw EdictOutput.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone/message.rs`  <strong>Violating Flaw:</strong> `EdictOutput`     ####  [ <strong>R38</strong>: Edict execution, sweeping, and splits ](#r38) 

 [8. Edicts and delta encoding]  Edicts are processed in order against the unallocated pool. An amount of 0 means the edict&#39;s entire remaining balance of that rune. A nonzero amount is clamped to the remaining balance. An edict output exactly equal to the output count is a split: with amount 0, the remaining balance is divided evenly over all non-OP_RETURN outputs, earlier outputs receiving the remainder one unit at a time; with a nonzero amount, that amount is allocated to each non-OP_RETURN output in order until the balance runs out.

  <strong>ord Source:</strong> `src/index/updater/rune_updater.rs`     ## 9. Pointer

 
Tag 22 specifies which output index receives all unallocated remainder balances after all edicts execute.

    ####  [ <strong>R39</strong>: Pointer destination and default fallback ](#r39) 

 [9. Pointer]  The Pointer (tag 22) must fit u32 and be strictly less than the output count; otherwise its value is unconsumed and the transaction is a cenotaph via R17. After all edicts are processed, remaining unallocated runes go to the pointer output. Without a pointer they go to the first non-OP_RETURN output. If no non-OP_RETURN output exists, they are burned.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`  <strong>Violating Flaw:</strong> `UnrecognizedEvenTag`     ## 10. Allocation & State Machine

 
The deterministic allocation state machine rules R40 through R44 govern UTXO rune balances.

    ####  [ <strong>R40</strong>: Unallocated pool composition ](#r40) 

 [10. State transitions]  A transaction&#39;s unallocated pool is the sum of: rune balances on every spent input outpoint, plus the minted amount when the runestone mints successfully, plus the premine when it etches.

  <strong>ord Source:</strong> `src/index/updater/rune_updater.rs`     ####  [ <strong>R41</strong>: OP_RETURN burns ](#r41) 

 [10. State transitions]  Allocations assigned to an OP_RETURN output are burned, whether they got there by edict or by pointer. This is the deliberate burn mechanism.

  <strong>ord Source:</strong> `src/index/updater/rune_updater.rs`     ####  [ <strong>R42</strong>: Default transfer without runestone ](#r42) 

 [10. State transitions]  A transaction with rune inputs and no runestone at all transfers every input rune balance to its first non-OP_RETURN output. Runes never disappear silently: every unit is either allocated to an output or recorded as burned.

  <strong>ord Source:</strong> `src/index/updater/rune_updater.rs`     ####  [ <strong>R43</strong>: Rune ID permanence ](#r43) 

 [10. State transitions]  A rune&#39;s ID is assigned at etching: the etching block height and the transaction&#39;s index within that block, written BLOCK:TX. IDs are permanent and never reassigned.

  <strong>ord Source:</strong> `src/index/updater/rune_updater.rs`     ####  [ <strong>R44</strong>: Outpoint balances and atomic units ](#r44) 

 [10. State transitions]  Balances are per rune, per outpoint, in atomic units (u128). An outpoint may carry balances of any number of runes. Spending the outpoint releases all of them into the spending transaction&#39;s unallocated pool.

  <strong>ord Source:</strong> `src/index/updater/rune_updater.rs`     ## 11. Cenotaphs & Flaw Reference

 
A cenotaph is a malformed runestone. When a cenotaph is detected, the transaction loses all input rune balances.

   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></path></svg>    Total Destruction on Malformation (Rule R45)    <p>
All input runes entering a cenotaph transaction are permanently burned. They cannot be recovered, redirected, or spent. Any etching becomes unmintable, and any mint is burned.

      <caption>Complete flaw list as reported by ord 0.29.0</caption>   Flaw Name Trigger Condition Controlling Rule Reference Source     `Opcode` Non-pushdata opcode after OP_13  [R5](/runes/specification.html#r5)   crates/ordinals/src/runestone.rs   `InvalidScript` Unparseable script after OP_13  [R6](/runes/specification.html#r6)   crates/ordinals/src/runestone.rs   `Varint` Overlong, overflowing, or unterminated varint  [R10](/runes/specification.html#r10)   crates/ordinals/src/runestone.rs   `TruncatedField` Tag with no value  [R13](/runes/specification.html#r13)   crates/ordinals/src/runestone/message.rs   `TrailingIntegers` Edict group shorter than four integers  [R15](/runes/specification.html#r15)   crates/ordinals/src/runestone/message.rs   `UnrecognizedEvenTag` Unconsumed even-tag value, any cause  [R17](/runes/specification.html#r17)   crates/ordinals/src/runestone.rs   `UnrecognizedFlag` Flag bit left set after consumption  [R19](/runes/specification.html#r19)   crates/ordinals/src/runestone.rs   `SupplyOverflow` premine + cap * amount overflows u128  [R27](/runes/specification.html#r27)   crates/ordinals/src/runestone.rs   `EdictRuneId` Edict ID accumulation invalid or overflowing  [R36](/runes/specification.html#r36)   crates/ordinals/src/runestone/message.rs   `EdictOutput` Edict output greater than the output count  [R37](/runes/specification.html#r37)   crates/ordinals/src/runestone/message.rs         ####  [ <strong>R45</strong>: Cenotaph consequences ](#r45) 

 [11. Cenotaphs]  A cenotaph is a runestone that violates any rule marked above as producing one. In a cenotaph transaction: every input rune balance and every minted or premined amount is burned; a mint still increments the target rune&#39;s mint count; and an etching (if its name is valid and committed under R28) still creates the rune, but with no recorded divisibility, symbol, spacers, premine, or terms, and permanently unmintable.

  <strong>ord Source:</strong> `src/index/updater/rune_updater.rs`     ####  [ <strong>R46</strong>: Upgrade mechanism through forward compatibility ](#r46) 

 [11. Cenotaphs]  Cenotaphs are the protocol&#39;s forward-compatibility mechanism. Future upgrades may assign meaning to currently unrecognized even tags and flags. Unupgraded clients, applying these rules, will treat upgraded runestones as cenotaphs and report the affected runes as burned rather than misreporting who owns them.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`     ####  [ <strong>R47</strong>: First flaw reported ](#r47) 

 [11. Cenotaphs]  Only the first flaw encountered is reported by the reference implementation, but any single flaw is sufficient: cenotaph status is not a matter of degree.

  <strong>ord Source:</strong> `crates/ordinals/src/runestone.rs`     ## 12. Genesis Rune

 
Rune `1:0` (`UNCOMMON•GOODS`) was etched at the activation height of the protocol (Block 840,000) by Casey Rodarmor. It has divisibility 0, currency symbol `⧈`, mint amount 1, no cap, and minting remains open until the next Bitcoin halving at Block 1,050,000.

    #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/specification.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/specification.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
