# slugmint

[![npm version](https://img.shields.io/npm/v/@v0idd0/slugmint.svg?color=A0573A)](https://www.npmjs.com/package/@v0idd0/slugmint)
[![npm downloads](https://img.shields.io/npm/dw/@v0idd0/slugmint.svg?color=1F1A14)](https://www.npmjs.com/package/@v0idd0/slugmint)
[![License: MIT](https://img.shields.io/badge/license-MIT-A0573A.svg)](LICENSE)
[![Node ≥14](https://img.shields.io/badge/node-%E2%89%A514-1F1A14)](package.json)

Generate clean URL slugs from any title — i18n aware. ~4KB minified, zero deps.

```
$ slugmint "Привет мир — 2026!"
privet-mir-2026

$ slugmint "Hello, World!"
hello-world

$ slugmint "Café crème"
cafe-creme
```

## Why slugmint

You're building a CMS. Editors paste article titles in 12 languages. Your URL bar can only really handle ASCII. The popular `slugify` package handles this, but ships 40 KB of code and a bunch of features you'll never use (custom replace tables you won't maintain, locale-aware accent options that drift from real-world expectations). slugmint is the small, opinionated version: drop in 4 KB, get sensible URL slugs across the most-typed scripts.

## Install

```bash
npm install -g @v0idd0/slugmint
```

## Usage

```bash
# Basic
slugmint "Some Article Title"

# Truncate
slugmint --max 50 "A really long title that goes on forever and ever"

# Custom separator
slugmint --sep _ "underscore separated"

# Preserve case (rare, but supported)
slugmint --keep-case "PascalCase"
```

## What it transliterates

- **Latin** — diacritic stripping (`café → cafe`, `naïve → naive`)
- **Cyrillic** (Russian + Ukrainian) — `Привет → privet`
- **Greek** — `Καλημέρα → kalimera`
- **Hebrew** — `שלום → shlvm`
- **Arabic** — `مرحبا → mrhba`
- **German** — `ß → ss`

CJK characters (Chinese, Japanese, Korean) aren't transliterated — they're better handled with URL encoding than slugs. Non-latin characters that aren't in any table get stripped.

## Compared to alternatives

| package | size (min) | i18n scripts | options surface | API style |
|---|---|---|---|---|
| slugmint | ~4 KB | 6 (Latin, Cyrillic, Greek, Hebrew, Arabic, German ß) | 4 options | function call |
| `slugify` | ~40 KB | many via tables | 12+ options | function call |
| `limax` | ~150 KB | many via dicts | conversion-style | conversion |
| `@sindresorhus/slugify` | ~10 KB | Latin only | many | function call |

If you need full Unicode normalization with editor-extensible replacement tables, `slugify` or `limax` are the right answer. For "give me a clean URL slug from a real title in a real language", slugmint is the smaller, faster, less-configurable answer.

## FAQ

**Why not transliterate Chinese/Japanese?** Because there's no canonical romanization that doesn't surprise readers. Pinyin produces ugly slugs in Hanzi, Hepburn vs. Kunrei produces different romaji. URL-encoded native script (`/categories/%E6%96%87%E5%AD%A6/`) is what major sites do; slugmint follows that practice rather than mangling.

**Hebrew/Arabic transliteration looks terse.** Because we strip vowels deliberately — Semitic-script languages encode vowels positionally, and naive transliteration produces bizarre clusters. We optimize for slug *uniqueness*, not for pronunciation.

**Why no Vietnamese / Thai support?** They each need their own transliteration table and we haven't tested those rigorously. Open an issue with example-title → expected-slug pairs and we'll add the table.

**Is it stable across versions?** The transliteration tables are append-only — we never *change* an existing mapping (would break URLs in production). If we add a Vietnamese table in v2, your existing Cyrillic outputs are unchanged.

## Programmatic API

```javascript
import { slugify } from '@v0idd0/slugmint';

slugify('Привет мир');
// 'privet-mir'

slugify('Hello World', { max: 8 });
// 'hello'

slugify('foo bar baz', { separator: '_' });
// 'foo_bar_baz'
```

### Options

| Option | Default | Description |
|---|---|---|
| `separator` | `'-'` | Character between words |
| `max` | `0` | Max chars (0 = unlimited) |
| `lowercase` | `true` | Lowercase output |
| `keepCase` | `false` | Preserve case (overrides lowercase) |

## More from the studio

This is one tool out of many — see [`from-the-studio.md`](from-the-studio.md) for the full lineup of vøiddo products (other CLI tools, browser extensions, the studio's flagship products and games).

## From the same studio

- **[@v0idd0/jsonyo](https://www.npmjs.com/package/@v0idd0/jsonyo)** — JSON swiss army knife, 18 commands, zero limits
- **[@v0idd0/envguard](https://www.npmjs.com/package/@v0idd0/envguard)** — stop shipping `.env` drift to staging
- **[@v0idd0/depcheck](https://www.npmjs.com/package/@v0idd0/depcheck)** — find unused dependencies in one command
- **[@v0idd0/gitstats](https://www.npmjs.com/package/@v0idd0/gitstats)** — git repo analytics, one command
- **[View all tools →](https://voiddo.com/tools/)**

## License

MIT.

---

Built by [vøiddo](https://voiddo.com/) — a small studio shipping AI-flavoured products, free dev tools, Chrome extensions and weird browser games.
