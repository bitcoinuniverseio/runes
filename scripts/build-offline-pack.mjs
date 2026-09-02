/**
 * Bundles dist/ into dist/runes-docs-v3.0.0.zip and writes sha256 checksum
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dir = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dir, '../dist');
const zipPath = resolve(distDir, 'runes-docs-v3.0.0.zip');
const hashPath = resolve(distDir, 'runes-docs-v3.0.0.zip.sha256');

if (existsSync(zipPath)) {
  unlinkSync(zipPath);
}

try {
  // Use tar.exe which is standard on Windows 10/11 and unix
  execSync(`tar -a -c -f "${zipPath}" *`, { cwd: distDir, stdio: 'pipe' });
} catch (e) {
  // Fallback to PowerShell Compress-Archive
  execSync(`powershell -Command "Compress-Archive -Path '${distDir}/*' -DestinationPath '${zipPath}' -Force"`, { stdio: 'pipe' });
}

if (existsSync(zipPath)) {
  const zipBuffer = readFileSync(zipPath);
  const sha256 = createHash('sha256').update(zipBuffer).digest('hex');
  writeFileSync(hashPath, `${sha256}  runes-docs-v3.0.0.zip\n`, 'utf8');

  console.log(`Created dist/runes-docs-v3.0.0.zip (${zipBuffer.length} bytes)`);
  console.log(`SHA-256: ${sha256}`);
} else {
  console.error('Failed to create zip bundle');
  process.exit(1);
}
