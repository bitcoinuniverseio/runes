# Security policy

## Reporting a vulnerability

Report privately through GitHub's private vulnerability reporting on this repository:

**<https://github.com/bitcoinuniverseio/runes/security/advisories/new>**

Do not open a public issue, pull request, or discussion for a security report.

## What is in scope

This repository is documentation. There is no server, no build step, no dependency tree, and no user data. In-scope reports are:

- **Incorrect protocol rules.** A rule in the specification, reference, or test vectors that disagrees with the ord reference implementation. This is the most valuable report we can receive: implementers rely on these pages, and a wrong rule leads to burned or misattributed funds.
- **Incorrect decoder behavior.** The decoder in `decoder.js` reaching a different verdict than ord would for a given script and output count.
- **Unsafe guidance.** Instructions on any page that would lead a reader to burn runes or lose funds if followed.
- **Overstated capability claims.** Any claim that a Bitcoin Universe product supports an operation it does not.
- **Site integrity issues.** Cross-site scripting in the decoder or search, or anything that causes the published pages to make an external network request.

## What is out of scope

- Vulnerabilities in the Runes protocol itself or in ord. Report those to the [ord project](https://github.com/ordinals/ord/security).
- Vulnerabilities in Bitcoin Universe products. Report those to the security contact of the relevant repository.
- Missing security headers, absent rate limiting, and similar findings on GitHub Pages infrastructure, which we do not control.

## Handling

We aim to acknowledge a report within 5 business days. Confirmed protocol-accuracy errors are corrected as a priority and recorded in the [changelog](https://bitcoinuniverseio.github.io/runes/changelog.html). We are happy to credit reporters who want it.

Never include private keys, seed phrases, wallet files, or the contents of any transaction you have not already broadcast in a report.
