# Offline Mode &amp; PWA Installation

[Runes](/runes/) / Offline Mode & PWA Installation  Offline-First Documentation

 # Offline Mode & PWA Installation

 Guide to installing the Runes documentation as a Progressive Web App (PWA) or downloading the offline HTML bundle for air-gapped environments.

  
100% Offline Capable · Zero External Tracking · Air-gap safe.
 
The Runes Documentation Platform is engineered from the ground up as an offline-first resource. It requires no continuous internet connection, no external CDN dependencies, and no remote API calls.

 ## 1. Offline-First Architecture

 
When you visit the site, an automated Service Worker (`sw.js`) caches:

  - All HTML pages (specification, reference, guide, studio, academy, etc.).
 - All stylesheets, system font fallbacks, and SVG icons.
 - The client-side search index and protocol JSON databases.
 - The full client-side JavaScript execution engine and decoders.
  ## 2. Installing the Web App

 
You can install this documentation directly as a standalone desktop application on Windows, macOS, Linux, Android, or iOS:

  - Click the <strong>Install</strong> icon in your browser address bar (Chrome, Edge, Brave) or select <strong>Add to Home Screen</strong> (Safari iOS).
 - The platform opens in a clean, dedicated window without browser chrome or URL bars.
 - Use `Ctrl+K` or `/` anywhere to invoke the instant command search.
  ## 3. Downloadable Documentation Bundle

 
For secure, air-gapped signing machines or offline development environments:

  Complete Standalone Archive 
Download the static HTML documentation bundle: [<strong>runes-docs-v3.0.0.zip</strong>](/runes/runes-docs-v3.0.0.zip).

 
Extract the archive and open `index.html` in any web browser. Every interactive tool, studio mode, and reference search works without a local web server.

  ## 4. Testing Offline Capabilities

 
To verify offline readiness:

  - Open developer tools (F12) and toggle network to <strong>Offline</strong> (or disconnect your network cable).
 - Navigate to the [Runestone Studio](/runes/studio.html) and decipher any script hex.
 - Open the command center (`/`) and search for any rule or vector.
 - All calculations, parsing, and searches execute with zero latency.
     #### Was this page technically accurate and helpful?

 Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/offline.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/offline.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
