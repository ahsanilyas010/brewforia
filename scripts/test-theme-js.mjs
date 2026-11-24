// Behaviour tests for assets/theme.js (web components) using jsdom and a mocked fetch.
// Run: cd scripts && npm install jsdom && node test-theme-js.mjs
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const code = readFileSync(new URL('../assets/theme.js', import.meta.url), 'utf8');
let passed = 0;
const test = async (name, fn) => {
  try { await fn(); passed++; console.log('ok   ', name); }
  catch (e) { console.error('FAIL ', name, '\n     ', e.message); process.exitCode = 1; }
};

const boot = (html, fetchImpl) => {
  const dom = new JSDOM(`<!doctype html><body>${html}</body>`, { runScripts: 'outside-only', url: 'https://shop.test/products/x', pretendToBeVisual: true });
  const calls = [];
  dom.window.fetch = async (url, opts = {}) => { calls.push({ url, opts }); return fetchImpl(url, opts); };
  dom.window.eval(code);
  return { win: dom.window, doc: dom.window.document, calls };
};
const json = (data, ok = true) => ({ ok, json: async () => data, text: async () => JSON.stringify(data) });
const tick = () => new Promise((r) => setTimeout(r, 0));

const productHtml = (variants) => `
<span data-cart-count>0</span>
<product-form><form>
  <input type="hidden" name="id" data-variant-id value="">
  <p data-price data-from="From Rs.1,250">From Rs.1,250</p>
  ${variants.map((v) => `<button type="button" class="option-button" aria-pressed="false" data-option data-variant-id="${v.id}" data-available="${v.ok}" data-title="${v.t}" data-option-price="${v.p}">${v.t}</button>`).join('')}
  <button type="submit" data-submit disabled>Add</button>
  <p data-hint data-select="Select a size to continue" data-ready="Ready to add size __size__">Select a size to continue</p>
  <p data-live data-added="Added to cart"></p>
</form></product-form>`;

await test('product form: selecting a size enables add, sets id, hint and price', async () => {
  const { doc } = boot(productHtml([{ id: 11, t: '50g', ok: 'true', p: 'Rs.1,250' }]), () => json({}));
  doc.querySelector('[data-option]').click();
  assert.equal(doc.querySelector('[data-variant-id]').value, '11');
  assert.equal(doc.querySelector('[data-submit]').disabled, false);
  assert.equal(doc.querySelector('[data-hint]').textContent, 'Ready to add size 50g');
  assert.equal(doc.querySelector('[data-price]').textContent, 'Rs.1,250');
});

await test('product form: sold out variant keeps add disabled', async () => {
  const { doc } = boot(productHtml([{ id: 12, t: '100g', ok: 'false', p: 'Rs.1' }]), () => json({}));
  doc.querySelector('[data-option]').click();
  assert.equal(doc.querySelector('[data-submit]').disabled, true);
});

await test('product form: submit posts to /cart/add.js, updates badge, resets selection', async () => {
  const { doc, calls } = boot(productHtml([{ id: 11, t: '50g', ok: 'true', p: 'Rs.1,250' }]), (url) =>
    url === '/cart.js' ? json({ item_count: 3 }) : json({ items: [] }));
  doc.querySelector('[data-option]').click();
  doc.querySelector('form').dispatchEvent(new doc.defaultView.Event('submit', { cancelable: true, bubbles: true }));
  await tick(); await tick(); await tick();
  assert.equal(calls[0].url, '/cart/add.js');
  assert.deepEqual(JSON.parse(calls[0].opts.body), { items: [{ id: 11, quantity: 1 }] });
  assert.equal(doc.querySelector('[data-cart-count]').textContent, '3');
  assert.equal(doc.querySelector('[data-variant-id]').value, '');
  assert.equal(doc.querySelector('[data-submit]').disabled, true);
  assert.equal(doc.querySelector('[data-live]').textContent, 'Added to cart');
  assert.equal(doc.querySelector('[data-hint]').textContent, 'Select a size to continue');
});

await test('product form: API error is shown and add re-enabled', async () => {
  const { doc } = boot(productHtml([{ id: 11, t: '50g', ok: 'true', p: 'x' }]), () => json({ description: 'All 5 are in your cart' }, false));
  doc.querySelector('[data-option]').click();
  doc.querySelector('form').dispatchEvent(new doc.defaultView.Event('submit', { cancelable: true, bubbles: true }));
  await tick(); await tick();
  assert.equal(doc.querySelector('[data-hint]').textContent, 'All 5 are in your cart');
  assert.equal(doc.querySelector('[data-submit]').disabled, false);
});

const cartHtml = (qty) => `<span data-cart-count>${qty}</span>
<cart-items data-section-id="main"><p data-status></p>
  <input type="number" value="${qty}" data-qty data-line="1">
  <button type="button" data-remove data-line="1">x</button>
</cart-items>`;

await test('cart: quantity change posts /cart/change.js with line and quantity, re-renders section', async () => {
  const fresh = '<cart-items data-section-id="main"><input type="number" value="4" data-qty data-line="1"></cart-items>';
  const { doc, calls } = boot(cartHtml(2), (url) => {
    if (url.startsWith('/cart/change.js')) return json({ item_count: 4 });
    return { ok: true, text: async () => `<html><body>${fresh}</body></html>` };
  });
  const input = doc.querySelector('[data-qty]'); input.value = '4';
  input.dispatchEvent(new doc.defaultView.Event('change', { bubbles: true }));
  await tick(); await tick(); await tick();
  assert.equal(calls[0].url, '/cart/change.js');
  assert.deepEqual(JSON.parse(calls[0].opts.body), { line: 1, quantity: 4 });
  assert.equal(doc.querySelector('[data-cart-count]').textContent, '4');
  assert.match(calls[1].url, /\?section_id=main$/);
  assert.equal(doc.querySelector('[data-qty]').value, '4');
});

await test('cart: empty or zero quantity input is ignored (matches source)', async () => {
  const { doc, calls } = boot(cartHtml(2), () => json({}));
  const input = doc.querySelector('[data-qty]');
  for (const v of ['', '0']) { input.value = v; input.dispatchEvent(new doc.defaultView.Event('change', { bubbles: true })); }
  await tick();
  assert.equal(calls.length, 0);
  assert.equal(input.value, '2');
});

await test('cart: remove sends quantity 0', async () => {
  const { doc, calls } = boot(cartHtml(2), (url) => (url.startsWith('/cart/change.js') ? json({ item_count: 0 }) : { ok: true, text: async () => '<html><body><cart-items data-section-id="main"></cart-items></body></html>' }));
  doc.querySelector('[data-remove]').click();
  await tick(); await tick(); await tick();
  assert.deepEqual(JSON.parse(calls[0].opts.body), { line: 1, quantity: 0 });
  assert.equal(doc.querySelector('[data-cart-count]').textContent, '0');
});

const gridHtml = `<div data-search-bar hidden><input type="search"></div>
<collection-filters>
  <button data-filter-toggle aria-expanded="true"></button><div data-filter-panel></div>
  <label><input type="checkbox" value="coffee"></label><label><input type="checkbox" value="chocolate"></label>
  <select data-sort><option value="relevant"></option><option value="low-high"></option><option value="high-low"></option></select>
  <ul data-grid>
    <li data-category="coffee" data-title="caffino latte" data-price="1500">a</li>
    <li data-category="chocolate" data-title="krakakoa dark" data-price="800">b</li>
    <li data-category="coffee" data-title="harvestside robusta" data-price="1800">c</li>
  </ul><p data-empty hidden></p>
</collection-filters>`;
const visible = (doc) => [...doc.querySelectorAll('[data-grid] > li')].filter((li) => !li.hidden).map((li) => li.textContent);

await test('collection: category checkbox filters, multi-select combines', async () => {
  const { doc } = boot(gridHtml, () => json({}));
  const [coffee, choc] = doc.querySelectorAll('input[type=checkbox]');
  coffee.checked = true; coffee.dispatchEvent(new doc.defaultView.Event('change'));
  assert.deepEqual(visible(doc), ['a', 'c']);
  choc.checked = true; choc.dispatchEvent(new doc.defaultView.Event('change'));
  assert.deepEqual(visible(doc), ['a', 'b', 'c']);
});

await test('collection: sort low-high and high-low, relevant restores order', async () => {
  const { doc } = boot(gridHtml, () => json({}));
  const sel = doc.querySelector('[data-sort]');
  const order = () => [...doc.querySelectorAll('[data-grid] > li')].map((li) => li.textContent).join('');
  sel.value = 'low-high'; sel.dispatchEvent(new doc.defaultView.Event('change')); assert.equal(order(), 'bac');
  sel.value = 'high-low'; sel.dispatchEvent(new doc.defaultView.Event('change')); assert.equal(order(), 'cab');
  sel.value = 'relevant'; sel.dispatchEvent(new doc.defaultView.Event('change')); assert.equal(order(), 'abc');
});

await test('collection: search term filters by title and shows empty state', async () => {
  const { doc } = boot(gridHtml, () => json({}));
  const input = doc.querySelector('[data-search-bar] input');
  input.value = 'robusta'; input.dispatchEvent(new doc.defaultView.Event('input'));
  assert.deepEqual(visible(doc), ['c']);
  input.value = 'zzz'; input.dispatchEvent(new doc.defaultView.Event('input'));
  assert.deepEqual(visible(doc), []);
  assert.equal(doc.querySelector('[data-empty]').hidden, false);
});

await test('collection: filter toggle collapses the panel', async () => {
  const { doc } = boot(gridHtml, () => json({}));
  doc.querySelector('[data-filter-toggle]').click();
  assert.equal(doc.querySelector('[data-filter-panel]').classList.contains('is-collapsed'), true);
  assert.equal(doc.querySelector('[data-filter-toggle]').getAttribute('aria-expanded'), 'false');
});

await test('mobile menu: opens, closes with button and Escape', async () => {
  const { doc } = boot(`<button data-menu-open aria-expanded="false"></button><mobile-menu><div data-menu-panel><button data-menu-close>b</button><a href="/">h</a></div></mobile-menu>`, () => json({}));
  const panel = doc.querySelector('[data-menu-panel]');
  doc.querySelector('[data-menu-open]').click();
  assert.equal(panel.classList.contains('is-open'), true);
  doc.querySelector('[data-menu-close]').click();
  assert.equal(panel.classList.contains('is-open'), false);
  doc.querySelector('[data-menu-open]').click();
  doc.querySelector('mobile-menu').dispatchEvent(new doc.defaultView.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(panel.classList.contains('is-open'), false);
});

await test('search toggle: icon opens and closes the filter bar instead of navigating', async () => {
  const { doc } = boot(`<search-toggle><a href="/search" aria-expanded="false">s</a></search-toggle><div data-search-bar hidden><input><button data-search-close></button></div>`, () => json({}));
  const link = doc.querySelector('search-toggle a');
  link.click();
  assert.equal(doc.querySelector('[data-search-bar]').hasAttribute('hidden'), false);
  doc.querySelector('[data-search-close]').click();
  assert.equal(doc.querySelector('[data-search-bar]').hasAttribute('hidden'), true);
});

await test('gallery: thumbnail shows matching slide', async () => {
  const { doc } = boot(`<product-gallery><button data-thumb></button><button data-thumb></button><div data-slide></div><div data-slide hidden></div></product-gallery>`, () => json({}));
  doc.querySelectorAll('[data-thumb]')[1].click();
  const [s1, s2] = doc.querySelectorAll('[data-slide]');
  assert.equal(s1.hidden, true); assert.equal(s2.hidden, false);
});

console.log(`\n${passed} passed`);
