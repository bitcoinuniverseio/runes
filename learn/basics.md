# Track 1: Runes in 10 Minutes

[Runes](/runes/) / Track 1: Runes in 10 Minutes  Runes Learning Academy

 # Track 1: Runes in 10 Minutes

 Explain how runestones live in Bitcoin outputs, how balances move, and why cenotaphs exist.

   [
← Back to All Academy Tracks
](/runes/learn.html)    <strong>Audience:</strong> Anyone new to Runes who wants an accurate, hype-free mental model. · <strong>Duration:</strong> ~10 minutes
  Learning Outcomes <strong>Prerequisites:</strong> Basic familiarity with Bitcoin transactions and UTXOs.

 <strong>Outcomes:</strong> Explain how runestones live in Bitcoin outputs, how balances move, and why cenotaphs exist.

  ## Curriculum Lessons

    ####  1. UTXOs, Not Account Balances 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="basics" data-lesson="0"> Mark Completed </label>  Rune units are held by Bitcoin outpoints. Spending an outpoint spends its runes.

 
Controlling Rules:  [R44](/runes/specification.html#r44)     ####  2. The Carrier Script 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="basics" data-lesson="1"> Mark Completed </label>  OP_RETURN OP_13 identifies the runestone. All data pushes concatenate into the payload.

 
Controlling Rules:  [R1](/runes/specification.html#r1),   [R4](/runes/specification.html#r4)     ####  3. The Four Lifecycle Events 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="basics" data-lesson="2"> Mark Completed </label>  Etch, mint, transfer, and burn: the four operations in the protocol.

 
Controlling Rules:  [R20](/runes/specification.html#r20),   [R32](/runes/specification.html#r32),   [R38](/runes/specification.html#r38),   [R41](/runes/specification.html#r41)     ####  4. Cenotaphs and Upgrade Safety 

 <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;"> <input type="checkbox" class="lesson-progress-check" data-track="basics" data-lesson="3"> Mark Completed </label>  Malformed messages burn balances rather than misallocating them.

 
Controlling Rules:  [R45](/runes/specification.html#r45),   [R46](/runes/specification.html#r46)     ## Track Knowledge Assessment

 
Answer the questions below to test your understanding of this track's consensus invariants.

   #### 
Question 1: Where are rune balances stored on Bitcoin? 

  <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-basics-0" value="0"> In a global smart contract account </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-basics-0" value="1"> On transaction outpoints (UTXOs), alongside satoshis </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-basics-0" value="2"> Inside the OP_RETURN script itself </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-basics-0" value="3"> In an offchain database operated by miners </label>  <button type="button" class="btn-primary quiz-submit-btn" data-track="basics" data-q="0" data-ans="1">
Verify Answer
</button>   Protocol Explanation Rule R44 states that balances are per rune, per outpoint. The OP_RETURN runestone carries instructions, not a vault.

     #### 
Question 2: What happens if a runestone contains a malformed field producing a cenotaph? 

  <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-basics-1" value="0"> The Bitcoin transaction is rejected by miners </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-basics-1" value="1"> All input runes in the transaction are burned </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-basics-1" value="2"> The invalid field is skipped and remaining edicts execute </label><label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-sans); font-size: 0.875rem; background: var(--bg); padding: 0.5rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;"> <input type="radio" name="quiz-basics-1" value="3"> Runes automatically return to the sender </label>  <button type="button" class="btn-primary quiz-submit-btn" data-track="basics" data-q="1" data-ans="1">
Verify Answer
</button>   Protocol Explanation Rule R45 states that in a cenotaph transaction, every input rune balance and every minted or premined amount is burned.

          [
Next: Track 2 →
](/runes/learn/inspect.html)     #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/learn/basics.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/learn/basics.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
