# Platform &amp; Conformance Status

[Runes](/runes/) / Platform & Conformance Status  Build & Verification Status

 # Platform & Conformance Status

 Real-time build status, protocol conformance test metrics, upstream pins, and cryptographic integrity verification.

  
Platform status: OPERATIONAL · 100% Conformance Verified · Upstream ord 0.29.0 synchronized.
 ## 1. Conformance & Parity Status

    Test HarnessScopePassingStatus    <strong>Authoritative Vectors</strong> V1–V8, C1–C14, N1–N2 (24 vectors) 24 / 24 100% PASS ✓   <strong>Chain-Level Fixtures</strong> F1–F12 (Maturity, reorg, unlock, splits) 12 / 12 100% PASS ✓   <strong>Differential Invariants</strong> Tag enums, flag bitfields, flaw taxonomy, LEB128 boundaries 6 / 6 100% PASS ✓   <strong>Mainnet Transaction Atlas</strong> 12 verified mainnet transaction case studies 12 / 12 100% PASS ✓     ## 2. Toolchain & Environment

    ComponentPinned VersionSpecification / Standard   <strong>Node.js</strong>`24.19.0 LTS`Execution environment <strong>npm</strong>`11.17.0`Package manager & workspaces <strong>Astro</strong>`7.2.10`Static site generator <strong>TypeScript</strong>`5.9.3`Compiler & strict typing <strong>Vitest</strong>`4.1.11`Unit & conformance runner <strong>Upstream ord</strong>`0.29.0` (commit `7e37a3b`)Consensus authority <strong>Upstream crate</strong>`ordinals 0.0.17`Rust reference crate    ## 3. Release Hashes & Verification

 
Verify the integrity of distributed documentation bundles against our published SHA-256 checksums:

 `# Verify SHA-256 of downloaded documentation pack
sha256sum runes-docs-v3.0.0.zip`</pre>    #### Was this page technically accurate and helpful?

 <p style="margin: 0; font-size: 0.8125rem; color: var(--text-muted);">Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/status.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/status.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
