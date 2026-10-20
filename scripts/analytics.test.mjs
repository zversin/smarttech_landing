import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { metrikaMarkup } from '../analytics.config.mjs';

const code = readFileSync(new URL('../analytics.js', import.meta.url), 'utf8');
function start(hostname = 'smarttech.asia', counter = '123456') {
    const calls = [], handlers = {}, tags = [];
    const window = {
        location: { hostname, pathname: '/kontrol-dostupa/', href: `https://${hostname}/kontrol-dostupa/` },
        ym: (...args) => calls.push(args)
    };
    const document = {
        currentScript: { dataset: { counter } },
        createElement: () => ({}),
        head: { appendChild: node => tags.push(node) },
        addEventListener: (name, callback) => { handlers[name] = callback; },
        querySelector: () => null,
        querySelectorAll: () => [],
        getElementById: () => null
    };
    vm.runInNewContext(code, { window, document, URL, Date, Set, Map, WeakSet, Number, Object });
    return { calls, handlers, tags, window };
}

test('Only a valid public counter number generates markup', () => {
    assert.equal(metrikaMarkup(null), '');
    assert.match(metrikaMarkup(123456), /data-counter="123456"/);
    for (const bad of ['123456', 0, -1, NaN, 1.5]) assert.throws(() => metrikaMarkup(bad));
});
test('Local development and missing counter do not send analytics', () => {
    assert.equal(start('localhost').calls.length, 0);
    assert.equal(start('smarttech.asia', '').tags.length, 0);
});
test('Initialization does not collect outbound message URLs or replay forms', () => {
    const { calls, tags } = start();
    assert.equal(calls[0][1], 'init');
    assert.equal(calls[0][2].trackLinks, false);
    assert.equal(calls[0][2].webvisor, false);
    assert.equal(tags[0].src, 'https://mc.yandex.ru/metrika/tag.js');
});
test('Goals retain supported choices and discard personal fields and URLs', () => {
    const { calls, window } = start();
    window.smarttechAnalytics.track('whatsapp_click', {
        source: 'calculator', model: '341', lanes: 2, directions: 2,
        phone: '+77001234567', name: 'Test', address: 'Private address',
        site: 'Private site', text: 'Private message', url: 'https://wa.me/?text=private'
    });
    const goal = calls.at(-1);
    assert.equal(goal[2], 'whatsapp_click');
    assert.deepEqual(JSON.parse(JSON.stringify(goal[3])), { calculator: 'access', source: 'calculator', model: '341', lanes: 2, directions: 2 });
    const visit = calls.find(call => call[1] === 'params');
    assert.equal(visit[2].smarttech_actions.whatsapp_click, 'yes');
    assert(!JSON.stringify(visit).includes('Private address'));
    const before = calls.length;
    window.smarttechAnalytics.track('unknown', { text: 'private' });
    assert.equal(calls.length, before);
});
test('Contact clicks record intent without recording destination query strings', () => {
    const { calls, handlers } = start();
    const link = {
        href: 'https://wa.me/77087262237?text=private-name-and-phone',
        closest: () => null, classList: { contains: () => false },
        matches: () => true
    };
    handlers.click({ target: { closest: () => link } });
    assert.equal(calls.at(-1)[2], 'whatsapp_click');
    assert.equal(calls.at(-1)[3].source, 'calculator');
    assert(!JSON.stringify(calls).includes('private-name-and-phone'));
    link.href = 'tel:+77087262237';
    handlers.click({ target: { closest: () => link } });
    assert.equal(calls.at(-1)[2], 'phone_click');
});
