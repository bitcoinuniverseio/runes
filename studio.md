# Runestone Studio

[Runes](/runes/) / Runestone Studio  Interactive Protocol Diagnostic Suite

 # Runestone Studio

 All-in-one interactive diagnostic suite for composing, decoding, inspecting, simulating, and dissecting Runestones on Bitcoin.

  
8 diagnostic modes · Full client-side simulation · Zero external network dependencies.
 ## Studio Diagnostic Suite

 
Runestone Studio gives engineers, wallet architects, and security auditors direct, interactive visibility into the Runes state machine. Select any mode below to begin:

   <button type="button" class="studio-tab active" role="tab" data-tab="tab-compose">1. Compose Runestone</button> <button type="button" class="studio-tab" role="tab" data-tab="tab-decode">2. Decode Script</button> <button type="button" class="studio-tab" role="tab" data-tab="tab-inspect-tx">3. Inspect Raw Tx</button> <button type="button" class="studio-tab" role="tab" data-tab="tab-simulate">4. Simulate Allocation</button> <button type="button" class="studio-tab" role="tab" data-tab="tab-scrubber">5. Explain Bytes</button> <button type="button" class="studio-tab" role="tab" data-tab="tab-compare">6. Compare Runestones</button> <button type="button" class="studio-tab" role="tab" data-tab="tab-autopsy">7. Cenotaph Autopsy</button> <button type="button" class="studio-tab" role="tab" data-tab="tab-size">8. Size & Policy</button>  <!-- 1. Compose Mode -->  ### Compose Runestone

 
Construct a valid Runestone. The core automatically delta-encodes edicts, tags fields, and verifies round-trip decodability.

 <form id="compose-form">   #### Etching (Optional)

  <label class="form-label" for="compose-rune-name">Rune Name (e.g. UNCOMMONGOODS)</label> <input type="text" id="compose-rune-name" class="form-input" placeholder="A-Z characters">   <label class="form-label" for="compose-divisibility">Divisibility (0–38)</label> <input type="number" id="compose-divisibility" class="form-input" min="0" max="38" value="0">   <label class="form-label" for="compose-symbol">Currency Symbol (e.g. ¤, ᚱ, ⚡)</label> <input type="text" id="compose-symbol" class="form-input" maxlength="2" placeholder="Single character">   <label class="form-label" for="compose-premine">Premine Units</label> <input type="text" id="compose-premine" class="form-input" placeholder="0">   <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; cursor: pointer;"> <input type="checkbox" id="compose-turbo"> Enable Turbo Flag </label>    #### Mint & Routing

  <label class="form-label" for="compose-mint">Mint Rune ID (Block:Tx)</label> <input type="text" id="compose-mint" class="form-input" placeholder="e.g. 840000:1">   <label class="form-label" for="compose-pointer">Default Pointer (Output Index)</label> <input type="number" id="compose-pointer" class="form-input" min="0" placeholder="e.g. 1 (routes remainder)">  #### Edicts (Transfer Instructions)

  <label class="form-label" for="compose-edicts">Edicts: RuneID,Amount,Output (one per line)</label> <textarea id="compose-edicts" class="form-textarea" rows="4" placeholder="840000:1,1000,1&#10;840000:3,0,2"></textarea> Use amount 0 to allocate the entire remaining balance. Use 0:0 for newly etched rune.     <button type="submit" class="btn-primary">Generate Runestone Script</button> <button type="button" id="compose-preset-transfer" class="btn-secondary">Load Transfer Preset</button> <button type="button" id="compose-preset-etch" class="btn-secondary">Load Etching Preset</button>  </form>   <!-- 2. Decode Script Mode -->  ### Decode Script Hex

 <form id="studio-decode-form">  <label class="form-label" for="studio-decode-hex">Script Hex</label> <textarea id="studio-decode-hex" class="form-textarea" rows="3" placeholder="6a5d..."></textarea>   <label class="form-label" for="studio-decode-outputs">Output Count</label> <input type="number" id="studio-decode-outputs" class="form-input" min="1" placeholder="e.g. 2">  <button type="submit" class="btn-primary">Inspect</button> </form>   <!-- 3. Inspect Raw Tx Mode -->  ### Inspect Raw Bitcoin Transaction

 
Paste a raw serialized transaction hex (SegWit or legacy). The tool extracts inputs, identifies all outputs, and deciphers the active Runestone.

 <form id="tx-inspect-form">  <label class="form-label" for="tx-raw-hex">Raw Transaction Hex</label> <textarea id="tx-raw-hex" class="form-textarea" rows="5" placeholder="Paste 01000000000101... transaction hex here"></textarea>   <button type="submit" class="btn-primary">Parse Transaction</button> <button type="button" id="tx-sample-btn" class="btn-secondary">Load Sample Transaction</button>  </form>   <!-- 4. Simulate Allocation Mode -->  ### Simulate Runes Allocation

 
Simulate UTXO balance transitions, edict execution, splits, pointer fallbacks, and cenotaph burns under rules R38–R45.

 <form id="simulate-form">    <label class="form-label" for="sim-inputs">Input Balances (RuneID:Amount, one per line)</label> <textarea id="sim-inputs" class="form-textarea" rows="3" placeholder="840000:3:2000"></textarea>   <label class="form-label" for="sim-outputs-count">Transaction Outputs Count</label> <input type="number" id="sim-outputs-count" class="form-input" value="3" min="1">   <label class="form-label" for="sim-opreturn-idx">OP_RETURN Output Index</label> <input type="number" id="sim-opreturn-idx" class="form-input" value="0" min="0">     <label class="form-label" for="sim-edicts">Edicts (RuneID,Amount,OutputIndex)</label> <textarea id="sim-edicts" class="form-textarea" rows="3" placeholder="840000:3,1500,1"></textarea>   <label class="form-label" for="sim-pointer">Pointer (Optional)</label> <input type="number" id="sim-pointer" class="form-input" placeholder="e.g. 2">   <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; cursor: pointer;"> <input type="checkbox" id="sim-cenotaph"> Simulate Cenotaph Flaw </label>    <button type="submit" class="btn-primary" style="margin-top: 1rem;">Run Simulation</button> </form>   <!-- 5. Explain Bytes Scrubber -->  ### Explain Bytes (Byte Scrubber)

 
Interactive byte breakdown. Hover over individual byte chunks to see which protocol element produced them.

  <label class="form-label" for="scrubber-hex">Script Hex to Inspect</label> <input type="text" id="scrubber-hex" class="form-input" value="6a5d0800c0a23303e80701">    Byte Inspector Hover over any byte above to view its technical explanation.

   <!-- 6. Compare Two Runestones -->  ### Compare Two Runestones

 
Diff two runestone scripts side-by-side to detect tag discrepancies, edict order differences, or size optimizations.

   <label class="form-label" for="cmp-hex-a">Runestone Script A</label> <textarea id="cmp-hex-a" class="form-textarea" rows="3" placeholder="6a5d..."></textarea>   <label class="form-label" for="cmp-hex-b">Runestone Script B</label> <textarea id="cmp-hex-b" class="form-textarea" rows="3" placeholder="6a5d..."></textarea>   <button type="button" id="cmp-btn" class="btn-primary">Compare Runestones</button>   <!-- 7. Cenotaph Autopsy -->  ### Cenotaph Autopsy

 
Examine any flawed or malicious script to pinpoint the exact failing byte offset and applicable protocol rule.

  <label class="form-label" for="autopsy-preset">Select Known Flawed Script</label> <select id="autopsy-preset" class="form-select"> <option value="6a5d021605">C7: Pointer (tag 22) equals or exceeds output count (outputs=2)</option> <option value="6a5d0400010101">C2: Truncated field (odd count of integers before body)</option> <option value="6a5d69">C11: Non-push opcode in OP_RETURN (OP_VERIFY 0x69)</option> <option value="6a5d18020308020a80808080808080808080808080808080808002">C13: Supply overflow (cap * amount > u128)</option> <option value="6a5d020208">C6: Unrecognized flag bit (0x08 not Etching, Terms, or Turbo)</option> <option value="6a5d021e01">C5: Unrecognized even tag (tag 30 is even and unknown)</option> </select>   <label class="form-label" for="autopsy-hex">Script Hex Under Investigation</label> <textarea id="autopsy-hex" class="form-textarea" rows="2"></textarea>   <label class="form-label" for="autopsy-outputs">Output Count</label> <input type="number" id="autopsy-outputs" class="form-input" value="2">  <button type="button" id="autopsy-run-btn" class="btn-primary">Execute Autopsy</button>   <!-- 8. Size & Policy Analysis -->  ### Size & Policy Analysis

 
Audit runestone byte consumption against standard Bitcoin Core relay limits (83 bytes default OP_RETURN).

  <label class="form-label" for="size-hex">Script Hex</label> <textarea id="size-hex" class="form-textarea" rows="3" placeholder="6a5d..."></textarea>  <button type="button" id="size-btn" class="btn-primary">Analyze Relay Policy</button>     ## The 8 Diagnostic Modes

  - <strong>Compose Runestone:</strong> Visually configure etchings, open mint terms, pointer routing, and edicts. Emits verified script hex and checks standard Bitcoin relay policy (83-byte limit).
 - <strong>Decode Script:</strong> Paste any raw OP_RETURN script hex to inspect concatenated payload pushes, LEB128 decoded integers, and parsed message fields.
 - <strong>Inspect Raw Tx:</strong> Paste raw serialized Bitcoin transaction hex to automatically extract inputs, parse outputs, and decipher candidate Runestones in place.
 - <strong>Simulate Allocation:</strong> Test complex multi-input, multi-output state transitions. Models edict execution order, balance sweeps, remainder pointers, and cenotaph burns.
 - <strong>Explain Bytes:</strong> An interactive byte scrubber. Hover or tap individual hex byte pairs to inspect the exact opcode, varint, or tag definition.
 - <strong>Compare Two Runestones:</strong> Diff two script payloads side-by-side to detect tag discrepancies, edict order differences, or size optimizations.
 - <strong>Cenotaph Autopsy:</strong> Craft or inspect malformed scripts to pinpoint the exact failing byte offset, stage, and controlling rule.
 - <strong>Size & Policy Analysis:</strong> Measure script weight, data push limits, and relay policy compliance.
  ## Browser Engine & Performance

 
The entire Studio is driven by the typed `@bitcoinuniverse/runes-tools` pure TypeScript library. It runs 100% locally in your browser session with sub-millisecond execution times and zero external API calls.

    #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/studio.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/studio.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
