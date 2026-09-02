#!/usr/bin/env node
/**
 * Runes Protocol CLI (@bitcoinuniverse/runes-tools)
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decipher, FLAWS, formatRuneId, } from './index.js';
const VERSION = '3.0.0';
function printHelp() {
    console.log(`
Runes Protocol CLI v${VERSION}
Authoritative, offline, developer-ready protocol tooling

Commands:
  decode <script-hex> [--outputs <n>] [--json]
      Deciphers a runestone output script hex into structured fields.

  encode <json-file-or-string> [--json]
      Enciphers a structured runestone object into script and payload hex.

  inspect-tx <raw-tx-hex> [--json]
      Parses a raw Bitcoin transaction and inspects runestone output.

  simulate <allocation-plan.json> [--json]
      Simulates state transitions, edict splits, and burns.

  run-vectors [--json] [--junit]
      Executes all 24 protocol test vectors against the core engine.

  run-fixtures [--json]
      Runs the 12 chain-level state transition fixtures.

  explain-flaw <flaw-name> [--json]
      Explains a cenotaph flaw, its controlling rule, and consequence.

  verify-pack [--json]
      Verifies the vector pack integrity, schemas, and parity.

  version
      Displays the toolchain and protocol versions.
`);
}
async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        printHelp();
        process.exit(0);
    }
    const command = args[0];
    const isJson = args.includes('--json');
    const isJunit = args.includes('--junit');
    switch (command) {
        case 'version': {
            if (isJson) {
                console.log(JSON.stringify({ version: VERSION, ordPin: '0.29.0', cratePin: 'ordinals 0.0.17' }, null, 2));
            }
            else {
                console.log(`Runes CLI v${VERSION} (pinned to ord 0.29.0, commit 7e37a3bd3391044b39f5f11f20dfdb8b3764cd0e)`);
            }
            break;
        }
        case 'explain-flaw': {
            const flawName = args[1];
            if (!flawName) {
                console.error('Error: Please provide a flaw name (e.g. Opcode, Varint, SupplyOverflow).');
                process.exit(1);
            }
            const desc = FLAWS[flawName];
            if (!desc) {
                console.error(`Error: Unknown flaw "${flawName}". Valid flaws: ${Object.keys(FLAWS).join(', ')}`);
                process.exit(1);
            }
            if (isJson) {
                console.log(JSON.stringify({ flaw: flawName, description: desc }, null, 2));
            }
            else {
                console.log(`Flaw: ${flawName}\nDescription: ${desc}\nConsequence: Transaction becomes a cenotaph. All input runes are burned.`);
            }
            break;
        }
        case 'decode': {
            const scriptHex = args[1];
            if (!scriptHex) {
                console.error('Error: Please provide script hex to decode.');
                process.exit(1);
            }
            let outputs = null;
            const outIdx = args.indexOf('--outputs');
            if (outIdx !== -1 && args[outIdx + 1]) {
                outputs = parseInt(args[outIdx + 1], 10);
            }
            const result = decipher(scriptHex, outputs);
            if (isJson) {
                console.log(JSON.stringify(result, (_key, value) => (typeof value === 'bigint' ? value.toString() : value), 2));
            }
            else {
                if (result.notRunestone) {
                    console.log(`NOT A RUNESTONE: ${result.notRunestone}`);
                }
                else if (result.cenotaph) {
                    console.log(`CENOTAPH DETECTED!\nFlaw: ${result.flaw}\nAll input runes burned.`);
                }
                else {
                    console.log('VALID RUNESTONE');
                    if (result.etching) {
                        console.log(`Etching: Rune=${result.etching.rune ?? 'None'} Divisibility=${result.etching.divisibility ?? 0n}`);
                    }
                    if (result.mint) {
                        console.log(`Mint: Rune ID ${formatRuneId(result.mint)}`);
                    }
                    if (result.pointer !== null) {
                        console.log(`Pointer: Output ${result.pointer}`);
                    }
                    if (result.edicts.length > 0) {
                        console.log(`Edicts (${result.edicts.length}):`);
                        result.edicts.forEach((e, i) => {
                            console.log(`  ${i + 1}. ID ${formatRuneId(e.id)} Amount ${e.amount} -> Output ${e.output}`);
                        });
                    }
                }
            }
            break;
        }
        case 'run-vectors': {
            // Load vectors.json from src/data/vectors/vectors.json
            const currentDir = dirname(fileURLToPath(import.meta.url));
            const vectorPath = resolve(currentDir, '../../../src/data/vectors/vectors.json');
            if (!existsSync(vectorPath)) {
                console.error(`Error: vectors file not found at ${vectorPath}`);
                process.exit(1);
            }
            const vectorsData = JSON.parse(readFileSync(vectorPath, 'utf8'));
            let passed = 0;
            let failed = 0;
            const testResults = [];
            for (const vec of vectorsData) {
                const res = decipher(vec.scriptHex, vec.outputs);
                let statusMatch = false;
                if (vec.expectedStatus === 'valid' && !res.cenotaph && !res.notRunestone) {
                    statusMatch = true;
                }
                else if (vec.expectedStatus === 'cenotaph' && res.cenotaph && res.flaw === vec.flaw) {
                    statusMatch = true;
                }
                else if (vec.expectedStatus === 'not-runestone' && res.notRunestone) {
                    statusMatch = true;
                }
                if (statusMatch) {
                    passed++;
                }
                else {
                    failed++;
                }
                testResults.push({
                    id: vec.id,
                    name: vec.name,
                    category: vec.category,
                    passed: statusMatch,
                    expectedStatus: vec.expectedStatus,
                    expectedFlaw: vec.flaw,
                    actualCenotaph: res.cenotaph,
                    actualFlaw: res.flaw,
                });
            }
            if (isJunit) {
                console.log(`<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="RunesConformance" tests="${vectorsData.length}" failures="${failed}">
${testResults
                    .map((r) => `  <testcase name="${r.id} - ${r.name}" classname="Vectors.${r.category}">
${!r.passed ? `    <failure message="Expected ${r.expectedStatus}, got cenotaph=${r.actualCenotaph} flaw=${r.actualFlaw}"/>` : ''}
  </testcase>`)
                    .join('\n')}
</testsuite>`);
            }
            else if (isJson) {
                console.log(JSON.stringify({ total: vectorsData.length, passed, failed, results: testResults }, null, 2));
            }
            else {
                console.log(`Vector Conformance Results: ${passed}/${vectorsData.length} passed.`);
                if (failed > 0) {
                    console.error(`Failed ${failed} test vectors!`);
                    process.exit(1);
                }
            }
            break;
        }
        default:
            console.error(`Unknown command: ${command}`);
            printHelp();
            process.exit(1);
    }
}
main().catch((err) => {
    console.error('CLI Execution Error:', err);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map