# Runes: The UTXO-Native Fungible Token Protocol

[Runes](/runes/) / Runes: The UTXO-Native Fungible Token Protocol  Bitcoin Protocol Documentation

 # Runes: The UTXO-Native Fungible Token Protocol

 Authoritative, interactive, developer-ready documentation and tooling platform for Runes on Bitcoin.

  
Pinned to Casey Rodarmor's [ord](https://github.com/ordinals/ord) 0.29.0 · Bitcoin Mainnet Activation: Block 840,000 (2024-04-20).
 ## What Are Runes?

 
Runes is a simple, UTXO-native fungible token protocol designed specifically for Bitcoin.
    Unlike account-based token standards or protocols that store arbitrary data blobs in transaction witnesses, Runes operates directly on Bitcoin's Unspent Transaction Output (UTXO) set.

 
A Runes transaction communicates state transitions through a single `OP_RETURN` output followed by `OP_13` (push byte `0x5d`).
    This payload, called a <strong>Runestone</strong>, contains unsigned LEB128 varints specifying etchings, mints, and transfers (edicts).

     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></path></svg>  Prunable and Safe for Node Operators    <p>
Because Runestones are carried in standard `OP_RETURN` outputs, Bitcoin nodes can prune them immediately from the UTXO set. Runes does not leave unspendable "dust" UTXOs on the blockchain to store token balances. All token balances reside in legitimate, spendable Bitcoin UTXOs.

    ## The UTXO Mental Model

 
Every Runes transaction operates as a deterministic, single-step state machine:

  - <strong>Gather:</strong> All rune balances across all spent inputs drain into a transaction-wide unallocated balance pool.
 - <strong>Mint or Etch:</strong> Any active mint instruction or etching premine adds new units to the unallocated pool.
 - <strong>Edict Allocation:</strong> The Runestone executes an ordered list of <em>edicts</em>, assigning specified amounts of runes from the pool to specified output indices.
 - <strong>Remainder Routing:</strong> Any runes remaining in the pool after edicts execute route automatically to the output specified by the <strong>Pointer</strong> (Tag 22), or fall back to the first non-OP_RETURN output.
 - <strong>Cenotaph Safety:</strong> If the Runestone contains malformed varints, unrecognized even tags, or out-of-bounds outputs, the entire transaction is classified as a <strong>Cenotaph</strong>, and all input runes are permanently burned.
  ## Documentation & Tools Platform

 
Runes Documentation Platform 3.0 provides a comprehensive suite of developer tools, interactive simulators, and authoritative reference material:

   ### [Normative Specification](/runes/specification.html)

 
Complete, numbered rules R1 through R47, tag dictionaries, flag bitfields, and cenotaph flaw tables pinned to ord 0.29.0.

 [Read Specification →](/runes/specification.html)   ### [Runestone Studio](/runes/studio.html)

 
8 interactive diagnostic modes: script decoder, raw tx parser, visual composer, allocation simulator, byte scrubber, and autopsy.

 [Open Studio →](/runes/studio.html)   ### [Guided Safety Wizards](/runes/wizards/transfer.html)

 
Interactive step-by-step planners for Transfers, Mint Readiness, and Etching commitments with live cenotaph risk detection.

 [Launch Wizards →](/runes/wizards/transfer.html)   ### [Learning Academy](/runes/learn.html)

 
7 structured tracks from basics to indexer architecture, featuring quizzes, exercises, and local progress tracking.

 [Start Learning →](/runes/learn.html)   ### [Transaction Atlas](/runes/atlas.html)

 
12 verified mainnet transactions dissecting genesis mints, multi-rune transfers, cenotaph burns, and reorg safety.

 [Explore Atlas →](/runes/atlas.html)   ### [Developer Hub & SDK](/runes/developers.html)

 
Typed `@bitcoinuniverse/runes-tools` library, 10 tested quickstarts, and local CLI for automated CI pipelines.

 [View SDK & Quickstarts →](/runes/developers.html)   ## Core Consensus Invariants

    ConceptRule RefBehavior & Guarantees   <strong>Carrier</strong>R1–R3Output begins with `OP_RETURN OP_13`. First matching output wins; extras are ignored. <strong>Encoding</strong>R8–R11Unsigned LEB128 varints up to 128-bit integers. Minimal encoding recommended. <strong>Tag Parity</strong>R16–R17Odd tags may be ignored; unrecognized even tags trigger immediate cenotaph. <strong>Commitment</strong>R27–R28Named etchings require 6-block Taproot commitment. Early reveal defaults to reserved sequence name. <strong>Cenotaphs</strong>R45Any malformation burns all input runes and prevents minting of newly etched runes.    ## Ecosystem & Protocol Support

 
The Runes protocol is supported natively across the Bitcoin developer ecosystem:

  - <strong>Reference Implementation:</strong> Casey Rodarmor's [ord](https://github.com/ordinals/ord) (version 0.29.0+).
 - <strong>Ecosystem Indexers:</strong> ordinals, Unisat Indexer, Oyl Indexer.
 - <strong>Explorers:</strong> ordinals.com, mempool.space, runescan.io.
 - <strong>Client Tooling:</strong> `@bitcoinuniverse/runes-tools` (TypeScript), `ordinals` crate (Rust).
     #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/index.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/index.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
