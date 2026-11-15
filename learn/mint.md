# Track 4: Understand and Evaluate a Mint

[Runes](/runes/) / Track 4: Understand and Evaluate a Mint  Runes Learning Academy

 # Track 4: Understand and Evaluate a Mint

 Calculate effective mint start and end windows, evaluate caps, and detect silent mint failures.

   [
← Back to All Academy Tracks
](/runes/learn.html)    <strong>Audience:</strong> Users evaluating mint eligibility and developers building mint checkers. · <strong>Duration:</strong> ~15 minutes
  Learning Outcomes <strong>Prerequisites:</strong> Familiarity with block height and transaction indexing.

 <strong>Outcomes:</strong> Calculate effective mint start and end windows, evaluate caps, and detect silent mint failures.

  ## Curriculum Lessons

    ####  1. Tag 20 Mint Pair 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="mint" data-lesson="0"> Mark Completed </label>  Mint tag requires exactly two values: target block and tx index.

 
Controlling Rules:  [R31](/runes/specification.html#r31)     ####  2. Window Intersection Rules 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="mint" data-lesson="1"> Mark Completed </label>  Start is the maximum of absolute and offset bounds; end is the minimum.

 
Controlling Rules:  [R32](/runes/specification.html#r32)     ####  3. Exclusive End Height 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="mint" data-lesson="2"> Mark Completed </label>  Minting at the exact end height is closed and fails.

 
Controlling Rules:  [R32](/runes/specification.html#r32)     ####  4. Silent Failure Semantics 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="mint" data-lesson="3"> Mark Completed </label>  An invalid or closed mint does not error or burn: it produces nothing.

 
Controlling Rules:  [R33](/runes/specification.html#r33)     ## Track Knowledge Assessment

 
Answer the questions below to test your understanding of this track's consensus invariants.

   #### 
Question 1: If a mint has HeightEnd set to block 850,000, can a transaction mint at block 850,000? 

  <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-mint-0" value="0"> Yes, end height is inclusive </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-mint-0" value="1"> No, end height is strictly exclusive </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-mint-0" value="2"> Yes, if the transaction is confirmed before block 850,001 </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-mint-0" value="3"> Only if the cap has not been reached </label>  <button type="button" class="btn-primary quiz-submit-btn" data-track="mint" data-q="0" data-ans="1">
Verify Answer
</button>   Protocol Explanation Rule R32 specifies that the end height is exclusive: minting at block height equal to end fails.

         [
← Previous: Track 3 ](/runes/learn/transfer.html) [
Next: Track 5 →
](/runes/learn/etch.html)     #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/learn/mint.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/learn/mint.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
