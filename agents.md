# Agent-Ready Documentation Suite &amp; MCP

[Runes](/runes/) / Agent-Ready Documentation Suite & MCP  Machine Documentation & Model Context Protocol

 # Agent-Ready Documentation Suite & MCP

 Machine-readable documentation formats, llms.txt, Agent Skills, and Model Context Protocol (MCP) stdio server for AI coding agents.

  
Standardized machine endpoints · 17 typed MCP tools · Native integration for AI coding assistants.
 ## 1. Agent-First Architecture

 
Runes Documentation Platform 3.0 treats AI coding agents and automated developer tools as first-class consumers. Every page, rule, tag, flaw, test vector, and transaction case is backed by structured JSON data with strict schemas.

 ## 2. Machine Indexes: llms.txt and skill.md

 
For large language models and autonomous agents, we publish clean markdown mirrors:

  - [<strong>/runes/llms.txt</strong>](/runes/llms.txt): Concise agent overview, table of contents, and key invariants formatted for LLM context limits.
 - [<strong>/runes/llms-full.txt</strong>](/runes/llms-full.txt): Complete, unrolled technical specification containing all 47 rules, tags, flaws, and vectors in a single document.
 - [<strong>/runes/skill.md</strong>](/runes/skill.md): Official Agent Skill definition for Google Antigravity, Claude Code, and autonomous developer agents.
 - [<strong>/runes/docs.manifest.json</strong>](/runes/docs.manifest.json): Complete machine manifest with file hashes and routing.
  ## 3. Model Context Protocol (MCP) Server

 
The `@bitcoinuniverse/runes-docs-mcp` package implements a local `stdio` MCP server exposing 17 deterministic protocol tools.

 `# Run the MCP server locally
npx @bitcoinuniverse/runes-docs-mcp`</pre> ## 4. The 17 MCP Tools

    Tool NameDescription   `get_rule`Retrieves full text, ord source file, and flaw triggers for any rule (R1 through R47). `get_tag`Returns tag details, parity, value range, and behavior. `get_flaw`Explains a cenotaph flaw, its trigger conditions, and burn consequences. `get_vector`Retrieves test vector details, script hex, and expected decoding. `get_fixture`Returns chain-level fixture details and consensus assertions. `get_case`Fetches real transaction atlas case studies from mainnet. `get_glossary_term`Retrieves authoritative definition and rule citations for protocol terms. `decode_script`Deciphers raw script hex into structured Runestone fields and checks for flaws. `encode_runestone`Enciphers structured fields into minimal OP_RETURN script hex. `inspect_raw_transaction`Parses raw Bitcoin transactions and deciphers any embedded runestones. `simulate_allocation`Simulates state machine balance transitions across outputs. `analyze_size`Audits script byte size against Bitcoin Core relay limits. `explain_bytes`Breaks down raw hex byte-by-byte with technical explanations. `compare_runestones`Diffs two script hexes side-by-side. `run_conformance`Executes all 24 vectors and returns structured test results. `query_protocol`Natural language search across the offline protocol knowledge base. `get_provenance`Returns upstream ord source commits, file mappings, and test locations.    ## 5. Configuring Antigravity & Claude Desktop

 <p>
Add the server to your `mcpSettings.json` or Claude Desktop configuration:

 `{
  "mcpServers": {
    "runes-docs": {
      "command": "node",
      "args": ["D:/universe/worktrees/runes-docs-v3/packages/runes-docs-mcp/dist/index.js"]
    }
  }
}`</pre>    #### Was this page technically accurate and helpful?

 <p style="margin: 0; font-size: 0.8125rem; color: var(--text-muted);">Your feedback helps maintain rigorous consensus documentation.

   <button type="button" id="fb-yes-btn" class="page-action-btn">Yes</button> <button type="button" id="fb-no-btn" class="page-action-btn">Report Issue</button>   
Thank you for your feedback!
     <button id="copy-markdown-btn" class="page-action-btn" type="button">Copy Markdown</button> [Raw Markdown](/runes/agents.md) <button id="copy-url-btn" class="page-action-btn" type="button">Copy Link</button> [Edit on GitHub](https://github.com/bitcoinuniverseio/runes/edit/main/src/pages/agents.html) <button id="print-page-btn" class="page-action-btn" type="button" onclick="window.print()">Print Document</button>
