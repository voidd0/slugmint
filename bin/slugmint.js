#!/usr/bin/env node
import { slugify } from '../src/index.js';

const args = process.argv.slice(2);

function help() {
  console.log(`
slugmint — generate url slugs from any title (i18n aware).

  slugmint "<title>"            slugify a title
  slugmint --max N "<title>"    truncate to N chars
  slugmint --sep _ "<title>"    use custom separator (default: -)
  slugmint --keep-case "<...>"  preserve original case
  slugmint -h, --help           show this

examples:
  slugmint "Привет мир — 2026!"
  # privet-mir-2026

  slugmint "Hello, World!"
  # hello-world

  slugmint --max 30 "A very long title that goes on forever"
  # a-very-long-title-that-goes-on
`);
}

if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  help();
  process.exit(0);
}

const opts = { max: 0, separator: '-', keepCase: false };
const positional = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--max') opts.max = parseInt(args[++i], 10) || 0;
  else if (a === '--sep') opts.separator = args[++i] || '-';
  else if (a === '--keep-case') opts.keepCase = true;
  else if (a.startsWith('--')) { console.error(`unknown flag: ${a}`); process.exit(1); }
  else positional.push(a);
}

const title = positional.join(' ');
if (!title) { console.error('error: no title given'); process.exit(1); }

try {
  console.log(slugify(title, opts));
} catch (e) {
  console.error(`slugmint: ${e.message}`);
  process.exit(2);
}
