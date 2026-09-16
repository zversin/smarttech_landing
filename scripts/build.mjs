import { readFile, writeFile, access, mkdir } from 'node:fs/promises';
import { pages, SITE_ORIGIN, legacyAnchors } from '../site.config.mjs';
import { photos } from '../videonablyudenie-dlya-etazha/photos.mjs';
import { FLOOR_CCTV_PRICE, DEFAULT_APARTMENTS, SUBSCRIPTION_MONTHLY_PRICE, WHATSAPP_NUMBER, formatTenge, pricePerApartment } from '../videonablyudenie-dlya-etazha/config.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');
const render = (template, values) => template.replace(/\{\{([A-Z_0-9]+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Неизвестный параметр ${key}`);
    return values[key];
});
const baseHeader = await read('templates/partials/header.html');
const footer = await read('templates/partials/footer.html');
const header = (group, languages = true) => {
    let html = baseHeader.replace(`data-nav="${group}"`, `data-nav="${group}" aria-current="${group === 'services' ? 'location' : 'page'}"`);
    if (!languages) html = html.replace(/<div class="lang-switcher"[\s\S]*?<\/div>/, '');
    return html;
};
const sections = {};
for (const id of ['packages', 'modernization', 'projects', 'process', 'about', 'partners', 'faq', 'contact', 'services']) sections[id] = await read(`templates/sections/${id}.html`);
// Короткие карточки на главной берём из того же источника, что и полный каталог.
const homePackages = [...sections.packages.matchAll(/<article class="package-card[\s\S]*?<\/article>/g)]
    .map(([card]) => card
        .replace(/\s*<p class="package-audience"[\s\S]*?<\/p>/, '')
        .replace(/\s*<dl class="package-specs"[\s\S]*?<\/dl>/, '')
        .replace(/<h4\b/g, '<h5').replaceAll('</h4>', '</h5>')
        .replace(/<h3\b/g, '<h4').replaceAll('</h3>', '</h4>'))
    .join('\n');
const values = {
    ACCESS_START_PRICE: sections.packages.match(/data-i18n="packageStart3000Price">([^<]+)</)[1],
    PRICE: formatTenge(FLOOR_CCTV_PRICE), SHARE: formatTenge(pricePerApartment(DEFAULT_APARTMENTS)),
    SUBSCRIPTION: formatTenge(SUBSCRIPTION_MONTHLY_PRICE), YEAR: formatTenge(SUBSCRIPTION_MONTHLY_PRICE * 12),
    THREE_YEARS: formatTenge(SUBSCRIPTION_MONTHLY_PRICE * 36), FIVE_YEARS: formatTenge(SUBSCRIPTION_MONTHLY_PRICE * 60),
    WHATSAPP: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Здравствуйте! Интересует видеонаблюдение на этаж за ${formatTenge(FLOOR_CCTV_PRICE)} без абонентской платы. Хочу получить предложение.`)}`,
    GENERAL_WHATSAPP: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Здравствуйте! Хочу рассчитать установку системы безопасности. Город и объект: ')}`,
    HOME_PACKAGES: homePackages,
    CONTACT: sections.contact, PROCESS: sections.process, SERVICES: sections.services
};
const breadcrumbs = (page) => `<nav class="site-breadcrumbs" aria-label="Навигационная цепочка"><a href="/" data-i18n="navHome">Главная</a><span aria-hidden="true">/</span>${page.group === 'services' ? '<a href="/#features" data-i18n="siteNavServices">Услуги</a><span aria-hidden="true">/</span>' : ''}<span aria-current="page" data-i18n="${page.headingKey}">${page.heading}</span></nav>`;
const pageHero = (page, links = []) => `<section class="site-page-hero"><div class="container">${breadcrumbs(page)}<h1 data-i18n="${page.headingKey}">${page.heading}</h1><p class="site-lead" data-i18n="${page.introKey}">${page.intro}</p>${page.group === 'services' ? '<div class="site-actions"><a class="btn btn-primary" href="#contact" data-i18n="heroBtnConsult">Обсудить объект</a></div>' : ''}${links.length ? `<nav class="site-section-nav" aria-label="Разделы страницы">${links.map(([href, key, label]) => `<a href="${href}" data-i18n="${key}">${label}</a>`).join('')}</nav>` : ''}</div></section>`;
const scopeCards = (cards) => cards.map(([titleKey, title, textKey, text]) => `<article class="site-scope-card"><h3 data-i18n="${titleKey}">${title}</h3><p data-i18n="${textKey}">${text}</p></article>`).join('\n');
const scope = {
    cctv: [
        ['cameraScopeTitle', 'Обзор нужных зон', 'cameraScopeText', 'Определяем точки установки камер с учётом входов, коридоров и критичных зон объекта.'],
        ['cameraArchiveTitle', 'Запись и архив', 'cameraArchiveText', 'Подбираем оборудование для записи и хранения видео, настраиваем просмотр архива.'],
        ['cameraAccessTitle', 'Просмотр и настройка', 'cameraAccessText', 'Согласуем, кому нужен доступ к камерам, и настроим просмотр с учётом выбранного оборудования и подключения.']
    ],
    alarm: [
        ['alarmZonesTitle', 'Зоны и датчики', 'alarmZonesText', 'Сначала определяем, какие помещения, входы и участки объекта требуют контроля.'],
        ['alarmEventsTitle', 'Тревожные сценарии', 'feature2Desc', 'Настраиваем датчики, тревожные сценарии и уведомления по событиям.'],
        ['alarmSetupTitle', 'Подключение и проверка', 'alarmSetupText', 'Согласуем способы уведомления, проверим работу выбранных сценариев и объясним управление системой.']
    ],
    service: [
        ['cap4Title', 'Интеграция без лишней замены', 'cap4Desc', 'Если часть оборудования уже установлена, сохраняем рабочую инфраструктуру и расширяем ее.'],
        ['serviceDataTitle', 'Данные и отчёты', 'serviceDataText', 'Проверяем возможности переноса пользователей и фотографий, настраиваем совместимые интеграции и отчёты.'],
        ['cap6Title', 'Сервис и развитие системы', 'cap6Desc', 'Берем на себя настройку, удаленную поддержку, обновления и дальнейшее расширение объекта.']
    ]
};
const related = (titleKey, title, textKey, text, href, linkKey, link) => `<section class="site-section site-muted"><div class="container"><div class="site-related"><div><h2 data-i18n="${titleKey}">${title}</h2><p data-i18n="${textKey}">${text}</p></div><a class="btn btn-primary" href="${href}" data-i18n="${linkKey}">${link}</a></div></div></section>`;
const outputs = new Map();
const shell = await read('templates/page.html');
for (const page of pages) {
    let body = '';
    if (page.id === 'home') body = render(await read('templates/pages/home.html'), values);
    if (page.id === 'access') body = pageHero(page, [['#packages', 'accessOfferCta', 'Сравнить комплекты'], ['#modernization', 'upgradeNav', 'Модернизация'], ['#faq', 'faqNav', 'Вопросы и ответы']]) + sections.packages + sections.modernization + sections.faq + sections.contact;
    if (scope[page.id]) {
        let extra = '';
        if (page.id === 'cctv') extra = related('floorLinkTitle', 'Камеры на этаж · без абонплаты', 'floorLinkDesc', '2 камеры HiLook, регистратор, HDD, монтаж и просмотр со смартфона.', '/videonablyudenie-dlya-etazha/', 'floorLinkCta', 'Посмотреть комплект для этажа');
        if (page.id === 'alarm') extra = related('connectedTitle', 'Нужны камеры или контроль доступа?', 'connectedText', 'Посмотрите связанные услуги — согласуем их совместную работу на вашем объекте.', '/#features', 'homeChooseService', 'Выбрать услугу');
        if (page.id === 'service') extra = related('upgradeCaseTitle', 'КазУТБ: сохранили Perco, добавили Face ID', 'upgradeCaseText', 'Доработали действующие турникеты, синхронизировали базу и настроили отчёты по посещаемости. Парк вырос с 7 до 10 турникетов без замены системы.', '/proekty/#case-kazutb', 'upgradeCaseLink', 'Посмотреть кейс и фотографии');
        body = render(await read('templates/pages/service.html'), { ...values, PAGE_HERO: pageHero(page), SCOPE_CARDS: scopeCards(scope[page.id]), RELATED: extra });
    }
    if (page.id === 'projects') {
        const projects = sections.projects.replace(/\s*<h2 class="section-title"[^>]*>.*?<\/h2>/, '').replace(/\s*<p class="section-subtitle"[^>]*>.*?<\/p>/, '').replaceAll('<h3 class="project-title"', '<h2 class="project-title"').replace(/(<h2 class="project-title"[^>]*>.*?)<\/h3>/g, '$1</h2>');
        body = pageHero(page, [['#case-kazutb', 'case1Title', 'КазУТБ: корпуса 1–3'], ['#case-sport', 'case2Title', 'Спортивный комплекс'], ['#case-dorm', 'case3Title', 'Общежитие']]) + projects + related('accessOfferTitle', 'Турникеты и Face ID Hikvision', 'accessOfferDesc', 'Готовые комплекты на вход и выход. Состав, возможности и условия монтажа на одной странице.', '/kontrol-dostupa/', 'accessOfferCta', 'Сравнить комплекты') + sections.contact;
    }
    if (page.id === 'about') body = pageHero(page, [['#about', 'companyApproach', 'Наш подход'], ['#process', 'processTitle', 'Как работаем'], ['#partners', 'partnersTitle', 'Наши партнеры']]) + sections.about.replace('data-i18n="aboutTitle">О компании SmartTech', 'data-i18n="companyApproach">Наш подход') + sections.process + sections.partners + sections.contact;
    if (page.id === 'contacts') body = pageHero(page) + sections.contact + `<section class="site-section"><div class="container site-about-summary"><h2 data-i18n="contactPrepareTitle">Что поможет с расчётом</h2><div><p data-i18n="contactPrepareText">Укажите город, тип объекта и задачу. Если есть план помещения, фотографии места установки или модель действующего оборудования — приложите их в WhatsApp.</p><a class="site-text-link" href="/#features" data-i18n="homeChooseService">Выбрать услугу</a></div></div></section>`;
    if (!body) throw new Error(`Нет контента для ${page.id}`);
    if (page.group === 'services') body = body.replaceAll('href="https://wa.me/77087262237"', `data-site-enquiry href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Здравствуйте! Интересует услуга «${page.heading}». Город и объект: `)}"`);
    const image = page.image ? `<meta property="og:image" content="${SITE_ORIGIN}${page.image}">\n    <meta name="twitter:image" content="${SITE_ORIGIN}${page.image}">` : '';
    const metaI18n = { kz: { title: page.title[1], description: page.description[1] }, en: { title: page.title[2], description: page.description[2] } };
    let html = render(shell, { TITLE: escape(page.title[0]), DESCRIPTION: escape(page.description[0]), CANONICAL: SITE_ORIGIN + page.path, IMAGE_META: image, HEADER: header(page.group), FOOTER: footer, BODY: body, PAGE_CLASS: `site-${page.id}`, PAGE_ID: page.id, META_I18N: json(metaI18n), MODAL: page.id === 'projects' ? await read('templates/partials/photo-modal.html') : '' });
    if (!page.image) html = html.replace('name="twitter:card" content="summary_large_image"', 'name="twitter:card" content="summary"');
    if (page.id === 'home') html = html.replace('</head>', `<script id="legacy-anchors" type="application/json">${json(legacyAnchors)}</script>\n</head>`);
    outputs.set(page.path.slice(1) + 'index.html', html);
}

let floor = await read('templates/cctv-floor.html');
for (const [key, [filename, alt, width, height]] of Object.entries(photos)) {
    const path = `public/images/cctv-floor/${filename}`;
    try { await access(new URL(path, root)); } catch { continue; }
    let occurrence = 0;
    floor = floor.replaceAll(`data-photo="${key}">`, () => {
        const loading = key === 'camera' && occurrence++ === 0 ? 'eager' : 'lazy';
        return `data-photo="${key}" data-has-photo="true"><img src="/${path}" alt="${escape(alt)}" width="${width}" height="${height}" loading="${loading}" decoding="async">`;
    });
}
outputs.set('videonablyudenie-dlya-etazha/index.html', render(floor, { ...values, HEADER: header('services', false), FOOTER: footer }));
const urls = [...pages.map(page => page.path), '/videonablyudenie-dlya-etazha/'];
outputs.set('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(path => `  <url><loc>${SITE_ORIGIN}${path}</loc></url>`).join('\n')}\n</urlset>\n`);
outputs.set('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
for (const [path, content] of outputs) {
    const html = content.replace(/[ \t]+$/gm, '');
    const destination = new URL(path, root);
    if (process.argv.includes('--check')) {
        if (await readFile(destination, 'utf8') !== html) throw new Error(`${path} устарел. Выполните npm run build.`);
    } else {
        await mkdir(new URL('./', destination), { recursive: true });
        await writeFile(destination, html);
    }
}
console.log(`${process.argv.includes('--check') ? 'Check' : 'Build'} OK: ${urls.length} страниц, sitemap.xml, robots.txt. Статический HTML для GitHub Pages.`);
