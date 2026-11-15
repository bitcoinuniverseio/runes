# Track 3: Transfer Runes Safely

[Runes](/runes/) / Track 3: Transfer Runes Safely  Runes Learning Academy

 # Track 3: Transfer Runes Safely

 Construct edicts, handle delta encoding, avoid change loss, and calculate splits safely.

   [
← Back to All Academy Tracks
](/runes/learn.html)    <strong>Audience:</strong> Users and wallet integrators sending or batching rune balances. · <strong>Duration:</strong> ~20 minutes
  Learning Outcomes <strong>Prerequisites:</strong> Runes in 10 Minutes track.

 <strong>Outcomes:</strong> Construct edicts, handle delta encoding, avoid change loss, and calculate splits safely.

  ## Curriculum Lessons

    ####  1. Edict Quadruple Anatomy 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="transfer" data-lesson="0"> Mark Completed </label>  Block delta, tx delta/index, amount, and output index.

 
Controlling Rules:  [R34](/runes/specification.html#r34)     ####  2. Delta Encoding Mechanics 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="transfer" data-lesson="1"> Mark Completed </label>  How accumulating block and transaction deltas saves payload bytes.

 
Controlling Rules:  [R34](/runes/specification.html#r34)     ####  3. The Output 0 Default Footgun 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="transfer" data-lesson="2"> Mark Completed </label>  Why unallocated runes go to the first non-OP_RETURN output unless a pointer directs them.

 
Controlling Rules:  [R39](/runes/specification.html#r39),   [R42](/runes/specification.html#r42)     ####  4. Sweeps and Splits 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="transfer" data-lesson="3"> Mark Completed </label>  Amount 0 sweeps remaining balance; output equal to output count splits.

 
Controlling Rules:  [R38](/runes/specification.html#r38)     ## Track Knowledge Assessment

 
Answer the questions below to test your understanding of this track's consensus invariants.

   #### 
Question 1: Where do unallocated runes go if no pointer is specified? 

  <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-transfer-0" value="0"> They are permanently burned </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-transfer-0" value="1"> They go to the first non-OP_RETURN spendable output </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-transfer-0" value="2"> They stay on the input outpoint </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-transfer-0" value="3"> They are split among all outputs </label>  <button type="button" class="btn-primary quiz-submit-btn" data-track="transfer" data-q="0" data-ans="1">
Verify Answer
</button>   Protocol Explanation Rule R39 and R42 state that without a pointer, unallocated runes go to the first non-OP_RETURN output.

         [
← Previous: Track 2 ](/runes/learn/inspect.html) [
Next: Track 4 →
](/runes/learn/mint.html)     #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/learn/transfer.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/learn/transfer.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
