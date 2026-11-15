# Runestone Decoder

[Runes](/runes/) / Runestone Decoder  Interactive Inspection Tool

 # Runestone Decoder

 Interactive, client-side Runestone script decoder with field-by-field dissection and cenotaph flaw diagnosis.

  
Pure client-side execution · No network requests · 100% private and offline-capable.
 ## Runestone Decoder

 
Paste any raw `OP_RETURN` script hex or transaction output into the inspector below to decipher fields, examine varints, and diagnose cenotaph flaws in real time.

   <form id="decoder-form">  <label class="form-label" for="script-hex">Runestone Output Script (Hex)</label> <textarea id="script-hex" class="form-textarea" rows="3" placeholder="Paste OP_RETURN script hex beginning 6a 5d... e.g. 6a5d0800c0a23303e80701" spellcheck="false"></textarea>    <label class="form-label" for="tx-outputs">Transaction Output Count (Optional)</label> <input id="tx-outputs" class="form-input" type="number" min="1" placeholder="e.g. 2 (required for pointer and split range checks)">  <button type="submit" class="btn-primary" style="height: 38px;">Decipher Script</button> <button type="button" id="clear-btn" class="btn-secondary" style="height: 38px;">Clear</button>  </form>  Sample Test Vectors:  <button type="button" class="page-action-btn sample-btn" data-hex="6a5d" data-outputs="2">V1: Empty</button> <button type="button" class="page-action-btn sample-btn" data-hex="6a5d0800c0a23303e80701" data-outputs="2">V2: Transfer</button> <button type="button" class="page-action-btn sample-btn" data-hex="6a5d0d00c0a23303e807010019f40300" data-outputs="2">V3: Multi-Rune</button> <button type="button" class="page-action-btn sample-btn" data-hex="6a5d0700c0a233030003" data-outputs="3">V5: Split</button> <button type="button" class="page-action-btn sample-btn" data-hex="6a5d0614c0a2331403" data-outputs="2">V6: Mint</button> <button type="button" class="page-action-btn sample-btn" data-hex="6a5d22020704c2e1d8f3d9a4f589cf100102034005924d06c0843d0ae8070888a40112a065" data-outputs="2">V8: Full Etch</button> <button type="button" class="page-action-btn sample-btn" data-hex="6a5d021605" data-outputs="2" style="border-color: var(--burn-border); color: var(--burn-red);">C7: Pointer Flaw</button> <button type="button" class="page-action-btn sample-btn" data-hex="6a5d69" data-outputs="2" style="border-color: var(--burn-border); color: var(--burn-red);">C11: Opcode Flaw</button>    Paste an OP_RETURN script hex or click any sample vector above to inspect.

     ## How Inspection Works

 
The decoder executes the pure TypeScript `@bitcoinuniverse/runes-tools` core library in your browser:

  - <strong>Carrier Check:</strong> Verifies the script begins with `OP_RETURN (0x6a)` followed by `OP_13 (0x5d)`.
 - <strong>Push Concatenation:</strong> Extracts all contiguous data pushes and concatenates them into a single payload buffer.
 - <strong>LEB128 Decoding:</strong> Parses the payload into an array of unsigned integers, checking for overlong or truncated varints.
 - <strong>Field Consumption:</strong> Identifies tag-value pairs, extracts flags, etching parameters, mint targets, pointer, and edicts.
 - <strong>Flaw Analysis:</strong> Checks for unrecognized even tags, unrecognized flag bits, and supply overflows.
  ## Sharing & Deep Linking

 
You can share links directly to a decoded script using query parameters:

 `https://bitcoinuniverseio.github.io/runes/decoder.html?hex=6a5d0800c0a23303e80701&outputs=2`</pre>    #### Was this page technically accurate and helpful?

 <p style="margin: 0; font-size: 0.8125rem; color: var(--text-muted);">Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/decoder.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/decoder.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
