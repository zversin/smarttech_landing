import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { pages, SITE_ORIGIN, legacyAnchors } from '../site.config.mjs';
import { FLOOR_CCTV_PRICE, formatTenge, pricePerApartment } from '../videonablyudenie-dlya-etazha/config.mjs';

const root = new URL('../', import.meta.url);
for (const file of ['site.config.mjs', 'site-i18n.js', 'script.js', 'services-slider.js', 'navigation.js', 'scripts/build.mjs', 'scripts/lint.mjs', 'videonablyudenie-dlya-etazha/config.mjs', 'videonablyudenie-dlya-etazha/photos.mjs', 'videonablyudenie-dlya-etazha/script.mjs']) {
    execFileSync(process.execPath, ['--check', new URL(file, root).pathname], { stdio: 'inherit' });
}
execFileSync(process.execPath, [new URL('scripts/build.mjs', root).pathname, '--check'], { stdio: 'inherit' });
const routes = [...pages.map(page => page.path), '/videonablyudenie-dlya-etazha/'];
const documents = new Map();
const titles = new Set();
for (const route of routes) {
    const html = await readFile(new URL(route.slice(1) + 'index.html', root), 'utf8');
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: должен быть один H1`);
    assert.equal((html.match(/<main\b/g) || []).length, 1, `${route}: должен быть один main`);
    assert(!/\{\{[^}]+\}\}/.test(html), `${route}: остались параметры шаблона`);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size, `${route}: повторяющиеся id`);
    for (const [, value] of html.matchAll(/<script[^>]+type="application\/json"[^>]*>([\s\S]*?)<\/script>/g)) JSON.parse(value);
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    assert(!titles.has(title), `${route}: повторяется title`);
    titles.add(title);
    assert(html.includes(`rel="canonical" href="${SITE_ORIGIN}${route}"`), `${route}: canonical`);
    documents.set(route, {html, ids});
}
// Проверяем ссылки между страницами и фрагменты, включая старые входящие адреса.
for (const [route, {html}] of documents) {
    const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
    for (const [, srcset] of html.matchAll(/srcset="([^"]+)"/g)) references.push(...srcset.split(',').map(item => item.trim().split(/\s/)[0]));
    for (const reference of references) {
        const url = new URL(reference.replaceAll('&amp;', '&'), SITE_ORIGIN + route);
        if (url.origin !== SITE_ORIGIN) continue;
        if (documents.has(url.pathname)) {
            if (url.hash) assert(documents.get(url.pathname).ids.includes(url.hash.slice(1)), `${route}: нет якоря ${reference}`);
        } else {
            await access(new URL('.' + url.pathname, root));
        }
    }
}
for (const target of Object.values(legacyAnchors)) {
    const url = new URL(target, SITE_ORIGIN);
    assert(documents.get(url.pathname)?.ids.includes(url.hash.slice(1)), `Неверный перенос ${target}`);
}
const floor = documents.get('/videonablyudenie-dlya-etazha/').html;
for (const [, price] of floor.matchAll(/data-floor-price>([^<]+)</g)) assert.equal(price, formatTenge(FLOOR_CCTV_PRICE));
for (const [, price] of floor.matchAll(/data-default-share>([^<]+)</g)) assert.equal(price, formatTenge(pricePerApartment(4)));
assert(documents.get('/').html.includes(formatTenge(FLOOR_CCTV_PRICE)), 'Цена на главной не совпадает');
for (const count of [2, 3, 4, 5, 6, 7, 8]) assert.equal(pricePerApartment(count), FLOOR_CCTV_PRICE / count);
for (const count of [0, 1, 9, 4.5, NaN]) assert.throws(() => pricePerApartment(count), RangeError);
const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
for (const route of routes) assert(sitemap.includes(`<loc>${SITE_ORIGIN}${route}</loc>`));
console.log(`Lint OK: ${routes.length} страниц, JavaScript, JSON, уникальные title/H1, canonical, ссылки, фото, перенесённые якоря, цены и sitemap.`);
