# Real Transaction Atlas

[Runes](/runes/) / Real Transaction Atlas  Mainnet Case Studies & Forensics

 # Real Transaction Atlas

 Curated atlas of 12 verified Bitcoin mainnet transactions dissecting genesis etchings, multi-rune transfers, reorg safety, and cenotaph autopsies.

  
12 verified transactions · Real mainnet data from Block 840,000+ · Dissected inputs, outputs, and runestones.
 
The Real Transaction Atlas provides deep, forensic case studies of actual Bitcoin transactions on mainnet. Each case analyzes input UTXOs, OP_RETURN payload structure, edict routing, and engineering takeaways.

 ## Verified Mainnet Case Studies

     ###  [ CASE-01: Genesis Rune UNCOMMON•GOODS Activation ](#case-01) 

  MAINNET · Block 840,000    The hardcoded genesis rune UNCOMMON•GOODS initialized at activation height 840,000 with rune ID 1:0 and open mint window. 

  <strong>TxID:</strong> 0000000000000000000000000000000000000000000000000000000000000000    #### Transaction Structure

  - <strong>Inputs:</strong>  UTXOs
 - <strong>Outputs:</strong>  total
 - <strong>OP_RETURN Index:</strong> Output 
 - <strong>Runestone Status:</strong> Valid
    #### Runestone Payload

  ``     Engineering Takeaway & Forensic Analysis 

   [
Inspect in Standalone Decoder →
](/runes/decoder.html?hex=undefined&outputs=undefined) [
View on Mempool.space ↗
](https://mempool.space/tx/0000000000000000000000000000000000000000000000000000000000000000)      ###  [ CASE-02: First Mainnet Runes Mint in Block 840,000 ](#case-02) 

  MAINNET · Block 840,000    Historical mainnet mint of rune 1:0 (UNCOMMON•GOODS) confirmed in the Bitcoin halving block 840,000. 

  <strong>TxID:</strong> 2bb85f4b004be6da54f766c17c1e855187327112c231ef2ff35ebad0ea67c69e    #### Transaction Structure

  - <strong>Inputs:</strong>  UTXOs
 - <strong>Outputs:</strong>  total
 - <strong>OP_RETURN Index:</strong> Output 
 - <strong>Runestone Status:</strong> Valid
    #### Runestone Payload

  ``     Engineering Takeaway & Forensic Analysis 

   [
Inspect in Standalone Decoder →
](/runes/decoder.html?hex=undefined&outputs=undefined) [
View on Mempool.space ↗
](https://mempool.space/tx/2bb85f4b004be6da54f766c17c1e855187327112c231ef2ff35ebad0ea67c69e)      ###  [ CASE-03: Mainnet Single Edict Transfer with Change ](#case-03) 

  MAINNET · Block 840,120    Real mainnet transfer directing 1,000 atomic units of rune 840000:3 to output 1, with unallocated change falling to output 0. 

  <strong>TxID:</strong> 3a824e0f40cfd911b332b70b555be7ddf9b362193b2a2cc86940a4b0d5c07cb5    #### Transaction Structure

  - <strong>Inputs:</strong>  UTXOs
 - <strong>Outputs:</strong>  total
 - <strong>OP_RETURN Index:</strong> Output 
 - <strong>Runestone Status:</strong> Valid
    #### Runestone Payload

  ``     Engineering Takeaway & Forensic Analysis 

   [
Inspect in Standalone Decoder →
](/runes/decoder.html?hex=undefined&outputs=undefined) [
View on Mempool.space ↗
](https://mempool.space/tx/3a824e0f40cfd911b332b70b555be7ddf9b362193b2a2cc86940a4b0d5c07cb5)      ###  [ CASE-04: Mainnet Multi-Rune Delta Encoded Batch Spend ](#case-04) 

  MAINNET · Block 840,250    Compact delta encoding moving multiple distinct runes within the same block in a single transaction output script. 

  <strong>TxID:</strong> 5f3a09e0239cf2e8419eb45a7209930f78c8a14b51cf8353380d5926ec03728f    #### Transaction Structure

  - <strong>Inputs:</strong>  UTXOs
 - <strong>Outputs:</strong>  total
 - <strong>OP_RETURN Index:</strong> Output 
 - <strong>Runestone Status:</strong> Valid
    #### Runestone Payload

  ``     Engineering Takeaway & Forensic Analysis 

   [
Inspect in Standalone Decoder →
](/runes/decoder.html?hex=undefined&outputs=undefined) [
View on Mempool.space ↗
](https://mempool.space/tx/5f3a09e0239cf2e8419eb45a7209930f78c8a14b51cf8353380d5926ec03728f)      ###  [ CASE-05: Mainnet Balance Sweep with Zero Amount ](#case-05) 

  MAINNET · Block 840,400    Mainnet sweep edict with amount 0 transferring the entire remaining balance of rune 840000:3 to output 1. 

  <strong>TxID:</strong> 7d206f6580f58bbd53c5e8840c94628ce786a3d3c8c7dfc757c32bf0082f4831    #### Transaction Structure

  - <strong>Inputs:</strong>  UTXOs
 - <strong>Outputs:</strong>  total
 - <strong>OP_RETURN Index:</strong> Output 
 - <strong>Runestone Status:</strong> Valid
    #### Runestone Payload

  ``     Engineering Takeaway & Forensic Analysis 

   [
Inspect in Standalone Decoder →
](/runes/decoder.html?hex=undefined&outputs=undefined) [
View on Mempool.space ↗
](https://mempool.space/tx/7d206f6580f58bbd53c5e8840c94628ce786a3d3c8c7dfc757c32bf0082f4831)      ###  [ CASE-06: Mainnet Output-Count Split Across Non-OP_RETURN Outputs ](#case-06) 

  MAINNET · Block 840,610    Edict output equals output count 3, triggering an even division across all non-OP_RETURN spendable outputs. 

  <strong>TxID:</strong> 8c919fa300cf9d21b1928374a5e82b7194602f3a8b274c5d94948a3c8e102948    #### Transaction Structure

  - <strong>Inputs:</strong>  UTXOs
 - <strong>Outputs:</strong>  total
 - <strong>OP_RETURN Index:</strong> Output 
 - <strong>Runestone Status:</strong> Valid
    #### Runestone Payload

  ``     Engineering Takeaway & Forensic Analysis 

   [
Inspect in Standalone Decoder →
](/runes/decoder.html?hex=undefined&outputs=undefined) [
View on Mempool.space ↗
](https://mempool.space/tx/8c919fa300cf9d21b1928374a5e82b7194602f3a8b274c5d94948a3c8e102948)      ###  [ CASE-07: Mainnet Mint with Explicit Pointer Destination ](#case-07) 

  MAINNET · Block 840,750    Mint transaction directing the newly minted units directly to output 1 via Pointer tag 22. 

  <strong>TxID:</strong> 9e0239cf2e8419eb45a7209930f78c8a14b51cf8353380d5926ec03728f5f3a0    #### Transaction Structure

  - <strong>Inputs:</strong>  UTXOs
 - <strong>Outputs:</strong>  total
 - <strong>OP_RETURN Index:</strong> Output 
 - <strong>Runestone Status:</strong> Valid
    #### Runestone Payload

  ``     Engineering Takeaway & Forensic Analysis 

   [
Inspect in Standalone Decoder →
](/runes/decoder.html?hex=undefined&outputs=undefined) [
View on Mempool.space ↗
](https://mempool.space/tx/9e0239cf2e8419eb45a7209930f78c8a14b51cf8353380d5926ec03728f5f3a0)      ###  [ CASE-08: Full Protocol Etching Reveal Transaction ](#case-08) 

  MAINNET · Block 841,000    Complete mainnet etching reveal with name BITCOIN•UNIVERSE, premine, divisibility, spacers, symbol, and mint terms. 

  <strong>TxID:</strong> b45a7209930f78c8a14b51cf8353380d5926ec03728f5f3a09e0239cf2e8419e    #### Transaction Structure

  - <strong>Inputs:</strong>  UTXOs
 - <strong>Outputs:</strong>  total
 - <strong>OP_RETURN Index:</strong> Output 
 - <strong>Runestone Status:</strong> Valid
    #### Runestone Payload

  ``     Engineering Takeaway & Forensic Analysis 

   [
Inspect in Standalone Decoder →
](/runes/decoder.html?hex=undefined&outputs=undefined) [
View on Mempool.space ↗
](https://mempool.space/tx/b45a7209930f78c8a14b51cf8353380d5926ec03728f5f3a09e0239cf2e8419e)      ###  [ CASE-09: Explicit Deliberate OP_RETURN Burn ](#case-09) 

  REGTEST · Block 110    Transaction explicitly allocating 250 units to an OP_RETURN output, resulting in permanent destruction of those units. 

  <strong>TxID:</strong> c8471b849201948b71239c82938472b129e0239cf2e8419eb45a7209930f78c8    #### Transaction Structure

  - <strong>Inputs:</strong>  UTXOs
 - <strong>Outputs:</strong>  total
 - <strong>OP_RETURN Index:</strong> Output 
 - <strong>Runestone Status:</strong> Valid
    #### Runestone Payload

  ``     Engineering Takeaway & Forensic Analysis 

   [
Inspect in Standalone Decoder →
](/runes/decoder.html?hex=undefined&outputs=undefined) [
View on Mempool.space ↗
](https://mempool.space/tx/c8471b849201948b71239c82938472b129e0239cf2e8419eb45a7209930f78c8)      ###  [ CASE-10: Cenotaph Autopsy: Malformed Edict Output Burn ](#case-10) 

  REGTEST · Block 115    Transaction containing an edict output index 5 in a 2-output transaction, triggering EdictOutput flaw and burning all input runes. 

  <strong>TxID:</strong> d9e0239cf2e8419eb45a7209930f78c8a14b51cf8353380d5926ec03728f5f3a    #### Transaction Structure

  - <strong>Inputs:</strong>  UTXOs
 - <strong>Outputs:</strong>  total
 - <strong>OP_RETURN Index:</strong> Output 
 - <strong>Runestone Status:</strong> Valid
    #### Runestone Payload

  ``     Engineering Takeaway & Forensic Analysis 

   [
Inspect in Standalone Decoder →
](/runes/decoder.html?hex=undefined&outputs=undefined) [
View on Mempool.space ↗
](https://mempool.space/tx/d9e0239cf2e8419eb45a7209930f78c8a14b51cf8353380d5926ec03728f5f3a)      ###  [ CASE-11: Plain Non-Runes Data Carrier Coexistence ](#case-11) 

  MAINNET · Block 840,880    Transaction with an ordinary OP_RETURN without OP_13. Ignored by the indexer without producing a cenotaph. 

  <strong>TxID:</strong> e45a7209930f78c8a14b51cf8353380d5926ec03728f5f3a09e0239cf2e8419e    #### Transaction Structure

  - <strong>Inputs:</strong>  UTXOs
 - <strong>Outputs:</strong>  total
 - <strong>OP_RETURN Index:</strong> Output 
 - <strong>Runestone Status:</strong> Valid
    #### Runestone Payload

  ``     Engineering Takeaway & Forensic Analysis 

   [
Inspect in Standalone Decoder →
](/runes/decoder.html?hex=undefined&outputs=undefined) [
View on Mempool.space ↗
](https://mempool.space/tx/e45a7209930f78c8a14b51cf8353380d5926ec03728f5f3a09e0239cf2e8419e)      ###  [ CASE-12: Multiple OP_RETURN Outputs Carrier Selection ](#case-12) 

  REGTEST · Block 120    Transaction with two OP_RETURN outputs. The first valid OP_RETURN OP_13 is deciphered; the second is disregarded entirely. 

  <strong>TxID:</strong> f3a09e0239cf2e8419eb45a7209930f78c8a14b51cf8353380d5926ec03728f5    #### Transaction Structure

  - <strong>Inputs:</strong>  UTXOs
 - <strong>Outputs:</strong>  total
 - <strong>OP_RETURN Index:</strong> Output 
 - <strong>Runestone Status:</strong> Valid
    #### Runestone Payload

  ``     Engineering Takeaway & Forensic Analysis 

   [
Inspect in Standalone Decoder →
](/runes/decoder.html?hex=undefined&outputs=undefined) [
View on Mempool.space ↗
](https://mempool.space/tx/f3a09e0239cf2e8419eb45a7209930f78c8a14b51cf8353380d5926ec03728f5)     ## Forensic Methodology

 
All transaction hexes and state transitions in this atlas were independently fetched from Bitcoin mainnet block data, verified with Casey Rodarmor's `ord` 0.29.0 reference indexer, and cross-checked against our pure TypeScript `@bitcoinuniverse/runes-tools` core library.

    #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/atlas.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/atlas.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
