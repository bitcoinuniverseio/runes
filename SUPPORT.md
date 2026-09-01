# Support

## What this repository is

Documentation for the Runes protocol: <https://bitcoinuniverseio.github.io/runes/>

It is reference material. It is not a wallet, not an indexer, and not a support channel for transactions you have already broadcast.

## Where to go

| You want to | Go to |
| --- | --- |
| Understand what a runestone does | [Overview](https://bitcoinuniverseio.github.io/runes/) and [Guide](https://bitcoinuniverseio.github.io/runes/guide.html) |
| Implement a parser or indexer | [Specification](https://bitcoinuniverseio.github.io/runes/specification.html), [Reference](https://bitcoinuniverseio.github.io/runes/reference.html), [Test vectors](https://bitcoinuniverseio.github.io/runes/vectors.html) |
| Understand one specific transaction | [Decoder](https://bitcoinuniverseio.github.io/runes/decoder.html) |
| Know what Bitcoin Universe supports | [Support matrix](https://bitcoinuniverseio.github.io/runes/guide.html#support) |
| Report a documentation error | [Open an issue](https://github.com/bitcoinuniverseio/runes/issues) |
| Report an incorrect protocol rule or unsafe guidance | [Private report](https://github.com/bitcoinuniverseio/runes/security/advisories/new), see [SECURITY.md](SECURITY.md) |
| Fix something yourself | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Ask about other Bitcoin Universe products | <https://docs.bitcoinuniverse.io> |
| Report a bug in ord itself | <https://github.com/ordinals/ord/issues> |

## Common questions

**Why did my transaction burn my runes?** Almost certainly a cenotaph: a malformed runestone burns every rune in the transaction's inputs. Paste the OP_RETURN script into the [decoder](https://bitcoinuniverseio.github.io/runes/decoder.html) to see which flaw applies. This is not reversible, and nobody can recover the balance.

**Why did my mint produce nothing?** A mint whose terms are not satisfied, because the cap is reached or the height window has closed, confirms normally and creates nothing. See [terms evaluation](https://bitcoinuniverseio.github.io/runes/reference.html#terms-eval).

**Why did my etching not appear?** The name may already be taken (spacers do not make a name distinct), still locked at that height, or the taproot commitment may be missing or younger than 6 confirmations. See [ways an etching quietly fails](https://bitcoinuniverseio.github.io/runes/guide.html#etch-fails).

**Where did my change go?** Unallocated runes follow the pointer if one is given, otherwise the first non-OP_RETURN output. See [specification section 9](https://bitcoinuniverseio.github.io/runes/specification.html#pointer).

**Can I list or sell runes in Bitcoin Universe?** Not currently. Runes are read-only there. See the [support matrix](https://bitcoinuniverseio.github.io/runes/guide.html#support).

## What we cannot help with

We cannot recover burned runes, reverse a confirmed transaction, resolve a name dispute, or give financial advice. Never share a private key, seed phrase, or wallet file with anyone, including us.
