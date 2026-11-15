# Track 5: Plan an Etching

[Runes](/runes/) / Track 5: Plan an Etching  Runes Learning Academy

 # Track 5: Plan an Etching

 Encode rune names, calculate commitment data pushes, check unlock schedules, and prevent supply overflow.

   [
← Back to All Academy Tracks
](/runes/learn.html)    <strong>Audience:</strong> Creators, asset architects, and tooling builders creating new runes. · <strong>Duration:</strong> ~25 minutes
  Learning Outcomes <strong>Prerequisites:</strong> Understanding of Bitcoin Taproot commitments and confirmation windows.

 <strong>Outcomes:</strong> Encode rune names, calculate commitment data pushes, check unlock schedules, and prevent supply overflow.

  ## Curriculum Lessons

    ####  1. Name Encoding in Modified Base 26 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="etch" data-lesson="0"> Mark Completed </label>  A through Z to numeric integer conversion.

 
Controlling Rules:  [R21](/runes/specification.html#r21),   [R22](/runes/specification.html#r22)     ####  2. The Commit-Reveal Sequence 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="etch" data-lesson="1"> Mark Completed </label>  Taproot tapscript data push confirmed at least 6 blocks earlier.

 
Controlling Rules:  [R28](/runes/specification.html#r28)     ####  3. Unlock Schedule Milestones 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="etch" data-lesson="2"> Mark Completed </label>  13-letter minimum at block 840,000 stepping down to single letters at block 1,050,000.

 
Controlling Rules:  [R30](/runes/specification.html#r30)     ####  4. Divisibility, Symbol, and Spacers 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="etch" data-lesson="3"> Mark Completed </label>  Formatting rules and maximum allowed ranges.

 
Controlling Rules:  [R23](/runes/specification.html#r23),   [R24](/runes/specification.html#r24),   [R25](/runes/specification.html#r25)     ####  5. Supply Overflow Math 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="etch" data-lesson="4"> Mark Completed </label>  Enforcing premine + cap * amount <= u128::MAX.

 
Controlling Rules:  [R27](/runes/specification.html#r27)     ## Track Knowledge Assessment

 
Answer the questions below to test your understanding of this track's consensus invariants.

   #### 
Question 1: How many confirmations must an etching commitment have before the reveal transaction? 

  <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-etch-0" value="0"> 1 confirmation </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-etch-0" value="1"> At least 6 confirmations </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-etch-0" value="2"> 12 confirmations </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-etch-0" value="3"> No wait is required </label>  <button type="button" class="btn-primary quiz-submit-btn" data-track="etch" data-q="0" data-ans="1">
Verify Answer
</button>   Protocol Explanation Rule R28 mandates COMMIT_CONFIRMATIONS = 6: the output spent must be confirmed at least 6 blocks before the etching block.

         [
← Previous: Track 4 ](/runes/learn/mint.html) [
Next: Track 6 →
](/runes/learn/developers.html)     #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/learn/etch.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/learn/etch.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
