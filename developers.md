# Developer Hub &amp; Companion Toolkit

[Runes](/runes/) / Developer Hub & Companion Toolkit  SDK & Integration Architecture

 # Developer Hub & Companion Toolkit

 Typed TypeScript SDK, runnable quickstarts, architecture diagrams, and CLI reference for building Runes applications on Bitcoin.

  
Pure TypeScript SDK · Zero native dependencies · Node.js & browser isomorphic.
 ## 1. @bitcoinuniverse/runes-tools SDK

 
Install the official companion toolkit from npm or use it directly via workspace imports:

 `npm install @bitcoinuniverse/runes-tools`</pre> <p>
The library contains no C++ bindings, WebAssembly blobs, or native binary shims. It runs identically in Node.js 20+, modern web browsers, Cloudflare Workers, and Deno.

 ## 2. Ten Practical Quickstarts

 ### 1. Decipher a Script Hex

 `import { decipher } from '@bitcoinuniverse/runes-tools';

const result = decipher('6a5d0800c0a23303e80701', 2);
if (result.cenotaph) {
  console.error('Cenotaph flaw:', result.flaw);
} else {
  console.log('Valid runestone. Edicts count:', result.edicts.length);
}`</pre> ### 2. Encipher a Transfer Runestone

 ```
import { encipher } from '@bitcoinuniverse/runes-tools';

const { scriptHex } = encipher({
  pointer: 1, // Change routes to output 1
  edicts: [
    { id: { block: 840000n, tx: 3 }, amount: 1000n, output: 0 }
  ]
});
console.log('Script Hex:', scriptHex);
```

 ### 3. Encipher an Open Mint

 ```
import { encipher } from '@bitcoinuniverse/runes-tools';

const { scriptHex } = encipher({
  mint: { block: 840000n, tx: 1 },
  pointer: 1
});
```

 ### 4. Encipher a New Rune Etching

 ```
import { encipher, parseSpacedName } from '@bitcoinuniverse/runes-tools';

const { nameValue, spacers } = parseSpacedName('UNCOMMON•GOODS');
const { scriptHex } = encipher({
  etching: {
    rune: nameValue,
    spacers,
    divisibility: 0n,
    symbol: 0x25c8n,
    turbo: true,
    terms: {
      amount: 1n,
      cap: 21000000n,
      offsetEnd: 1050000n
    }
  },
  pointer: 1
});
```

 ### 5. Encode and Decode Modified Base-26 Names

 ```
import { encodeRuneName, decodeRuneName } from '@bitcoinuniverse/runes-tools';

const intVal = encodeRuneName('BITCOIN');
console.log('Integer value:', intVal);
console.log('Decoded back:', decodeRuneName(intVal)); // 'BITCOIN'
```

 ### 6. Format and Parse Spacers

 ```
import { formatSpacedName, parseSpacedName } from '@bitcoinuniverse/runes-tools';

const parsed = parseSpacedName('BITCOIN•UNIVERSE');
console.log('Name:', parsed.name);
console.log('Spacers bitmask:', parsed.spacers);
console.log('Formatted:', formatSpacedName(parsed.nameValue, parsed.spacers));
```

 ### 7. Generate Taproot Commitment Script Data Push

 ```
import { encodeRuneName, getRuneCommitmentBytes, bytesToHex } from '@bitcoinuniverse/runes-tools';

const nameVal = encodeRuneName('MYRUNENAME');
const commitBytes = getRuneCommitmentBytes(nameVal);
console.log('Commitment push bytes:', bytesToHex(commitBytes));
```

 ### 8. Parse a Raw Bitcoin Transaction

 ```
import { parseRawTransaction } from '@bitcoinuniverse/runes-tools';

const tx = parseRawTransaction(rawHex);
console.log('Inputs count:', tx.inputs.length);
console.log('Outputs count:', tx.outputs.length);
if (tx.runestone) {
  console.log('Runestone found at output:', tx.runestoneOutputIndex);
}
```

 ### 9. Simulate Multi-Output Allocation State Transitions

 ```
import { simulateAllocation } from '@bitcoinuniverse/runes-tools';

const sim = simulateAllocation({
  numOutputs: 3,
  inputBalances: { '840000:3': 5000n },
  edicts: [{ id: { block: 840000n, tx: 3 }, amount: 2000n, output: 1 }],
  pointer: 2
});
console.log('Recipient balance:', sim.outputs[1].balances['840000:3']); // 2000n
console.log('Change balance:', sim.outputs[2].balances['840000:3']);    // 3000n
```

 ### 10. Verify Supply Conservation

 ```
import { simulateAllocation } from '@bitcoinuniverse/runes-tools';

const sim = simulateAllocation({ /* ... */ });
if (!sim.conserved) {
  throw new Error('Critical: Supply violation detected!');
}
```

 ## 3. Architecture & Data Flow

  Linear Pipeline Architecture <p>
Raw Hex → Bitcoin Script Push Splitter → LEB128 Varint Stream → Tag-Value Consuming Queue → Etching/Mint Parser → Delta Edict Accumulator → UTXO Allocation Engine → Output Balance Commit.

  ## 4. CLI Reference

 
The command-line tool provides terminal commands for scripting:

 `# Decode script hex
npx runes decode <script-hex> [--outputs <n>] [--json]

# Inspect raw transaction
npx runes inspect-tx <raw-tx-hex> [--json]

# Run all 24 vectors
npx runes run-vectors [--json] [--junit]

# Explain a cenotaph flaw
npx runes explain-flaw SupplyOverflow`</pre>    #### Was this page technically accurate and helpful?

 <p style="margin: 0; font-size: 0.8125rem; color: var(--text-muted);">Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/developers.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/developers.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
