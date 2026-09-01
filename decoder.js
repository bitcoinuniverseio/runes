/* Runestone decoder. Pure client side: nothing you paste is logged or transmitted.
   Decoding rules mirror the ord reference implementation, ord 0.29.0
   (ordinals crate 0.0.17): crates/ordinals/src/runestone.rs, varint.rs,
   runestone/message.rs, runestone/tag.rs, runestone/flag.rs, rune_id.rs,
   edict.rs, etching.rs. Network: Bitcoin mainnet semantics. */
(function (global) {
  "use strict";

  var U32 = (1n << 32n) - 1n;
  var U64 = (1n << 64n) - 1n;
  var U128 = (1n << 128n) - 1n;
  var MAX_DIVISIBILITY = 38n;
  var MAX_SPACERS = 0b00000111_11111111_11111111_11111111n;

  var TAGS = {
    0n: "Body", 2n: "Flags", 4n: "Rune", 6n: "Premine", 8n: "Cap", 10n: "Amount",
    12n: "HeightStart", 14n: "HeightEnd", 16n: "OffsetStart", 18n: "OffsetEnd",
    20n: "Mint", 22n: "Pointer", 126n: "Cenotaph (reserved)",
    1n: "Divisibility", 3n: "Spacers", 5n: "Symbol", 127n: "Nop"
  };

  var FLAWS = {
    EdictOutput: "edict output greater than transaction output count",
    EdictRuneId: "invalid rune ID in edict",
    InvalidScript: "invalid script in OP_RETURN",
    Opcode: "non-pushdata opcode in OP_RETURN",
    SupplyOverflow: "supply overflows u128",
    TrailingIntegers: "trailing integers in body",
    TruncatedField: "field with missing value",
    UnrecognizedEvenTag: "unrecognized even tag",
    UnrecognizedFlag: "unrecognized flag"
  };
  FLAWS.Varint = "invalid varint";

  function parseHex(text) {
    var clean = text.replace(/0x/gi, "").replace(/[\s,]+/g, "");
    if (clean.length === 0) return { error: "No input. Paste an output script as hex, starting 6a 5d." };
    if (!/^[0-9a-fA-F]*$/.test(clean)) return { error: "Input contains non-hex characters." };
    if (clean.length % 2 !== 0) return { error: "Odd number of hex digits." };
    var bytes = new Uint8Array(clean.length / 2);
    for (var i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
    }
    return { bytes: bytes };
  }

  /* Extract the concatenated payload from a runestone output script.
     Mirrors Runestone::payload. Returns:
     { notRunestone: reason }  when the script does not begin OP_RETURN OP_13,
     { flaw: ... }             when it does but is malformed (cenotaph),
     { payload: Uint8Array, pushes: n } on success. */
  function extractPayload(bytes) {
    if (bytes.length < 1 || bytes[0] !== 0x6a) {
      return { notRunestone: "Script does not begin with OP_RETURN (0x6a). This output carries no runestone; the ord indexer ignores it and looks at the transaction's other outputs." };
    }
    if (bytes.length < 2 || bytes[1] !== 0x5d) {
      return { notRunestone: "OP_RETURN is not followed by OP_13 (0x5d), the Runes protocol identifier. This is a plain OP_RETURN output, not a runestone. The ord indexer ignores it." };
    }
    var payload = [];
    var i = 2;
    var pushes = 0;
    while (i < bytes.length) {
      var op = bytes[i];
      var len, lenBytes;
      if (op <= 75) { len = op; lenBytes = 0; }
      else if (op === 76) { lenBytes = 1; }
      else if (op === 77) { lenBytes = 2; }
      else if (op === 78) { lenBytes = 4; }
      else {
        /* Any non-pushdata opcode after the magic number, including
           OP_PUSHNUM opcodes, makes the whole transaction a cenotaph. */
        return { flaw: "Opcode", at: i, op: op };
      }
      i += 1;
      if (lenBytes > 0) {
        if (i + lenBytes > bytes.length) return { flaw: "InvalidScript", at: i };
        len = 0;
        for (var b = 0; b < lenBytes; b++) len |= bytes[i + b] << (8 * b);
        len = len >>> 0;
        i += lenBytes;
      }
      if (i + len > bytes.length) return { flaw: "InvalidScript", at: i };
      for (var j = 0; j < len; j++) payload.push(bytes[i + j]);
      i += len;
      pushes++;
    }
    return { payload: new Uint8Array(payload), pushes: pushes };
  }

  /* LEB128 varint decoding, mirrors varint::decode.
     At most 19 bytes; the 19th byte may only contribute 2 low bits. */
  function decodeVarint(buffer, start) {
    var n = 0n;
    for (var i = 0; start + i < buffer.length; i++) {
      if (i > 18) return { error: "Overlong" };
      var byte = buffer[start + i];
      var value = BigInt(byte & 0x7f);
      if (i === 18 && (value & 0b0111_1100n) !== 0n) return { error: "Overflow" };
      n |= value << BigInt(7 * i);
      if ((byte & 0x80) === 0) return { value: n, length: i + 1 };
    }
    return { error: "Unterminated" };
  }

  function decodeIntegers(payload) {
    var integers = [];
    var i = 0;
    while (i < payload.length) {
      var r = decodeVarint(payload, i);
      if (r.error) return { error: r.error };
      integers.push(r.value);
      i += r.length;
    }
    return { integers: integers };
  }

  /* RuneId delta accumulation, mirrors RuneId::next. */
  function nextId(id, blockDelta, txDelta) {
    var block = id.block + blockDelta;
    if (block > U64) return null;
    var tx;
    if (blockDelta === 0n) {
      tx = id.tx + txDelta;
    } else {
      tx = txDelta;
    }
    if (tx > U32) return null;
    if (block === 0n && tx > 0n) return null;
    return { block: block, tx: tx };
  }

  /* Message parsing, mirrors Message::from_integers.
     numOutputs: number | null. When null, output-count-dependent checks
     cannot run and are reported as caveats instead. */
  function parseMessage(integers, numOutputs) {
    var edicts = [];
    var fields = new Map(); /* tag (string of BigInt) -> array of BigInt */
    var flaw = null;
    var caveats = [];

    outer:
    for (var i = 0; i < integers.length; i += 2) {
      var tag = integers[i];
      if (tag === 0n) {
        var id = { block: 0n, tx: 0n };
        var rest = integers.slice(i + 1);
        for (var c = 0; c < rest.length; c += 4) {
          var chunk = rest.slice(c, c + 4);
          if (chunk.length !== 4) { flaw = flaw || "TrailingIntegers"; break; }
          var next = nextId(id, chunk[0], chunk[1]);
          if (!next) { flaw = flaw || "EdictRuneId"; break; }
          if (chunk[3] > U32) { flaw = flaw || "EdictOutput"; break; }
          if (numOutputs !== null) {
            /* output == numOutputs is legal and means: divide between all
               non-OP_RETURN outputs. Greater is a cenotaph. */
            if (chunk[3] > BigInt(numOutputs)) { flaw = flaw || "EdictOutput"; break; }
          } else if (chunk[3] > 0n) {
            caveats.push("Edict output index " + chunk[3] + " could not be range-checked because the transaction output count was not supplied. In ord, an edict output greater than the output count makes the transaction a cenotaph.");
          }
          id = next;
          edicts.push({ id: next, amount: chunk[2], output: chunk[3] });
        }
        break outer;
      }
      if (i + 1 >= integers.length) { flaw = flaw || "TruncatedField"; break; }
      var key = tag.toString();
      if (!fields.has(key)) fields.set(key, []);
      fields.get(key).push(integers[i + 1]);
    }
    return { flaw: flaw, edicts: edicts, fields: fields, caveats: caveats };
  }

  /* Mirrors Tag::take: consume the first n values of a tag if the
     interpreting function accepts them; otherwise leave them in place. */
  function take(fields, tag, n, interpret) {
    var key = tag.toString();
    var values = fields.get(key);
    if (!values || values.length < n) return null;
    var slice = values.slice(0, n);
    var out = interpret(slice);
    if (out === null) return null;
    values.splice(0, n);
    if (values.length === 0) fields.delete(key);
    return out;
  }

  function isUnicodeScalar(v) {
    if (v > 0x10ffffn) return false;
    if (v >= 0xd800n && v <= 0xdfffn) return false;
    return true;
  }

  /* Full decipher, mirrors Runestone::decipher after payload extraction. */
  function decipherIntegers(integers, numOutputs) {
    var msg = parseMessage(integers, numOutputs);
    var flaw = msg.flaw;
    var fields = msg.fields;
    var caveats = msg.caveats;

    var flags = take(fields, 2n, 1, function (v) { return v[0]; });
    if (flags === null) flags = 0n;

    var etching = null;
    var hasEtching = (flags & 1n) !== 0n;
    var hasTerms = (flags & 2n) !== 0n;
    var hasTurbo = (flags & 4n) !== 0n;
    if (hasEtching) flags &= ~1n;

    if (hasEtching) {
      etching = {
        divisibility: take(fields, 1n, 1, function (v) {
          return v[0] <= MAX_DIVISIBILITY ? v[0] : null;
        }),
        premine: take(fields, 6n, 1, function (v) { return v[0]; }),
        rune: take(fields, 4n, 1, function (v) { return v[0]; }),
        spacers: take(fields, 3n, 1, function (v) {
          return v[0] <= MAX_SPACERS ? v[0] : null;
        }),
        symbol: take(fields, 5n, 1, function (v) {
          return isUnicodeScalar(v[0]) ? v[0] : null;
        }),
        terms: null,
        turbo: false
      };
      if (hasTerms) {
        flags &= ~2n;
        etching.terms = {
          cap: take(fields, 8n, 1, function (v) { return v[0]; }),
          heightStart: take(fields, 12n, 1, function (v) { return v[0] <= U64 ? v[0] : null; }),
          heightEnd: take(fields, 14n, 1, function (v) { return v[0] <= U64 ? v[0] : null; }),
          amount: take(fields, 10n, 1, function (v) { return v[0]; }),
          offsetStart: take(fields, 16n, 1, function (v) { return v[0] <= U64 ? v[0] : null; }),
          offsetEnd: take(fields, 18n, 1, function (v) { return v[0] <= U64 ? v[0] : null; })
        };
      }
      if (hasTurbo) {
        flags &= ~4n;
        etching.turbo = true;
      }
    }

    var mint = take(fields, 20n, 2, function (v) {
      if (v[0] > U64 || v[1] > U32) return null;
      if (v[0] === 0n && v[1] > 0n) return null;
      return { block: v[0], tx: v[1] };
    });

    var pointer = take(fields, 22n, 1, function (v) {
      if (v[0] > U32) return null;
      if (numOutputs !== null) {
        return v[0] < BigInt(numOutputs) ? v[0] : null;
      }
      return v[0];
    });
    if (pointer !== null && numOutputs === null) {
      caveats.push("Pointer " + pointer + " could not be range-checked because the transaction output count was not supplied. In ord, a pointer that is not less than the output count is left unconsumed and makes the transaction a cenotaph.");
    }

    /* Supply overflow: premine + cap * amount must fit in u128. */
    if (etching) {
      var premine = etching.premine === null ? 0n : etching.premine;
      var cap = etching.terms && etching.terms.cap !== null ? etching.terms.cap : 0n;
      var amount = etching.terms && etching.terms.amount !== null ? etching.terms.amount : 0n;
      if (cap * amount > U128 || premine + cap * amount > U128) {
        flaw = flaw || "SupplyOverflow";
      }
    }

    if (flags !== 0n) flaw = flaw || "UnrecognizedFlag";

    var leftoverEven = [];
    fields.forEach(function (_v, key) {
      if (BigInt(key) % 2n === 0n) leftoverEven.push(key);
    });
    if (leftoverEven.length > 0) flaw = flaw || "UnrecognizedEvenTag";

    return {
      flaw: flaw,
      etching: etching,
      mint: mint,
      pointer: pointer,
      edicts: msg.edicts,
      fields: fields,
      leftoverEven: leftoverEven,
      caveats: caveats,
      integers: integers
    };
  }

  function decode(hexText, numOutputs) {
    var parsed = parseHex(hexText);
    if (parsed.error) return { inputError: parsed.error };
    var extracted = extractPayload(parsed.bytes);
    if (extracted.notRunestone) return { notRunestone: extracted.notRunestone };
    if (extracted.flaw) return { flaw: extracted.flaw, cenotaph: true, stage: "script" };
    var ints = decodeIntegers(extracted.payload);
    if (ints.error) return { flaw: "Varint", varintError: ints.error, cenotaph: true, stage: "varint", payload: extracted.payload };
    var result = decipherIntegers(ints.integers, numOutputs);
    result.payload = extracted.payload;
    result.pushes = extracted.pushes;
    result.cenotaph = result.flaw !== null;
    return result;
  }

  /* Display helpers */

  function runeName(value) {
    /* Modified base-26: mirrors Display for Rune. */
    var n = value + 1n;
    var name = "";
    while (n > 0n) {
      name = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Number((n - 1n) % 26n)] + name;
      n = (n - 1n) / 26n;
    }
    return name;
  }

  function spacedName(value, spacers) {
    var name = runeName(value);
    var out = "";
    for (var i = 0; i < name.length; i++) {
      out += name[i];
      if (i < name.length - 1 && (spacers & (1n << BigInt(i))) !== 0n) out += "•";
    }
    return out;
  }

  global.RunestoneDecoder = {
    decode: decode,
    decodeVarint: decodeVarint,
    runeName: runeName,
    spacedName: spacedName,
    FLAWS: FLAWS,
    TAGS: TAGS
  };

  /* Page wiring (only when the decoder form exists) */
  if (typeof document === "undefined") return;
  var form = document.getElementById("decoder-form");
  if (!form) return;

  var hexInput = document.getElementById("script-hex");
  var outputsInput = document.getElementById("tx-outputs");
  var out = document.getElementById("decode-output");

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function fmtId(id) { return id.block + ":" + id.tx; }

  function cenotaphConsequences() {
    return "<p><strong>Consequences of a cenotaph.</strong> All runes in the transaction's inputs are burned. " +
      "If the transaction etches a rune, the rune is created but permanently unmintable, with no recorded divisibility, symbol, spacers, or terms. " +
      "If the transaction mints, the mint counts toward the rune's cap, but the minted units are burned. " +
      "Cenotaphs are the protocol's upgrade mechanism: older clients see the runes as burned rather than misreading a future message format.</p>";
  }

  function render(result) {
    var html = "";
    if (result.inputError) {
      out.innerHTML = "<div class='verdict'><h3>Not decodable</h3><p>" + esc(result.inputError) + "</p></div>";
      return;
    }
    if (result.notRunestone) {
      out.innerHTML = "<div class='verdict'><h3>Not a runestone</h3><p>" + esc(result.notRunestone) + "</p></div>";
      return;
    }
    if (result.cenotaph) {
      html += "<div class='verdict cenotaph'><h3>Cenotaph</h3><p>This is a malformed runestone. Flaw: <span class='flaw-name'>" +
        esc(result.flaw) + "</span>, " + esc(FLAWS[result.flaw] || "") + ".</p>" +
        cenotaphConsequences() + "</div>";
    } else {
      html += "<div class='verdict'><h3>Valid runestone</h3><p>The script parses as a well-formed runestone under ord 0.29.0 decoding rules.</p></div>";
    }

    if (result.payload) {
      html += "<h3>Payload</h3><p>" + result.payload.length + " byte" + (result.payload.length === 1 ? "" : "s") +
        " concatenated from data pushes:</p><pre><code>" +
        esc(Array.from(result.payload).map(function (b) { return b.toString(16).padStart(2, "0"); }).join(" ") || "(empty)") +
        "</code></pre>";
    }
    if (result.integers) {
      html += "<h3>Decoded integers</h3><pre><code>[" +
        esc(result.integers.map(String).join(", ")) + "]</code></pre>";
    }

    if (result.stage === "script" || result.stage === "varint") {
      out.innerHTML = html;
      return;
    }

    if (result.etching) {
      var e = result.etching;
      html += "<h3>Etching</h3><dl>";
      if (e.rune !== null) {
        var spacers = e.spacers === null ? 0n : e.spacers;
        html += "<dt>Name (tag 4)</dt><dd><code>" + esc(spacedName(e.rune, spacers)) + "</code> (value " + e.rune + ")</dd>";
      } else {
        html += "<dt>Name</dt><dd>None given. The indexer allocates a reserved name derived from the block height and transaction index.</dd>";
      }
      if (e.divisibility !== null) html += "<dt>Divisibility (tag 1)</dt><dd>" + e.divisibility + " decimal place" + (e.divisibility === 1n ? "" : "s") + "</dd>";
      if (e.spacers !== null) html += "<dt>Spacers (tag 3)</dt><dd>bitmap " + e.spacers + "</dd>";
      if (e.symbol !== null) html += "<dt>Symbol (tag 5)</dt><dd><code>" + esc(String.fromCodePoint(Number(e.symbol))) + "</code> (U+" + e.symbol.toString(16).toUpperCase().padStart(4, "0") + ")</dd>";
      if (e.premine !== null) html += "<dt>Premine (tag 6)</dt><dd>" + e.premine + " atomic units allocated to this transaction</dd>";
      html += "<dt>Turbo flag</dt><dd>" + (e.turbo ? "set: opted into future protocol changes" : "not set") + "</dd>";
      if (e.terms) {
        html += "<dt>Mint terms</dt><dd>";
        var t = [];
        if (e.terms.amount !== null) t.push("amount per mint " + e.terms.amount);
        if (e.terms.cap !== null) t.push("cap " + e.terms.cap + " mints");
        if (e.terms.heightStart !== null) t.push("absolute start height " + e.terms.heightStart);
        if (e.terms.heightEnd !== null) t.push("absolute end height " + e.terms.heightEnd);
        if (e.terms.offsetStart !== null) t.push("start offset " + e.terms.offsetStart + " blocks after etching");
        if (e.terms.offsetEnd !== null) t.push("end offset " + e.terms.offsetEnd + " blocks after etching");
        html += t.length ? esc(t.join("; ")) : "open mint flag set with no explicit terms";
        html += "</dd>";
      }
      html += "</dl>";
    }

    if (result.mint) {
      html += "<h3>Mint (tag 20)</h3><p>Mints rune <code>" + fmtId(result.mint) +
        "</code>. If that rune's mint is open at this block height, one mint of the fixed amount is created and added to the transaction's unallocated runes.</p>";
    }

    if (result.pointer !== null && result.pointer !== undefined && !result.cenotaph) {
      html += "<h3>Pointer (tag 22)</h3><p>Unallocated runes left after all edicts go to output <code>" +
        result.pointer + "</code> instead of the first non-OP_RETURN output.</p>";
    }

    if (result.edicts && result.edicts.length) {
      html += "<h3>Edicts (tag 0 body)</h3><div class='table-scroll'><table><thead><tr><th scope='col'>#</th><th scope='col'>Rune ID</th><th scope='col'>Amount</th><th scope='col'>Output</th><th scope='col'>Meaning</th></tr></thead><tbody>";
      result.edicts.forEach(function (ed, i) {
        var meaning;
        var idText = fmtId(ed.id);
        if (ed.id.block === 0n && ed.id.tx === 0n) idText = "0:0 (the rune etched in this transaction)";
        if (ed.amount === 0n) {
          meaning = "all remaining balance of the rune";
        } else {
          meaning = ed.amount + " atomic units";
        }
        meaning += " → output " + ed.output;
        html += "<tr><td>" + (i + 1) + "</td><td><code>" + esc(idText) + "</code></td><td>" + ed.amount + "</td><td>" + ed.output + "</td><td>" + esc(meaning) + "</td></tr>";
      });
      html += "</tbody></table></div>";
      html += "<p class='muted'>An edict whose output equals the transaction's output count divides the amount over all non-OP_RETURN outputs. Amount 0 means the whole remaining balance.</p>";
    }

    if (!result.cenotaph && (!result.edicts || !result.edicts.length) && !result.etching && !result.mint && (result.pointer === null || result.pointer === undefined)) {
      html += "<p>The runestone is empty. Input runes simply transfer to the first non-OP_RETURN output.</p>";
    }

    if (result.leftoverEven && result.leftoverEven.length) {
      html += "<h3>Unconsumed even tags</h3><p class='flaw-name'>" + esc(result.leftoverEven.join(", ")) +
        "</p><p>Even tags must be understood and fully consumed. Leftover even-tag data is what makes this message a cenotaph.</p>";
    }

    if (result.caveats && result.caveats.length) {
      html += "<h3>Caveats</h3><ul>";
      result.caveats.forEach(function (c) { html += "<li>" + esc(c) + "</li>"; });
      html += "</ul>";
    }

    out.innerHTML = html;
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var n = outputsInput.value.trim();
    var numOutputs = null;
    if (n !== "") {
      var v = parseInt(n, 10);
      if (!isNaN(v) && v >= 0) numOutputs = v;
    }
    render(decode(hexInput.value, numOutputs));
  });

  document.querySelectorAll(".decoder-examples button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      hexInput.value = btn.getAttribute("data-hex");
      outputsInput.value = btn.getAttribute("data-outputs") || "";
      form.dispatchEvent(new Event("submit", { cancelable: true }));
    });
  });
})(typeof window !== "undefined" ? window : globalThis);
