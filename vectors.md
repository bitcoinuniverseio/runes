# Runes Test Vectors

[Runes](/runes/) / Runes Test Vectors  Protocol Conformance Suite

 # Runes Test Vectors

 Authoritative conformance test suite containing all 24 vectors (V1–V8, C1–C14, N1–N2) verified against ord 0.29.0.

  
24 authoritative test vectors verified against Casey Rodarmor's ord 0.29.0 reference test suite.
 ## 1. How to Run the Vectors

 
You can run this test suite in your browser, via the command line, or in automated CI:

 `# Run vectors via local CLI
npm run test:conformance

# Or run via @bitcoinuniverse/runes-tools CLI
npx runes run-vectors --json`</pre> <p>
You can also test any vector interactively in the browser by clicking the <strong>Test →</strong> button next to each vector below, or in the [Conformance Center](/runes/conformance.html).

 ## 2. Valid Runestones (V1–V8)

 
These vectors represent valid runestones that parse without flaws under consensus rules.

   <caption>Valid Runestones (V1 through V8)</caption>   ID Case Name Script Hex Outputs Expected Decoding Action     <strong>V1</strong> Empty runestone  `6a5d`  2   Runestone with no fields. Input runes transfer to the first non-OP_RETURN output.

   [
Test →
](/runes/decoder.html?hex=6a5d&outputs=2)   <strong>V2</strong> Single edict transfer  `6a5d0800c0a23303e80701`  2   One edict: rune 840000:3, amount 1000, output 1. Remainder to output 0.

   [
Test →
](/runes/decoder.html?hex=6a5d0800c0a23303e80701&outputs=2)   <strong>V3</strong> Two edicts, delta encoded  `6a5d0d00c0a23303e807010019f40300`  2   Edict 1: 840000:3, 1000, output 1. Edict 2: block delta 0 and tx delta 25 give 840000:28, 500, output 0.

   [
Test →
](/runes/decoder.html?hex=6a5d0d00c0a23303e807010019f40300&outputs=2)   <strong>V4</strong> Sweep, amount zero  `6a5d0700c0a233030001`  2   One edict: 840000:3, amount 0 meaning the entire remaining balance, to output 1.

   [
Test →
](/runes/decoder.html?hex=6a5d0700c0a233030001&outputs=2)   <strong>V5</strong> Even split  `6a5d0700c0a233030003`  3   Output index 3 equals the output count, so the balance is divided evenly across all non-OP_RETURN outputs, earlier outputs taking the remainder. The identical bytes with 2 outputs are vector C6.

   [
Test →
](/runes/decoder.html?hex=6a5d0700c0a233030003&outputs=3)   <strong>V6</strong> Mint  `6a5d0614c0a2331403`  2   Mint of rune 840000:3 (tag 20 given twice: block, then tx). Minted amount goes to output 0.

   [
Test →
](/runes/decoder.html?hex=6a5d0614c0a2331403&outputs=2)   <strong>V7</strong> Mint with pointer  `6a5d0814c0a23314031601`  2   Same mint, plus pointer (tag 22) = 1, so the minted amount goes to output 1.

   [
Test →
](/runes/decoder.html?hex=6a5d0814c0a23314031601&outputs=2)   <strong>V8</strong> Full etching  `6a5d22020704c2e1d8f3d9a4f589cf100102034005924d06c0843d0ae8070888a40112a065`  2   Etching of BITCOIN•UNIVERSE: flags 7 (Etching, Terms, Turbo), name value 153272084900779274434, divisibility 2, spacers 64, symbol U+2692, premine 1000000, amount 1000, cap 21000, offset end 12960. Max supply 22,000,000 atomic units.

   [
Test →
](/runes/decoder.html?hex=6a5d22020704c2e1d8f3d9a4f589cf100102034005924d06c0843d0ae8070888a40112a065&outputs=2)      ## 3. Cenotaph Vectors (C1–C14)

 
These vectors demonstrate malformed or adversarial scripts that trigger Cenotaph flaws under Rule R45.

   <caption>Cenotaph Vectors (C1 through C14)</caption>   ID Case Name Script Hex Outputs Flaw & Rationale Action     <strong>C1</strong> Rune tag without Etching flag  `6a5d020404`  2  <strong>Flaw:</strong> `UnrecognizedEvenTag`

 Tag 4 is an etching field. With no Etching flag it is never consumed, and an unconsumed even tag is fatal.

   [
Test →
](/runes/decoder.html?hex=6a5d020404&outputs=2)   <strong>C2</strong> Unrecognized flag bit  `6a5d020208`  2  <strong>Flaw:</strong> `UnrecognizedFlag`

 Flags value 8 sets bit 3, which has no assigned meaning. Bits left set after consumption are fatal.

   [
Test →
](/runes/decoder.html?hex=6a5d020208&outputs=2)   <strong>C3</strong> Tag with no value  `6a5d03020302`  2  <strong>Flaw:</strong> `TruncatedField`

 Integers are 2, 3, 2: the trailing tag 2 has no following value.

   [
Test →
](/runes/decoder.html?hex=6a5d03020302&outputs=2)   <strong>C4</strong> Trailing integers in body  `6a5d0400010101`  2  <strong>Flaw:</strong> `TrailingIntegers`

 After the Body tag, three integers remain. Edicts come in groups of exactly four.

   [
Test →
](/runes/decoder.html?hex=6a5d0400010101&outputs=2)   <strong>C5</strong> Invalid edict rune ID  `6a5d050000010200`  2  <strong>Flaw:</strong> `EdictRuneId`

 Block delta 0 with tx delta 1 yields ID 0:1. Block 0 with a nonzero tx index is not a valid rune ID.

   [
Test →
](/runes/decoder.html?hex=6a5d050000010200&outputs=2)   <strong>C6</strong> Edict output beyond count  `6a5d0800c0a23303e80705`  2  <strong>Flaw:</strong> `EdictOutput`

 Output index 5 exceeds the output count of 2. Only equality is allowed, as a split.

   [
Test →
](/runes/decoder.html?hex=6a5d0800c0a23303e80705&outputs=2)   <strong>C7</strong> Pointer beyond output count  `6a5d021605`  2  <strong>Flaw:</strong> `UnrecognizedEvenTag`

 Pointer 5 is not less than the output count, so the range check fails, the value is left unconsumed, and the even-tag rule fires. Note the flaw is not a dedicated pointer flaw.

   [
Test →
](/runes/decoder.html?hex=6a5d021605&outputs=2)   <strong>C8</strong> Partial mint  `6a5d0414c0a233`  2  <strong>Flaw:</strong> `UnrecognizedEvenTag`

 Tag 20 needs two values. One value cannot be consumed, so it remains and is fatal.

   [
Test →
](/runes/decoder.html?hex=6a5d0414c0a233&outputs=2)   <strong>C9</strong> Reserved even tag  `6a5d027e00`  2  <strong>Flaw:</strong> `UnrecognizedEvenTag`

 Tag 126 is reserved and unrecognized by definition.

   [
Test →
](/runes/decoder.html?hex=6a5d027e00&outputs=2)   <strong>C10</strong> Supply overflow  `6a5d18020308020a80808080808080808080808080808080808002`  2  <strong>Flaw:</strong> `SupplyOverflow`

 Etching with Terms, cap 2 and amount 2^127. cap * amount overflows u128.

   [
Test →
](/runes/decoder.html?hex=6a5d18020308020a80808080808080808080808080808080808002&outputs=2)   <strong>C11</strong> Non-pushdata opcode  `6a5d69`  2  <strong>Flaw:</strong> `Opcode`

 0x69 is OP_VERIFY. Anything that is not a pushdata opcode after OP_13 is fatal, including OP_PUSHNUM opcodes.

   [
Test →
](/runes/decoder.html?hex=6a5d69&outputs=2)   <strong>C12</strong> Push runs past end of script  `6a5d04beef`  2  <strong>Flaw:</strong> `InvalidScript`

 A 4-byte push is declared but only 2 bytes follow, so the script does not parse.

   [
Test →
](/runes/decoder.html?hex=6a5d04beef&outputs=2)   <strong>C13</strong> Unterminated varint  `6a5d0180`  2  <strong>Flaw:</strong> `Varint`

 The single payload byte 0x80 has the continuation bit set with nothing after it.

   [
Test →
](/runes/decoder.html?hex=6a5d0180&outputs=2)   <strong>C14</strong> Overlong varint  `6a5d148080808080808080808080808080808080808000`  2  <strong>Flaw:</strong> `Varint`

 Nineteen continuation bytes then a terminator: the varint exceeds the 19-byte limit.

   [
Test →
](/runes/decoder.html?hex=6a5d148080808080808080808080808080808080808000&outputs=2)      ## 4. Non-Runestone Outputs (N1–N2)

 
These scripts do not begin with the protocol identifier `OP_RETURN OP_13` and are therefore skipped by indexers without triggering a cenotaph.

   <caption>Non-Runestone Outputs (N1 through N2)</caption>   ID Case Name Script Hex Outputs Expected Decoding Action     <strong>N1</strong> Not an OP_RETURN output  `51`  2   Skipped when searching for a runestone. No artifact.

   [
Test →
](/runes/decoder.html?hex=51&outputs=2)   <strong>N2</strong> OP_RETURN without OP_13  `6a04deadbeef`  2   A plain data-carrier output. Skipped. No artifact, no cenotaph.

   [
Test →
](/runes/decoder.html?hex=6a04deadbeef&outputs=2)      ## 5. Ignored Values & Edge Cases

 
Under Rule R16, unrecognized odd tags are ignored silently without producing a cenotaph. For example, tag 1 with divisibility > 38 is ignored, defaulting divisibility to 0.

 ## 6. Beyond the Payload

 
Some protocol rules depend on chain state and transaction structure outside the OP_RETURN script itself:

  - <strong>Output Count Bounds:</strong> Edict output indices and pointer index must be strictly less than transaction output count.
 - <strong>Commitment Maturity:</strong> Etching commitment must have at least 6 confirmations.
 - <strong>Name Length at Height:</strong> Name must meet the minimum letter length for the block height.
     #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/vectors.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/vectors.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
