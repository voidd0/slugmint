import { slugify } from './src/index.js';
import assert from 'node:assert';

function it(name, fn) {
  try { fn(); console.log(`  ok ${name}`); }
  catch (e) { console.error(`  FAIL ${name}: ${e.message}`); process.exitCode = 1; }
}

console.log('slugmint smoke tests');

it('basic latin', () => assert.equal(slugify('Hello World'), 'hello-world'));
it('punctuation strip', () => assert.equal(slugify('Hello, World!'), 'hello-world'));
it('diacritics removed', () => assert.equal(slugify('Café crème'), 'cafe-creme'));
it('cyrillic transliterated', () => assert.equal(slugify('Привет мир'), 'privet-mir'));
it('greek transliterated', () => assert.equal(slugify('Καλημέρα'), 'kalimera'));
it('hebrew transliterated', () => assert.equal(slugify('שלום עולם'), 'shlvm-avlm'));
it('mixed scripts', () => assert.equal(slugify('Привет — 2026!'), 'privet-2026'));
it('german eszett', () => assert.equal(slugify('Straße'), 'strasse'));
it('underscore to separator', () => assert.equal(slugify('foo_bar_baz'), 'foo-bar-baz'));
it('custom separator', () => assert.equal(slugify('hello world', { separator: '_' }), 'hello_world'));
it('max length', () => {
  const r = slugify('this is a very long title for testing', { max: 20 });
  assert.ok(r.length <= 20, `got ${r.length} chars`);
});
it('keep-case', () => assert.equal(slugify('Hello World', { keepCase: true, lowercase: false }), 'Hello-World'));
it('collapse separators', () => assert.equal(slugify('foo----bar'), 'foo-bar'));
it('trim leading/trailing', () => assert.equal(slugify('---foo---'), 'foo'));
it('empty', () => assert.equal(slugify(''), ''));

console.log('done');
