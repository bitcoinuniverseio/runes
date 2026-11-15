import{c as e,i as t,l as n,n as r,o as i,s as a,u as o}from"./runestone.CHKeSk9W.js";function s(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}var c=document.getElementById(`wizard-transfer-form`),l=document.getElementById(`wiz-t-result`);c&&l&&c.addEventListener(`submit`,e=>{e.preventDefault();try{let e=document.getElementById(`wiz-t-rune`).value.trim(),n=BigInt(document.getElementById(`wiz-t-balance`).value.trim()),i=BigInt(document.getElementById(`wiz-t-send`).value.trim()),a=parseInt(document.getElementById(`wiz-t-recipient-out`).value,10),o=parseInt(document.getElementById(`wiz-t-change-out`).value,10),s=parseInt(document.getElementById(`wiz-t-total-outs`).value,10),c=t(e);if(!c)throw Error(`Invalid Rune ID. Use format Block:Tx (e.g. 840000:3)`);if(i>n)throw Error(`Send amount exceeds available balance.`);if(a>=s)throw Error(`Recipient output ${a} exceeds total output count (${s}). This would trigger Cenotaph Flaw EdictOutput.`);if(o>=s)throw Error(`Change output ${o} exceeds total output count (${s}). This would trigger Cenotaph Flaw UnrecognizedEvenTag.`);let u=r({pointer:o,edicts:[{id:c,amount:i,output:a}]});l.innerHTML=`
          <div class="callout callout-invariant">
            <div class="callout-title">Safety Check: PASSED</div>
            <p>No cenotaph conditions detected. Both recipient and change outputs are within transaction bounds.</p>
          </div>
          <h4>Planned Balance Distribution</h4>
          <p>Recipient (Output ${a}): <strong>${i}</strong> units</p>
          <p>Change (Output ${o}, Pointer Tag 22): <strong>${n-i}</strong> units</p>
          <h4>Runestone Script Hex</h4>
          <pre><code>${u.scriptHex}</code></pre>
        `}catch(e){l.innerHTML=`<div class="callout callout-burn"><div class="callout-title">Safety Violation</div><p>${s(e.message)}</p></div>`}});var u=document.getElementById(`wizard-mint-form`),d=document.getElementById(`wiz-m-result`);u&&d&&u.addEventListener(`submit`,e=>{e.preventDefault();try{let e=document.getElementById(`wiz-m-rune`).value.trim();parseInt(document.getElementById(`wiz-m-curr-height`).value,10);let n=parseInt(document.getElementById(`wiz-m-pointer`).value,10),i=t(e);if(!i)throw Error(`Invalid Rune ID format.`);let a=r({mint:i,pointer:n});d.innerHTML=`
          <div class="callout callout-invariant">
            <div class="callout-title">Mint Runestone Ready</div>
            <p>Mint instruction encoded for Rune <code>${i.block}:${i.tx}</code> directed to Output ${n}.</p>
          </div>
          <h4>Runestone Script Hex</h4>
          <pre><code>${a.scriptHex}</code></pre>
          <div class="callout callout-warning">
            <div class="callout-title">Reorg & Fee Volatility Warning</div>
            <p>If the rune's mint cap is close to 100%, higher-fee transactions from other miners or reorgs could consume the remaining cap before your transaction confirms. If the cap is reached, your mint instruction is ignored with 0 units minted and Bitcoin transaction fees are non-refundable.</p>
          </div>
        `}catch(e){d.innerHTML=`<div class="callout callout-burn"><div class="callout-title">Mint Evaluation Error</div><p>${s(e.message)}</p></div>`}});var f=document.getElementById(`wizard-etch-form`),p=document.getElementById(`wiz-e-result`);f&&p&&f.addEventListener(`submit`,t=>{t.preventDefault();try{let t=document.getElementById(`wiz-e-name`).value.trim(),s=parseInt(document.getElementById(`wiz-e-height`).value,10),c=BigInt(document.getElementById(`wiz-e-premine`).value.trim()),l=parseInt(document.getElementById(`wiz-e-pointer`).value,10),u=n(t),d=e(s);if(!a(u.name,s))throw Error(`Name "${u.name}" has ${u.name.length} letters, but minimum length at block ${s} is ${d}. Etching this name before it unlocks will be silently disregarded (Rule R26).`);let f=i(u.nameValue),m=o(f),h=r({etching:{rune:u.nameValue,spacers:u.spacers,premine:c},pointer:l});p.innerHTML=`
          <div class="callout callout-invariant">
            <div class="callout-title">Name Unlock Check: PASSED</div>
            <p>Name <strong>${u.name}</strong> (${u.name.length} letters) is eligible for etching at height ${s} (minimum required: ${d} letters).</p>
          </div>

          <h4>Phase 1: Commitment Transaction</h4>
          <p style="font-size: 0.875rem;">Create a Taproot output paying to a script containing the following little-endian data push:</p>
          <pre><code>OP_PUSHBYTES_${f.length} ${m}</code></pre>
          <p style="font-size: 0.8125rem; color: var(--text-muted);">Must confirm with at least 6 blocks before spending in the reveal transaction (Rule R27).</p>

          <h4>Phase 2: Reveal Runestone Script Hex</h4>
          <pre><code>${h.scriptHex}</code></pre>
        `}catch(e){p.innerHTML=`<div class="callout callout-burn"><div class="callout-title">Etch Planning Check</div><p>${s(e.message)}</p></div>`}});