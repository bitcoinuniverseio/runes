---
name: runes-expert
description: Expert skill for deciphering, simulating, validating, and developing Runes protocol transactions on Bitcoin (ord 0.29.0).
---

# Runes Protocol Expert Skill

Use this skill when developing, debugging, auditing, or simulating Runes transactions on Bitcoin.

## Core Directives

1. **Protocol Reference Pin:** Always align with Casey Rodarmor's `ord` 0.29.0 (ordinals crate 0.0.17, commit `7e37a3bd3391044b39f5f11f20dfdb8b3764cd0e`).
2. **State Model:** Runes are held by Bitcoin transaction outputs (UTXOs). The `OP_RETURN OP_13` runestone specifies how spent input rune balances are reallocated across outputs.
3. **Cenotaph Awareness:**
   - Any malformation (invalid script, varint error, unrecognized even tag, supply overflow, edict output > tx output count) causes a **Cenotaph**.
   - Under Rule R45, all input runes entering a cenotaph transaction are burned completely.
   - Newly etched runes become unmintable.

## Key Protocol Operations

### 1. Carrier Recognition
- Output script must begin with `0x6a 0x5d` (`OP_RETURN OP_13`).
- Contiguous data pushes concatenate into a single payload buffer.
- Only the first matching output is processed; subsequent runestones in the same transaction are ignored.

### 2. LEB128 Varint Processing
- Unsigned integers encoded 7 bits per byte.
- Max 19 bytes. At byte 19, bits past bit 128 must be zero or an overflow error is produced.
- Minimal LEB128 is recommended when encoding, but non-minimal encodings are accepted when decoding.

### 3. Tag Dictionary
- Tag 0: Body (precedes edicts).
- Tag 2: Flags (Bit 0: Etching, Bit 1: Terms, Bit 2: Turbo).
- Tag 4: Rune Name (modified base-26 integer).
- Tag 1: Divisibility (0–38).
- Tag 3: Spacers (27-bit mask).
- Tag 5: Currency Symbol (Unicode codepoint).
- Tag 6: Premine units.
- Tag 8: Mint Cap.
- Tag 10: Mint Amount per claim.
- Tag 12 / 14: Height Start / End.
- Tag 16 / 18: Offset Start / End.
- Tag 20: Mint instruction (Target block, then tx).
- Tag 22: Pointer (Output index for unallocated remainder).
- **Parity Rule:** Odd tags may be ignored silently. Unrecognized even tags trigger a Cenotaph.

### 4. Edicts
- Edicts are 4-tuples: `[block_delta, tx_delta, amount, output]`.
- Rune ID is accumulated via delta from `0:0`.
- Amount 0 means allocate entire remaining balance of that rune.
- If output == total transaction outputs, balance splits across all non-OP_RETURN outputs.

## Available Tooling
- CLI: `npx @bitcoinuniverse/runes-tools <command>`
- Library: `@bitcoinuniverse/runes-tools`
- Local MCP Server: `npx @bitcoinuniverse/runes-docs-mcp`
