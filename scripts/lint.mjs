import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { FLOOR_CCTV_PRICE, formatTenge, pricePerApartment } from '../videonablyudenie-dlya-etazha/config.mjs';

const root = new URL('../', import.meta.url);
for (const file of ['script.js', 'navigation.js', 'scripts/build.mjs', 'scripts/lint.mjs', 'videonablyudenie-dlya-etazha/config.mjs', 'videonablyudenie-dlya-etazha/photos.mjs', 'videonablyudenie-dlya-etazha/script.mjs']) {
    execFileSync(process.execPath, ['--check', new URL(file, root).pathname], { stdio: 'inherit' });
}
execFileSync(process.execPath, [new URL('scripts/build.mjs', root).pathname, '--check'], { stdio: 'inherit' });
const html = await readFile(new URL('videonablyudenie-dlya-etazha/index.html', root), 'utf8');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Должен быть один H1');
assert(!/\{\{[A-Z_]+\}\}/.test(html), 'Остались параметры шаблона');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Повторяющиеся id');
for (const [, href] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(href), `Нет якоря ${href}`);
for (const [, path] of html.matchAll(/(?:src|href)="(\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
    await access(new URL(`.${path}`, root));
}
for (const [, price] of html.matchAll(/data-floor-price>([^<]+)</g)) assert.equal(price, formatTenge(FLOOR_CCTV_PRICE));
for (const [, price] of html.matchAll(/data-default-share>([^<]+)</g)) assert.equal(price, formatTenge(pricePerApartment(4)));
for (const count of [2, 3, 4, 5, 6, 7, 8]) assert.equal(pricePerApartment(count), FLOOR_CCTV_PRICE / count);
for (const count of [0, 1, 9, 4.5, NaN]) assert.throws(() => pricePerApartment(count), RangeError);
console.log('Lint OK: JavaScript syntax, generated HTML, anchors, local assets, prices and calculator bounds.');
