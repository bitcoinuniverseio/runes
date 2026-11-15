# Runes Implementer Reference

[Runes](/runes/) / Runes Implementer Reference  Engineering & Architecture Reference

 # Runes Implementer Reference

 Technical reference manual for developers building indexers, node software, block explorers, and non-custodial wallets for the Runes protocol.

  
Technical reference for Bitcoin indexer and wallet engineers · Pinned to ord 0.29.0.
 ## 1. Terminology

 <dl style="margin-bottom: 1.5rem;"> <dt><strong>Runestone:</strong></dt> <dd style="margin-left: 1.5rem; margin-bottom: 0.75rem;">A valid protocol message contained within an `OP_RETURN OP_13` script output that defines state transitions.</dd> <dt><strong>Cenotaph:</strong></dt> <dd style="margin-left: 1.5rem; margin-bottom: 0.75rem;">A malformed runestone. When a cenotaph is encountered, all input runes entering the transaction are burned to prevent protocol fragmentation.</dd> <dt><strong>Edict:</strong></dt> <dd style="margin-left: 1.5rem; margin-bottom: 0.75rem;">A 4-tuple `(RuneId, Amount, OutputIndex)` specifying a transfer of runes from the transaction balance pool to a specific output.</dd> <dt><strong>Pointer:</strong></dt> <dd style="margin-left: 1.5rem; margin-bottom: 0.75rem;">An output index specified via Tag 22 that receives all unallocated remainder balances after all edicts execute.</dd> <dt><strong>Spacers:</strong></dt> <dd style="margin-left: 1.5rem; margin-bottom: 0.75rem;">A bitmask specifying where display bullets (`•`) appear between letters in a rune name.</dd> </dl> ## 2. Indexer Pipeline

 
An indexer processes blocks strictly in blockchain order. For each block:

  - Initialize the block transaction counter at 0.
 - For each transaction, inspect outputs in order from 0 to N-1 to locate the first output beginning with `OP_RETURN OP_13`.
 - If found, extract data pushes and attempt LEB128 integer decoding.
 - Drain all spent input balances from the database into the transaction unallocated pool.
 - Apply etchings, mints, and edicts. If any cenotaph flaw occurs, burn the unallocated pool.
 - Commit output balances and burned amounts to the persistent database.
  ## 3. Open Mint Terms Evaluation

 
When a transaction contains a Mint instruction (Tag 20), the indexer verifies all terms:

  - <strong>Cap Check:</strong> If `mints >= cap`, the mint is ignored.
 - <strong>Absolute Height:</strong> If `heightStart` or `heightEnd` are defined, block height must satisfy `height >= heightStart` and `height < heightEnd`.
 - <strong>Relative Offset:</strong> If `offsetStart` or `offsetEnd` are defined, block height must satisfy `height >= etchingBlock + offsetStart` and `height < etchingBlock + offsetEnd`.
  ## 4. Confirmation Rules

 
Etchings require a two-phase commitment:

  - <strong>Commitment:</strong> A Taproot output containing a script with the little-endian bytes of the rune name.
 - <strong>Maturity:</strong> The commitment transaction must have at least 6 confirmations before being spent by the reveal transaction (Rule R27).
 - <strong>Early Reveal:</strong> If revealed with fewer than 6 confirmations, the etching is not invalid, but the requested name is disregarded and replaced with a reserved sequence name (Rule R28).
  ## 5. Reorganization Handling

 
In the event of a blockchain reorganization:

  - All state transitions in disconnected blocks must be reverted in reverse order.
 - Rune IDs (`Block:Tx`) are inherently tied to block height and transaction position. If transactions are reordered or confirmed at different heights in the reorged chain, their assigned Rune IDs will change.
 - Wallets must wait for 6 confirmations before considering rune balances final.
  ## 6. Script Sizes & Relay Policy

 
Standard Bitcoin nodes relay transactions with an `OP_RETURN` output up to <strong>83 bytes</strong> by default.
    Transactions exceeding 83 bytes are valid under consensus if included in a block, but will not propagate through standard mempools unless nodes configure a higher `-datacarriersize`.

 ## 7. Protocol Limits

    DimensionMaximum BoundControlling Rule   Divisibility38 decimal placesR24 Spacers0x07FFFFFF (27 bits)R25 Varint Size19 bytes (u128)R8 Supply Bound2^128 - 1R29 Pushes per ScriptUnlimited (chunked at 520 bytes)R2    ## 8. Security & Cenotaph Prevention

 
To prevent accidental cenotaph creation:

  - Never encode unrecognized even tags.
 - Always verify that edict output indices are strictly less than the total transaction output count.
 - Ensure pointer output index is strictly less than the transaction output count.
 - Ensure `premine + cap * amount` does not overflow 128-bit unsigned arithmetic.
  ## 9. Implementation Checklist

  - [ ] Accept non-minimal LEB128 varints during decoding (Rule R10).
 - [ ] Emit minimal LEB128 varints during encoding (Rule R11).
 - [ ] Enforce 19-byte limit on varints with overflow mask check at byte 19.
 - [ ] Ignore unrecognized odd tags (Rule R16).
 - [ ] Reject unrecognized even tags as cenotaphs (Rule R17).
 - [ ] Implement delta decoding for Rune IDs in edicts (Rule R35).
 - [ ] Verify all 24 authoritative conformance test vectors.
     #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/reference.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/reference.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
