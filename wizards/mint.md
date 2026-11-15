# Mint Readiness Wizard

[Runes](/runes/) / Mint Readiness Wizard  Guided Safety Wizards

 # Mint Readiness Wizard

 Evaluate open mint terms, height boundaries, offset windows, cap exhaustion, and fee volatility before broadcasting a mint transaction.

  
Mint term verification · Reorg risk analysis · Non-refundable fee protection.
 ## Mint Readiness Wizard

 
Before spending Bitcoin transaction fees on a mint transaction, verify that the target rune's mint cap has not been exhausted and that the current block height falls inside the open window.

     Evaluate mint windows, cap limits, and fee volatility before broadcasting. <form id="wizard-mint-form">  <label class="form-label" for="wiz-m-rune">Rune ID to Mint</label> <input type="text" id="wiz-m-rune" class="form-input" value="840000:1">   <label class="form-label" for="wiz-m-curr-height">Current Block Height</label> <input type="number" id="wiz-m-curr-height" class="form-input" value="850000">   <label class="form-label" for="wiz-m-pointer">Destination Output Index</label> <input type="number" id="wiz-m-pointer" class="form-input" value="1">  <button type="submit" class="btn-primary">Check Mint Readiness & Generate Script</button> </form>       ## Evaluating Mint Windows

 
Mint terms can specify both absolute block heights and relative block offsets:

  - <strong>Absolute Height (Tags 12 & 14):</strong> The mint is valid only while `heightStart <= blockHeight < heightEnd`.
 - <strong>Relative Offset (Tags 16 & 18):</strong> The mint is valid only while `etchingBlock + offsetStart <= blockHeight < etchingBlock + offsetEnd`.
  ## Reorg & Cap Exhaustion Risk

    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>   Mining Fees Are Non-Refundable    <p>
If multiple transactions compete for the final units of a mint cap, miners prioritize transactions with higher fee rates. If your mint confirms after the cap is exhausted, ord indexes 0 units minted and your transaction fee cannot be recovered.

       #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/wizards/mint.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/wizards/mint.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
