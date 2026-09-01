# Contributing

Corrections are welcome, especially to the protocol rules. This documentation is only useful if it is exactly right.

## Ground rules

**Everything must be grounded in the reference implementation.** The source of truth for protocol behavior is [ord](https://github.com/ordinals/ord), currently version 0.29.0 with the `ordinals` crate 0.0.17. If you change a normative rule, a test vector, or the decoder, cite the file and function that establishes it. The relevant sources are:

| Topic | Source |
| --- | --- |
| Deciphering, payload extraction, field order | `crates/ordinals/src/runestone.rs` |
| Varint encoding and limits | `crates/ordinals/src/varint.rs` |
| Tag numbers and consumption | `crates/ordinals/src/runestone/tag.rs` |
| Flag bits | `crates/ordinals/src/runestone/flag.rs` |
| Message and edict parsing | `crates/ordinals/src/runestone/message.rs` |
| Flaw names and messages | `crates/ordinals/src/flaw.rs` |
| Name encoding, reserved names, unlock schedule | `crates/ordinals/src/rune.rs` |
| Rune ID delta arithmetic | `crates/ordinals/src/rune_id.rs` |
| Etching limits and supply | `crates/ordinals/src/etching.rs` |
| Allocation, burns, commitment check | `src/index/updater/rune_updater.rs` |
| Terms evaluation, start and end | `src/index/entry.rs` |

**Never claim a capability you have not verified in code.** Statements about what Bitcoin Universe products support come from the marketplace protocol registry and its deployed policy, not from roadmaps. If you cannot verify it, omit it or state that it is not currently supported.

**No em dashes.** Use commas, colons, periods, or parentheses.

## House style

- Plain, direct writing. No filler, no superlatives, no urgency, no placeholder sections.
- Prefer a diagram or a table over a wall of prose.
- Byte-level examples must be real. Encode them, decode them, and check the result before publishing.
- Normative rules are numbered and stable. Add new rules at the end of their section rather than renumbering, unless the changelog records a major version.

## Working on the site

There is no build step. Open the HTML files directly, or serve the directory with any static file server.

Constraints that must hold for every change:

- No external requests of any kind: no CDNs, no web fonts, no analytics, no images loaded from other origins.
- All ordinary content works with JavaScript disabled. JavaScript may only enhance: search, the theme toggle, and the decoder.
- Both themes meet WCAG 2.2 AA contrast. Colors come from the custom properties in `styles.css`; do not hardcode a color in a page.
- Responsive down to 320 pixels wide with no horizontal page overflow. Wide tables and code go inside a container that scrolls on its own.
- Semantic landmarks, a skip link, visible focus, correct heading order, and a text alternative on every diagram.
- Every diagram is inline SVG with a `<title>` and `<desc>`, using custom properties for stroke and fill so it stays legible in both themes.

## If you change the decoder

`decoder.js` mirrors ord's decoding order deliberately, including the subtle parts: a range check that fails must leave its value unconsumed, so that odd tags degrade silently and even tags become `UnrecognizedEvenTag`. Before opening a pull request, confirm that every vector on the [test vectors](https://bitcoinuniverseio.github.io/runes/vectors.html) page still decodes to its stated outcome, and add a vector for any behavior you fix.

## If you add or change a page

Update `search-index.json`, `sitemap.xml`, and `llms.txt` in the same pull request, and keep the footer metadata block consistent across pages.

## Reporting problems privately

Incorrect protocol rules and unsafe guidance can be reported privately instead: see [SECURITY.md](SECURITY.md).
