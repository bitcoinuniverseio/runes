/**
 * Generates raw Markdown (.md) mirrors alongside each HTML page in dist/
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dir, '../dist');

function getAllHtmlFiles(dir) {
  const results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry !== '_astro' && entry !== 'versions') {
        results.push(...getAllHtmlFiles(full));
      }
    } else if (st.isFile() && extname(entry) === '.html') {
      results.push(full);
    }
  }
  return results;
}

function htmlToMarkdown(html) {
  // Extract title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(/ \| Runes Documentation Platform/, '').trim() : 'Runes Protocol';

  // Extract main content
  let body = '';
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (mainMatch) {
    body = mainMatch[1];
  } else {
    body = html;
  }

  // Remove script and style
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '');
  body = body.replace(/<style[\s\S]*?<\/style>/gi, '');

  // Convert headings
  body = body.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n');
  body = body.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n');
  body = body.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n');
  body = body.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n');

  // Convert paragraphs
  body = body.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');

  // Convert pre code
  body = body.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n');
  body = body.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');

  // Convert links
  body = body.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Convert list items
  body = body.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
  body = body.replace(/<\/?(ul|ol|div|span|article|section|aside|header|footer|table|thead|tbody|tr|th|td)[^>]*>/gi, '');

  // Clean entities
  body = body.replace(/&amp;/g, '&');
  body = body.replace(/&lt;/g, '<');
  body = body.replace(/&gt;/g, '>');
  body = body.replace(/&#123;/g, '{');
  body = body.replace(/&#125;/g, '}');
  body = body.replace(/\n{3,}/g, '\n\n');

  return `# ${title}\n\n${body.trim()}\n`;
}

const htmlFiles = getAllHtmlFiles(distDir);
let count = 0;

for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');
  const md = htmlToMarkdown(html);
  const mdPath = f.replace(/\.html$/, '.md');
  writeFileSync(mdPath, md, 'utf8');
  count++;
}

console.log(`Generated ${count} Markdown mirror files in dist/.`);
