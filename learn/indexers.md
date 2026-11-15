# Track 7: Build or Operate a Runes Indexer

[Runes](/runes/) / Track 7: Build or Operate a Runes Indexer  Runes Learning Academy

 # Track 7: Build or Operate a Runes Indexer

 Implement state transitions, handle reorgs via savepoint rewinding, compute allocations, and maintain zero-drift consensus.

   [
← Back to All Academy Tracks
](/runes/learn.html)    <strong>Audience:</strong> Backend engineers and infrastructure operators indexing Bitcoin blocks. · <strong>Duration:</strong> ~35 minutes
  Learning Outcomes <strong>Prerequisites:</strong> Bitcoin Core RPC knowledge and relational or key-value storage design.

 <strong>Outcomes:</strong> Implement state transitions, handle reorgs via savepoint rewinding, compute allocations, and maintain zero-drift consensus.

  ## Curriculum Lessons

    ####  1. Block Processing Sequence 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="indexers" data-lesson="0"> Mark Completed </label>  Process transactions strictly in block order starting from block 840,000.

 
Controlling Rules:  [R43](/runes/specification.html#r43),   [R44](/runes/specification.html#r44)     ####  2. The Six State Transition Steps 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="indexers" data-lesson="1"> Mark Completed </label>  Gather unallocated, apply mint, apply etching, process edicts, assign remainder, record burns.

 
Controlling Rules:  [R40](/runes/specification.html#r40),   [R41](/runes/specification.html#r41),   [R45](/runes/specification.html#r45)     ####  3. Reorg Handling via Savepoint Rollback 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="indexers" data-lesson="2"> Mark Completed </label>  Rewind state on block hash mismatch rather than patching in-place.

 
Controlling Rules:  [R43](/runes/specification.html#r43)     ####  4. Verification Against Test Vectors 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="indexers" data-lesson="3"> Mark Completed </label>  Automate conformance runs against vectors V1-V8 and C1-C14.

 
Controlling Rules:  [R47](/runes/specification.html#r47)     ## Track Knowledge Assessment

 
Answer the questions below to test your understanding of this track's consensus invariants.

   #### 
Question 1: How does a conformant Runes indexer handle a blockchain reorganization? 

  <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-indexers-0" value="0"> By deleting historical blocks and starting from genesis </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-indexers-0" value="1"> By rewinding to a confirmed savepoint before the fork and re-indexing forward </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-indexers-0" value="2"> By ignoring the reorg if it is under 6 blocks </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-indexers-0" value="3"> By mutating balances with delta patches </label>  <button type="button" class="btn-primary quiz-submit-btn" data-track="indexers" data-q="0" data-ans="1">
Verify Answer
</button>   Protocol Explanation Rune state is derived from the chain. Indexers rewind to a database savepoint before the split and re-index forward using block hashes.

         [
← Previous: Track 6 ](/runes/learn/developers.html) [
Complete Academy Overview →
](/runes/learn.html)     #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/learn/indexers.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/learn/indexers.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
