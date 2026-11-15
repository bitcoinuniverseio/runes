import{a as e,d as t,t as n}from"./runestone.CHKeSk9W.js";function r(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function i(n,i){if(n.inputError){i.innerHTML=`<div class="callout callout-warning"><div class="callout-title">Input Error</div><p>${r(n.inputError)}</p></div>`;return}if(n.notRunestone){i.innerHTML=`<div class="callout callout-note"><div class="callout-title">Not A Runestone</div><p>${r(n.notRunestone)}</p></div>`;return}let a=``;if(n.cenotaph){let e=t[n.flaw]||``;a+=`
        <div class="callout callout-burn">
          <div class="callout-title">Cenotaph Detected (Flaw: ${r(n.flaw)})</div>
          <p><strong>Reason:</strong> ${r(e)}</p>
          <p style="margin-top: 0.5rem; font-size: 0.875rem;">
            <strong>Protocol Consequences (Rule R45):</strong> All input rune balances in this transaction are burned.
            Any etched rune is created but permanently unmintable with default properties.
            Any mint increments the target's mint count but its minted units are burned.
          </p>
        </div>
      `}else a+=`
        <div class="callout callout-invariant">
          <div class="callout-title">Valid Runestone</div>
          <p>This script decodes to a valid, well-formed Runestone under ord 0.29.0 consensus rules.</p>
        </div>
      `;if(n.payload){let e=Array.from(n.payload).map(e=>e.toString(16).padStart(2,`0`)).join(` `);a+=`
        <h3 style="margin-top: 1.5rem;">Carrier Payload</h3>
        <p style="font-size: 0.875rem; color: var(--text-muted);">${n.payload.length} bytes concatenated across ${n.pushes} data push(es):</p>
        <pre><code>${r(e||`(empty payload)`)}</code></pre>
      `}if(n.integers&&(a+=`
        <h3>Decoded Varint Integers</h3>
        <pre><code>[${n.integers.map(String).join(`, `)}]</code></pre>
      `),n.etching){let t=n.etching;a+=`
        <h3>Etching (Tag 2 Flags: Etching)</h3>
        <div class="table-scroll">
          <table>
            <thead><tr><th>Property</th><th>Tag</th><th>Value</th><th>Interpretation</th></tr></thead>
            <tbody>
              <tr>
                <td>Name</td>
                <td>4</td>
                <td><code>${t.rune===null?`None`:t.rune.toString()}</code></td>
                <td><strong>${t.rune===null?`Reserved name assigned by indexer`:r(e(t.rune,t.spacers??0n))}</strong></td>
              </tr>
              <tr>
                <td>Divisibility</td>
                <td>1</td>
                <td><code>${t.divisibility??0n}</code></td>
                <td>${t.divisibility??0n} decimal place(s)</td>
              </tr>
              <tr>
                <td>Spacers Bitmap</td>
                <td>3</td>
                <td><code>${t.spacers??0n}</code></td>
                <td>Bitmap: ${t.spacers??0n}</td>
              </tr>
              <tr>
                <td>Currency Symbol</td>
                <td>5</td>
                <td><code>${t.symbol?`U+`+t.symbol.toString(16).toUpperCase().padStart(4,`0`):`None`}</code></td>
                <td>${t.symbol?String.fromCodePoint(Number(t.symbol)):`¤ (Generic)`}</td>
              </tr>
              <tr>
                <td>Premine</td>
                <td>6</td>
                <td><code>${t.premine??0n}</code></td>
                <td>${t.premine??0n} atomic units to transaction</td>
              </tr>
              <tr>
                <td>Turbo Flag</td>
                <td>-</td>
                <td><code>${t.turbo?`True`:`False`}</code></td>
                <td>${t.turbo?`Opted in to future protocol changes`:`Standard`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,t.terms&&(a+=`
          <h4>Mint Terms</h4>
          <div class="table-scroll">
            <table>
              <thead><tr><th>Term Field</th><th>Tag</th><th>Value</th></tr></thead>
              <tbody>
                <tr><td>Amount per Mint</td><td>10</td><td><code>${t.terms.amount??`None`}</code></td></tr>
                <tr><td>Mint Cap</td><td>8</td><td><code>${t.terms.cap??`None`}</code></td></tr>
                <tr><td>Height Start / End</td><td>12 / 14</td><td><code>${t.terms.heightStart??`Open`} -> ${t.terms.heightEnd??`Open`}</code></td></tr>
                <tr><td>Offset Start / End</td><td>16 / 18</td><td><code>${t.terms.offsetStart??`None`} -> ${t.terms.offsetEnd??`None`}</code></td></tr>
              </tbody>
            </table>
          </div>
        `)}n.mint&&(a+=`
        <h3>Mint Instruction (Tag 20)</h3>
        <p>Mints rune <code>${n.mint.block}:${n.mint.tx}</code>. If terms hold at this block height, minted units join the unallocated pool.</p>
      `),n.pointer!==null&&n.pointer!==void 0&&!n.cenotaph&&(a+=`
        <h3>Pointer Destination (Tag 22)</h3>
        <p>Unallocated runes remaining after edicts route to output <code>${n.pointer}</code>.</p>
      `),n.edicts&&n.edicts.length>0&&(a+=`
        <h3>Edicts (${n.edicts.length})</h3>
        <div class="table-scroll">
          <table>
            <thead><tr><th>#</th><th>Rune ID</th><th>Amount</th><th>Output</th><th>Meaning</th></tr></thead>
            <tbody>
      `,n.edicts.forEach((e,t)=>{let n=e.id.block===0n&&e.id.tx===0?`0:0 (Current Etching)`:`${e.id.block}:${e.id.tx}`,i=e.amount===0n?`0 (Entire remaining balance)`:`${e.amount} units`;a+=`
          <tr>
            <td>${t+1}</td>
            <td><code>${r(n)}</code></td>
            <td>${r(i)}</td>
            <td><code>Output ${e.output}</code></td>
            <td>Transfers ${r(i)} to output ${e.output}</td>
          </tr>
        `}),a+=`</tbody></table></div>`),n.leftoverEven&&n.leftoverEven.length>0&&(a+=`
        <div class="callout callout-burn">
          <div class="callout-title">Unconsumed Even Tags: ${n.leftoverEven.join(`, `)}</div>
          <p>Even tags must be recognized and consumed. Leftover even tag data triggers flaw UnrecognizedEvenTag (Rule R17).</p>
        </div>
      `),n.caveats&&n.caveats.length>0&&(a+=`
        <div class="callout callout-warning">
          <div class="callout-title">Analysis Caveats</div>
          <ul>
            ${n.caveats.map(e=>`<li>${r(e)}</li>`).join(``)}
          </ul>
        </div>
      `),i.innerHTML=a}function a(){let e=document.getElementById(`decoder-form`),t=document.getElementById(`script-hex`),r=document.getElementById(`tx-outputs`),a=document.getElementById(`decode-output`),o=document.getElementById(`clear-btn`);if(!e||!t||!a)return;function s(){let e=t.value.trim();if(!e){a.innerHTML=`<p style="color: var(--text-muted); font-size: 0.95rem;">Paste an OP_RETURN script hex or click any sample vector above to inspect.</p>`;return}let o=r?r.value.trim():``,s=o?parseInt(o,10):null;i(n(e,isNaN(s)?null:s),a)}e.addEventListener(`submit`,e=>{e.preventDefault(),s()}),o&&o.addEventListener(`click`,()=>{t.value=``,r&&(r.value=``),s()}),document.querySelectorAll(`.sample-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let n=e.getAttribute(`data-hex`),i=e.getAttribute(`data-outputs`);n&&(t.value=n),r&&i&&(r.value=i),s()})});let c=new URLSearchParams(window.location.search),l=c.get(`hex`),u=c.get(`outputs`);l&&(t.value=l,u&&r&&(r.value=u),s())}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,a):a();