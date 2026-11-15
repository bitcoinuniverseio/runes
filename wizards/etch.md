# Etching Planner

[Runes](/runes/) / Etching Planner  Guided Safety Wizards

 # Etching Planner

 Plan a new rune etching, calculate modified base-26 name encodings, generate Taproot commitments, and enforce the 6-block maturity rule.

  
Two-phase commitment planner · Base-26 encoding · Unlock length verification.
 ## Etching Planner

 
Design and plan your new rune etching below. The wizard validates name length against the Bitcoin block height schedule, constructs the Taproot commitment script data push, and generates the reveal runestone.

      Plan commitment transaction, unlock schedule, symbol, premine, and terms. <form id="wizard-etch-form">  <label class="form-label" for="wiz-e-name">Proposed Rune Name</label> <input type="text" id="wiz-e-name" class="form-input" value="MY•NEW•RUNE">   <label class="form-label" for="wiz-e-height">Estimated Reveal Block Height</label> <input type="number" id="wiz-e-height" class="form-input" value="860000">   <label class="form-label" for="wiz-e-premine">Premine Allocation (Atomic Units)</label> <input type="text" id="wiz-e-premine" class="form-input" value="1000000">   <label class="form-label" for="wiz-e-pointer">Premine Destination Output</label> <input type="number" id="wiz-e-pointer" class="form-input" value="1">  <button type="submit" class="btn-primary">Plan Etching & Verify Length</button> </form>      ## Name Unlock Schedule

 
To prevent front-running of short, recognizable names at protocol launch, rune names unlock gradually:

  - <strong>Block 840,000:</strong> Names with 13 or more characters unlock.
 - <strong>Every 17,500 Blocks:</strong> Minimum length decreases by 1 character (e.g. 12 characters at 857,500, 11 at 875,000).
 - <strong>Block 1,050,000 (Halving 2028):</strong> All character lengths down to 1 character are fully unlocked.
  ## 6-Block Commitment Timeline

    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>   Commitment Maturity (Rule R27)    <p>
The commitment transaction output must be confirmed with at least 6 confirmations before being spent by the reveal transaction. Revealing prematurely causes the requested name to be silently disregarded and replaced with an automatic reserved sequence name.

       #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/wizards/etch.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/wizards/etch.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
