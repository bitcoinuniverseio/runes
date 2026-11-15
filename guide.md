# Step-by-Step Guide to Runes

[Runes](/runes/) / Step-by-Step Guide to Runes  Worked Tutorial

 # Step-by-Step Guide to Runes

 Practical, worked examples demonstrating transfers, multi-rune edicts, balance splits, open mints, and etchings on Bitcoin.

  
Practical worked walkthroughs with exact hex scripts and byte breakdowns.
 ## 1. Mental Model

 
When working with Runes, remember that runes are not stored inside the runestone itself.
    The runestone is merely an instruction sheet telling the Bitcoin transaction how to route the runes that entered through the spent inputs.

 ## 2. Basic Transfer

 
Suppose you have a UTXO containing 1,000 units of rune `840000:3`.
    You want to send all 1,000 units to a recipient at output 1.

 
The simplest way is to omit all edicts and set the <strong>Pointer</strong> (Tag 22) to 1:

 `OP_RETURN OP_13 OP_PUSHBYTES_2 16 01`</pre> <p> `16` is varint 22 (Pointer), and `01` is output index 1.
    All unallocated runes entering the transaction route directly to output 1.

 ## 3. Two Edicts & Change

 
Suppose you hold 5,000 units of rune `840000:3`. You want to send 2,000 units to Alice (output 1), 1,000 units to Bob (output 2), and return the remaining 2,000 units to yourself (output 3).

 
You construct two edicts and set the pointer to your change output:

  - Edict 1: `840000:3`, amount 2,000 -> output 1
 - Edict 2: `840000:3`, amount 1,000 -> output 2
 - Pointer: Output 3 (receives the remaining 2,000 units)
  ## 4. Splitting Balances

 
Under Rule R38, if an edict specifies an output index equal to the total number of transaction outputs, the specified amount is divided across all non-OP_RETURN outputs:

  - If amount is 0: The entire unallocated balance divides evenly across all spendable outputs.
 - If amount is non-zero: Units are distributed in order to each spendable output until the balance runs out.
  ## 5. Minting Runes

 
To mint an active rune, include Tag 20 with the target Rune ID:

 `OP_RETURN OP_13 OP_PUSHBYTES_6 14 c0 a2 33 14 03`</pre> <p>
Tag 20 appears twice: first for the block height (840,000), then for the transaction index (3).
    The minted units enter the unallocated pool and route to the pointer or first spendable output.

 ## 6. Etching a Rune

 
Etching requires two transactions:

  - <strong>Commitment:</strong> A Taproot output containing the little-endian bytes of the name.
 - <strong>Reveal:</strong> After 6 blocks, spend the commitment output with a runestone containing Tag 2 (Flags: Etching) and Tag 4 (Rune name value).
  ## 7. How Etchings Fail

 
Common reasons etchings do not succeed as intended:

  - <strong>Too Young:</strong> Spending the commitment before 6 confirmations (causes name to be disregarded and assigned a reserved sequence name).
 - <strong>Locked Name:</strong> Etching a name with fewer letters than unlocked at the current block height (silently disregarded).
 - <strong>Already Etched:</strong> Name was etched earlier by another transaction (silently disregarded).
  ## 8. Burning Runes

 
Runes can be deliberately burned by explicitly directing an edict to an `OP_RETURN` output.
    Any units directed to an `OP_RETURN` output are permanently destroyed.

 ## 9. Review Checklist

  - [ ] Confirm output indices match planned addresses.
 - [ ] Check that pointer output index is strictly less than total outputs.
 - [ ] Verify total script size is under 83 bytes for fast standard relay.
  ## 10. Protocol Support

 
For interactive experiments and testing, launch the [Runestone Studio](/runes/studio.html) or test your scripts in the [Standalone Decoder](/runes/decoder.html).

    #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/guide.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/guide.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
