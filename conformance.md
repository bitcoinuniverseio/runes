# Conformance Center &amp; Protocol Testing

[Runes](/runes/) / Conformance Center & Protocol Testing  Verification & Automated Testing

 # Conformance Center & Protocol Testing

 Automated conformance testing center for the Runes protocol, featuring browser test execution, CLI test runners, and differential test verification.

  
24 protocol vectors · 12 chain fixtures · Pinned to ord 0.29.0 commit 7e37a3b.
 
The Conformance Center provides test harnesses and verification tools to validate indexers, libraries, and node implementations against the authoritative protocol specification.

 ## Browser Conformance Runner

     #### Run Protocol Test Suite

 Executes all 24 authoritative vectors in the client-side JavaScript engine.

  <button type="button" id="run-browser-tests-btn" class="btn-primary">
Execute All Tests
</button>         Vector IDNameCategoryExpectedActual StatusResult       ## Automated Testing with CLI

 
You can run the same test suite directly in terminal environments, headless servers, or Docker containers using the `@bitcoinuniverse/runes-tools` CLI:

 `# Run all vectors with formatted terminal output
npx runes run-vectors

# Output JSON summary for automated parsers
npx runes run-vectors --json

# Generate JUnit XML report for CI pipelines
npx runes run-vectors --junit > junit-results.xml`</pre> ## Differential Testing Strategy

 <p>
To ensure absolute parity with consensus, our test harness executes differential assertions:

  - <strong>Bitfield & Tag Alignment:</strong> Every tag number and flag bitmask is verified against Rust `ordinals::Tag` and `ordinals::Flag` enums.
 - <strong>Flaw Parity:</strong> All 10 cenotaph flaws map 1:1 to Rust `ordinals::Flaw` enum variants.
 - <strong>LEB128 Boundary Testing:</strong> Property tests verify varint edge cases at 7-bit, 14-bit, 64-bit, and 128-bit integer boundaries.
  ## CI/CD Integration

 
Embed conformance checks in your GitHub Actions workflows:

 `- name: Run Runes Conformance Suite
  run: npm run test:conformance`</pre>    #### Was this page technically accurate and helpful?

 <p style="margin: 0; font-size: 0.8125rem; color: var(--text-muted);">Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/conformance.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/conformance.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
