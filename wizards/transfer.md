# Transfer Safety Wizard

[Runes](/runes/) / Transfer Safety Wizard  Guided Safety Wizards

 # Transfer Safety Wizard

 Interactive step-by-step transfer builder with real-time cenotaph prevention, change protection, and output range checks.

  
Interactive transfer planner · Prevents cenotaph flaw EdictOutput and accidental burns.
 ## Transfer Safety Wizard

 
Configure your planned transfer below. The wizard validates that recipient and change output indices stay within bounds, prevents accidental assignment to the OP_RETURN script, and generates a minimal runestone script.

    Step-by-step transfer builder with real-time cenotaph prevention and change protection. <form id="wizard-transfer-form">  <label class="form-label" for="wiz-t-rune">Rune ID</label> <input type="text" id="wiz-t-rune" class="form-input" placeholder="e.g. 840000:3" value="840000:3">   <label class="form-label" for="wiz-t-balance">Input Balance Available (Atomic Units)</label> <input type="number" id="wiz-t-balance" class="form-input" placeholder="e.g. 10000" value="10000">   <label class="form-label" for="wiz-t-send">Amount to Send</label> <input type="number" id="wiz-t-send" class="form-input" placeholder="e.g. 2500" value="2500">   <label class="form-label" for="wiz-t-recipient-out">Recipient Output Index</label> <input type="number" id="wiz-t-recipient-out" class="form-input" value="1" min="0"> Ensure this index is NOT the OP_RETURN runestone output.   <label class="form-label" for="wiz-t-change-out">Change Output Index (Pointer)</label> <input type="number" id="wiz-t-change-out" class="form-input" value="2" min="0">   <label class="form-label" for="wiz-t-total-outs">Total Outputs in Planned Transaction</label> <input type="number" id="wiz-t-total-outs" class="form-input" value="3" min="2">  <button type="submit" class="btn-primary">Evaluate Safety & Generate Runestone</button> </form>        ## Common Transfer Pitfalls

  - <strong>Sending Change to OP_RETURN:</strong> Setting a pointer or edict to the OP_RETURN output burns all runes sent there permanently.
 - <strong>Output Count Overflow:</strong> Specifying an edict output index greater than or equal to total outputs (except the split sentinel) triggers cenotaph flaw `EdictOutput`, burning all input runes.
 - <strong>Forgetting Change:</strong> If no pointer is specified, change falls back to the first non-OP_RETURN output, which may inadvertently mix runes with Bitcoin fees or recipient outputs.
  ## Consensus Guarantees

     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></path></svg>  Conservation of Supply (Rule R40)    <p>
In a valid transaction without mints or etchings, the sum of all output rune balances plus explicit burns exactly equals the sum of all input rune balances.

       #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/wizards/transfer.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/wizards/transfer.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
