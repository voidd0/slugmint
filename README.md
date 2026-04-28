# slugmint

Generate clean URL slugs from any title — i18n aware.

```
$ slugmint "Привет мир — 2026!"
privet-mir-2026

$ slugmint "Hello, World!"
hello-world

$ slugmint "Café crème"
cafe-creme
```

## Install

```bash
npm install -g pnkd-slugmint
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

## Programmatic API

```javascript
import { slugify } from 'pnkd-slugmint';

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

## Why not `slugify`?

The popular `slugify` package is solid but bloated (40+ KB). `slugmint` is ~4 KB minified, zero deps, focused on URL slugs specifically — no random "limit length to N words" mode, no streaming. Just slug generation.

## License

MIT — part of the [vøiddo](https://voiddo.com) tools collection.
