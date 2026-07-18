# Runes documentation

Bitcoin Universe documentation for Runes on Bitcoin.

## What this covers

Runes represent fungible balances in UTXOs. A Runestone appears in an OP_RETURN output, uses an OP_13 marker, and carries a varint-encoded message. Edicts allocate rune amounts to transaction outputs.

## State model

A transaction can etch a rune, mint an existing rune, and allocate runes. If no allocation applies, unallocated input balances default to the first non-OP_RETURN output, unless a pointer changes that destination.

## Documentation site

- Overview: [index.html](index.html)
- Field reference: [reference.html](reference.html)
- Build and verification playbook: [guide.html](guide.html)

## Core rules

- A Runestone starts with OP_RETURN followed by OP_13 and data pushes.
- The payload is a sequence of unsigned LEB128 integers.
- Edicts are sorted by Rune ID and encoded as deltas.
- Unknown even tags create a cenotaph. Unknown odd tags are ignored.
- A cenotaph burns all input runes and can make an etched rune unmintable.
- Missing allocation defaults to the first non-OP_RETURN output when one exists.

## Source material

- [Runes overview](https://docs.ordinals.com/runes.html)
- [Runes specification](https://docs.ordinals.com/runes/specification.html)

## Scope

Cenotaph behavior is a safety boundary, not a soft warning. Treat any malformed Runestone as a burn-risk transaction.
