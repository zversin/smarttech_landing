import { readFile, writeFile, access } from 'node:fs/promises';
import { photos } from '../videonablyudenie-dlya-etazha/photos.mjs';
import { FLOOR_CCTV_PRICE, DEFAULT_APARTMENTS, SUBSCRIPTION_MONTHLY_PRICE, WHATSAPP_NUMBER, formatTenge, pricePerApartment } from '../videonablyudenie-dlya-etazha/config.mjs';

const root = new URL('../', import.meta.url);
const home = await readFile(new URL('index.html', root), 'utf8');
// Главная страница — источник общей разметки. Не поддерживаем две копии navbar/footer.
const header = home.match(/<nav class="navbar">[\s\S]*?<\/nav>/)[0]
    .replace(/<div class="lang-switcher"[\s\S]*?<\/div>/, '')
    .replace('<div class="logo">SmartTech</div>', '<a class="logo" href="/" aria-label="SmartTech — главная">SmartTech</a>')
    .replace(/href="#/g, 'href="/#');
const footer = home.match(/<footer class="footer">[\s\S]*?<\/footer>/)[0];
const values = {
    HEADER: header,
    FOOTER: footer,
    PRICE: formatTenge(FLOOR_CCTV_PRICE),
    SHARE: formatTenge(pricePerApartment(DEFAULT_APARTMENTS)),
    SUBSCRIPTION: formatTenge(SUBSCRIPTION_MONTHLY_PRICE),
    YEAR: formatTenge(SUBSCRIPTION_MONTHLY_PRICE * 12),
    THREE_YEARS: formatTenge(SUBSCRIPTION_MONTHLY_PRICE * 36),
    FIVE_YEARS: formatTenge(SUBSCRIPTION_MONTHLY_PRICE * 60),
    WHATSAPP: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Здравствуйте! Интересует видеонаблюдение на этаж за ${formatTenge(FLOOR_CCTV_PRICE)} без абонентской платы. Хочу получить предложение.`)}`
};
let html = await readFile(new URL('templates/cctv-floor.html', root), 'utf8');
for (const [key, [filename, alt]] of Object.entries(photos)) {
    const path = `public/images/cctv-floor/${filename}`;
    try { await access(new URL(path, root)); } catch { continue; }
    html = html.replace(`data-photo="${key}">`, `data-photo="${key}" data-has-photo="true"><img src="/${path}" alt="${alt}" width="640" height="480" loading="${key === 'camera' ? 'eager' : 'lazy'}" decoding="async">`);
}
html = html.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Неизвестный параметр ${key}`);
    return values[key];
});
const destination = new URL('videonablyudenie-dlya-etazha/index.html', root);
if (process.argv.includes('--check')) {
    if (await readFile(destination, 'utf8') !== html) throw new Error('HTML устарел. Выполните npm run build.');
    console.log('Generated HTML is up to date.');
} else {
    await writeFile(destination, html);
    console.log('Build OK: /videonablyudenie-dlya-etazha/ — статический HTML для GitHub Pages.');
}
