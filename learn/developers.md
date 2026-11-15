# Track 6: Build a Wallet or Application Integration

[Runes](/runes/) / Track 6: Build a Wallet or Application Integration  Runes Learning Academy

 # Track 6: Build a Wallet or Application Integration

 Integrate @bitcoinuniverse/runes-tools, manage cardinal inputs, build safe review screens, and prevent balance destruction.

   [
← Back to All Academy Tracks
](/runes/learn.html)    <strong>Audience:</strong> Wallet architects, frontend engineers, and Bitcoin backend developers. · <strong>Duration:</strong> ~30 minutes
  Learning Outcomes <strong>Prerequisites:</strong> TypeScript/JavaScript and Bitcoin transaction serialization experience.

 <strong>Outcomes:</strong> Integrate @bitcoinuniverse/runes-tools, manage cardinal inputs, build safe review screens, and prevent balance destruction.

  ## Curriculum Lessons

    ####  1. Rune Outpoint Inventory 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="developers" data-lesson="0"> Mark Completed </label>  Track UTXO rune balances separately to avoid spending rune UTXOs as fee inputs.

 
Controlling Rules:  [R44](/runes/specification.html#r44)     ####  2. Runestone Assembly Pipeline 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="developers" data-lesson="1"> Mark Completed </label>  Encode edicts, sort by RuneId, calculate minimal varints, and assemble scriptPubKey.

 
Controlling Rules:  [R4](/runes/specification.html#r4),   [R34](/runes/specification.html#r34)     ####  3. Pre-Signing Validation Gate 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="developers" data-lesson="2"> Mark Completed </label>  Decode built runestones locally before requesting signatures.

 
Controlling Rules:  [R17](/runes/specification.html#r17),   [R45](/runes/specification.html#r45)     ####  4. Avoiding Blind Signing 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="developers" data-lesson="3"> Mark Completed </label>  Surface exact rune amounts, change destination, and burn warnings to users.

 
Controlling Rules:  [R38](/runes/specification.html#r38),   [R41](/runes/specification.html#r41)     ## Track Knowledge Assessment

 
Answer the questions below to test your understanding of this track's consensus invariants.

   #### 
Question 1: Why must a wallet maintain a separate rune outpoint inventory? 

  <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-developers-0" value="0"> To display token logos </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-developers-0" value="1"> To prevent rune-bearing UTXOs from being consumed as ordinary fee inputs </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-developers-0" value="2"> To broadcast transactions faster </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-developers-0" value="3"> To bypass the dust limit </label>  <button type="button" class="btn-primary quiz-submit-btn" data-track="developers" data-q="0" data-ans="1">
Verify Answer
</button>   Protocol Explanation Rune-unaware coin selection destroys value: spending a rune-bearing UTXO as fee releases its runes into the unallocated pool where they follow output 0.

         [
← Previous: Track 5 ](/runes/learn/etch.html) [
Next: Track 7 →
](/runes/learn/indexers.html)     #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/learn/developers.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/learn/developers.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
