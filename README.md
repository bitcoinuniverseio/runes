# Runes

Protocol documentation for **Runes**, the UTXO-native fungible token protocol on Bitcoin.

**Live site: <https://bitcoinuniverseio.github.io/runes/>**

A runestone, carried in an OP_RETURN output beginning `OP_RETURN OP_13`, etches a new rune, mints an existing one, or transfers balances between transaction outputs. Rune balances are held by transaction outputs, not by accounts, so runes move the way bitcoin moves.

Runes originated outside this organization. It was designed by Casey Rodarmor as part of the Ordinals project and activated on Bitcoin mainnet at block **840,000** (the fourth halving, April 2024). This repository documents the protocol as the ecosystem implements it, grounded in the [ord](https://github.com/ordinals/ord) reference implementation, version 0.29.0 with the `ordinals` crate 0.0.17.

## Pages

| Page | What is in it |
| --- | --- |
| [Overview](https://bitcoinuniverseio.github.io/runes/) | What Runes is in plain language, transaction anatomy, rune IDs, entry points |
| [Specification](https://bitcoinuniverseio.github.io/runes/specification.html) | 47 numbered normative rules: carrier, varints, tag table, flags, etching, minting, edicts, pointer, state transitions, cenotaphs |
| [Guide](https://bitcoinuniverseio.github.io/runes/guide.html) | Worked byte-level walkthroughs of transfer, sweep, split, mint, and a full etching, plus the support matrix |
| [Reference](https://bitcoinuniverseio.github.io/runes/reference.html) | Terminology, indexer pipeline, terms evaluation, confirmation and reorg behavior, sizes, limits, security, checklist |
| [Test vectors](https://bitcoinuniverseio.github.io/runes/vectors.html) | 24 verified cases with expected outcomes, covering all ten cenotaph flaws |
| [Decoder](https://bitcoinuniverseio.github.io/runes/decoder.html) | Paste an OP_RETURN script hex and read it field by field, in your browser |
| [Changelog](https://bitcoinuniverseio.github.io/runes/changelog.html) | Document version history and protocol milestones |

## Key facts

- **Carrier**: an output script beginning `OP_RETURN` (`0x6a`) then `OP_13` (`0x5d`). The first matching output is the transaction's runestone; there is at most one.
- **Encoding**: data pushes concatenate into a payload of LEB128 varints holding unsigned 128-bit integers, parsed as tag and value pairs until tag `0` (Body), after which edicts appear in groups of four.
- **Rune ID**: `BLOCK:TX`, the etching block height and the transaction index within it. Edicts encode IDs as deltas from a running value starting at `0:0`.
- **Etching** permanently fixes name, divisibility (at most 38), spacers, symbol, premine, and optional mint terms. Claiming a name requires a taproot tapscript commitment confirmed at least 6 blocks earlier.
- **Cenotaph**: a malformed runestone. All input runes are burned, an etched rune becomes permanently unmintable, and a mint counts against the cap while its output is burned. Ten named flaws exist. Cenotaphs are the protocol's forward-compatibility mechanism.
- **Default destination**: unallocated runes go to the pointer output if one is given, otherwise the first non-OP_RETURN output, otherwise they are burned.

## Support in Bitcoin Universe products

Verified against the marketplace protocol registry and its deployed policy for protocol id `runes`:

- **Supported**: viewing runes, discovery, collection views, activity, and transaction views. Universe operates its own Runes indexer producing a normalized read-only feed, whose coverage is reported as partial because it carries no exhaustive rune mempool stream.
- **Not currently supported**: listing, buying, offers, settlement, and building or broadcasting etch, mint, or transfer transactions from inside Bitcoin Universe products. The deployed policy for runes is read-only.

Use a wallet that supports Runes to build and broadcast rune transactions.

## User safety

A malformed runestone becomes a cenotaph and burns **every** rune in the transaction's inputs, not just the amount being sent. Decode the OP_RETURN before signing, confirm the first non-OP_RETURN output is yours, keep rune-bearing outputs above the dust threshold, and never blind-sign a transaction.

## About this repository

Static, hand-authored HTML, CSS, and vanilla JavaScript. No build step, no framework, no external requests, no trackers. All ordinary content works with JavaScript disabled; JavaScript only adds search, the theme toggle, and the decoder.

Deployed by GitHub Pages from `main` at the repository root.

- [`docs.manifest.json`](docs.manifest.json) describes this repository to the documentation portal at <https://docs.bitcoinuniverse.io>.
- [`llms.txt`](llms.txt) describes the site for language models.
- [`CONTRIBUTING.md`](CONTRIBUTING.md), [`SECURITY.md`](SECURITY.md), and [`SUPPORT.md`](SUPPORT.md) cover corrections, vulnerability reports, and questions.

## Upstream

- ord, the reference implementation: <https://github.com/ordinals/ord> (CC0-1.0)
- Upstream protocol documentation: <https://docs.ordinals.com/runes.html>
- Upstream specification: <https://docs.ordinals.com/runes/specification.html>

Documentation licensed under the [MIT License](LICENSE). Presented by [Bitcoin Universe](https://github.com/bitcoinuniverseio).
