# Track 2: Inspect a Runestone Safely

[Runes](/runes/) / Track 2: Inspect a Runestone Safely  Runes Learning Academy

 # Track 2: Inspect a Runestone Safely

 Dissect carrier scripts byte by byte, extract varints, decode tags, and identify flaws.

   [
← Back to All Academy Tracks
](/runes/learn.html)    <strong>Audience:</strong> Users, operators, and analysts verifying raw scripts before signing or indexing. · <strong>Duration:</strong> ~15 minutes
  Learning Outcomes <strong>Prerequisites:</strong> Understanding of hex encoding and Bitcoin script opcodes.

 <strong>Outcomes:</strong> Dissect carrier scripts byte by byte, extract varints, decode tags, and identify flaws.

  ## Curriculum Lessons

    ####  1. Finding the Runestone in a Transaction 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="inspect" data-lesson="0"> Mark Completed </label>  Search outputs in order for OP_RETURN OP_13; the first match controls.

 
Controlling Rules:  [R1](/runes/specification.html#r1),   [R2](/runes/specification.html#r2),   [R3](/runes/specification.html#r3)     ####  2. Payload Push Opcodes 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="inspect" data-lesson="1"> Mark Completed </label>  Distinguish pushdata opcodes from non-pushdata opcodes that trigger flaw Opcode.

 
Controlling Rules:  [R4](/runes/specification.html#r4),   [R5](/runes/specification.html#r5),   [R6](/runes/specification.html#r6)     ####  3. LEB128 Varint Decoding 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="inspect" data-lesson="2"> Mark Completed </label>  Decode up to 19 bytes per integer, observing the 19th-byte overflow mask.

 
Controlling Rules:  [R8](/runes/specification.html#r8),   [R9](/runes/specification.html#r9),   [R10](/runes/specification.html#r10)     ####  4. Tag Queue Consumption 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="inspect" data-lesson="3"> Mark Completed </label>  Observe how even tags require full consumption while odd tags degrade silently.

 
Controlling Rules:  [R14](/runes/specification.html#r14),   [R16](/runes/specification.html#r16),   [R17](/runes/specification.html#r17)     ## Track Knowledge Assessment

 
Answer the questions below to test your understanding of this track's consensus invariants.

   #### 
Question 1: What opcode sequence starts an authentic Runes carrier script? 

  <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-inspect-0" value="0"> 0x6a 0x13 </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-inspect-0" value="1"> 0x6a 0x5d (OP_RETURN OP_13) </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-inspect-0" value="2"> 0x00 0x14 </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-inspect-0" value="3"> 0x6a 0x00 </label>  <button type="button" class="btn-primary quiz-submit-btn" data-track="inspect" data-q="0" data-ans="1">
Verify Answer
</button>   Protocol Explanation Rule R1 specifies OP_RETURN (0x6a) followed immediately by OP_13 (0x5d).

         [
← Previous: Track 1 ](/runes/learn/basics.html) [
Next: Track 3 →
](/runes/learn/transfer.html)     #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/learn/inspect.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/learn/inspect.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
