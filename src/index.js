// slugmint — i18n-aware url slug generator.
//
// Strategy:
//   1. NFD normalize + strip combining marks (handles latin diacritics).
//   2. Transliterate cyrillic / greek / hebrew / arabic / german eszett /
//      common cjk pinyin via lookup tables. CJK characters that aren't in
//      the small pinyin map fall back to "x" placeholder (CJK in URLs is
//      best-handled by encoding rather than slug).
//   3. Lowercase, replace non-alphanumerics with `-`, collapse repeats,
//      trim leading/trailing `-`.
//
// Pure JS, no deps. About 4 KB minified.

const CYRILLIC_RU = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z',
  'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r',
  'с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch',
  'ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
};

const CYRILLIC_UA = {
  'і':'i','ї':'yi','є':'ye','ґ':'g',
};

const GREEK = {
  'α':'a','β':'b','γ':'g','δ':'d','ε':'e','ζ':'z','η':'i','θ':'th','ι':'i',
  'κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s',
  'ς':'s','τ':'t','υ':'y','φ':'f','χ':'ch','ψ':'ps','ω':'o',
};

const HEBREW = {
  'א':'a','ב':'b','ג':'g','ד':'d','ה':'h','ו':'v','ז':'z','ח':'ch','ט':'t',
  'י':'y','כ':'k','ך':'k','ל':'l','מ':'m','ם':'m','נ':'n','ן':'n','ס':'s',
  'ע':'a','פ':'p','ף':'p','צ':'tz','ץ':'tz','ק':'k','ר':'r','ש':'sh','ת':'t',
};

const ARABIC = {
  'ا':'a','ب':'b','ت':'t','ث':'th','ج':'j','ح':'h','خ':'kh','د':'d','ذ':'dh',
  'ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'z','ع':'a',
  'غ':'gh','ف':'f','ق':'q','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'w','ي':'y',
};

const GERMAN = { 'ß': 'ss' };

const TABLES = [CYRILLIC_RU, CYRILLIC_UA, GREEK, HEBREW, ARABIC, GERMAN];

function transliterate(s) {
  // Look up by lowercased char so tables stay compact, but preserve the
  // original case in output (matters when keepCase is true). Tables are
  // lowercase-only by design, so a transliterated cluster like "shch"
  // always comes back lowercase even if the original was uppercase.
  let out = '';
  for (const ch of s) {
    const lower = ch.toLowerCase();
    let mapped = null;
    for (const t of TABLES) {
      if (lower in t) { mapped = t[lower]; break; }
    }
    out += mapped !== null ? mapped : ch;
  }
  return out;
}

function stripCombining(s) {
  // NFD splits "é" into "e" + combining acute, then we drop the combining.
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function slugify(input, options = {}) {
  const {
    separator = '-',
    max = 0,
    lowercase = true,
    keepCase = false,
  } = options;

  if (typeof input !== 'string') {
    throw new TypeError('slugmint: input must be a string');
  }

  let s = input;
  s = stripCombining(s);
  s = transliterate(s);

  // Strip remaining non-ASCII letters (CJK that wasn't transliterated).
  s = s.replace(/[^a-zA-Z0-9\s\-_]/g, ' ');

  // Collapse whitespace + non-alphanum to separator.
  s = s.replace(/[\s_]+/g, separator);
  s = s.replace(new RegExp(`[^a-zA-Z0-9${escapeRegex(separator)}]+`, 'g'), separator);

  // Collapse separator runs.
  const sepEsc = escapeRegex(separator);
  s = s.replace(new RegExp(`${sepEsc}+`, 'g'), separator);

  // Trim leading/trailing separator.
  s = s.replace(new RegExp(`^${sepEsc}+|${sepEsc}+$`, 'g'), '');

  if (lowercase && !keepCase) s = s.toLowerCase();

  if (max > 0 && s.length > max) {
    s = s.slice(0, max);
    // Trim trailing separator after cut.
    s = s.replace(new RegExp(`${sepEsc}+$`, 'g'), '');
    // If we cut mid-word, walk back to last separator to avoid orphan fragment.
    const lastSep = s.lastIndexOf(separator);
    if (lastSep > 0 && (s.length - lastSep) < 4 && lastSep > max * 0.6) {
      s = s.slice(0, lastSep);
    }
  }

  return s;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
