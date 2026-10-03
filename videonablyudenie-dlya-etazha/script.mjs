import { FLOOR_CCTV_PRICE, WHATSAPP_NUMBER, DEFAULT_APARTMENTS, ADDITIONAL_CAMERA_PRICE, formatTenge, pricePerApartment, packagePrice, archiveDays, formatDays } from './config.mjs?v=4';

// Используем только уже подключённую аналитику. Системы и счётчики не создаём.
function track(name, properties = {}) {
    if (typeof window.gtag === 'function') window.gtag('event', name, properties);
    else if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...properties });
}

const whatsappUrl = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
document.querySelectorAll('[data-floor-price]').forEach((element) => { element.textContent = formatTenge(FLOOR_CCTV_PRICE); });
document.querySelectorAll('[data-default-share]').forEach((element) => { element.textContent = formatTenge(pricePerApartment(DEFAULT_APARTMENTS)); });
document.querySelectorAll('[data-whatsapp], .footer a[href*="wa.me/"]').forEach((link) => {
    link.href = whatsappUrl(`Здравствуйте! Интересует видеонаблюдение на этаж за ${formatTenge(FLOOR_CCTV_PRICE)} без абонентской платы. Хочу получить предложение.`);
    link.addEventListener('click', () => track('cctv_floor_whatsapp_click', { source: link.closest('footer') ? 'footer' : 'cta' }));
});

const calculator = document.querySelector('#apartments');
const output = document.querySelector('#apartment-price');
const form = document.querySelector('#floor-form');
const apartmentField = form.elements.namedItem('apartments');
const camerasControl = document.querySelector('#camera-count');
const diskControl = document.querySelector('#disk-size');
const bitrateControl = document.querySelector('#bitrate');
const selection = () => ({ cameras: Number(camerasControl.value), diskTb: Number(diskControl.value), bitrateMbps: Number(bitrateControl.value) });
const selectionText = () => {
    const { cameras, diskTb, bitrateMbps } = selection();
    return `Камер: ${cameras}; HDD: ${diskTb} ТБ; средний битрейт: ${bitrateMbps} Мбит/с на камеру; ориентир архива: ${formatDays(archiveDays(cameras, diskTb, bitrateMbps))} при записи 24/7.`;
};
document.querySelector('#camera-unit-price').textContent = formatTenge(ADDITIONAL_CAMERA_PRICE);
function updateCalculation() {
    const count = Number(calculator.value);
    const { cameras, diskTb, bitrateMbps } = selection();
    const total = packagePrice(cameras, diskTb);
    document.querySelector('#camera-count-value').textContent = cameras;
    document.querySelector('#package-price').textContent = formatTenge(total);
    document.querySelector('#archive-days').textContent = `≈ ${formatDays(archiveDays(cameras, diskTb, bitrateMbps))}`;
    output.textContent = formatTenge(total / count);
    apartmentField.value = String(count);
    document.querySelector('[data-calculator-whatsapp]').href = whatsappUrl(`Здравствуйте! Хочу обсудить расчёт видеонаблюдения. ${selectionText()} Ориентировочная стоимость с монтажом: ${formatTenge(total)}; квартир: ${count}; с квартиры: ${formatTenge(total / count)}.`);
}
for (const control of [calculator, camerasControl, diskControl, bitrateControl]) {
    control.addEventListener('input', updateCalculation);
    control.addEventListener('change', () => {
        updateCalculation();
        track('cctv_floor_calculator_change', { apartments: Number(calculator.value), ...selection() });
    });
}
updateCalculation();

const request = document.querySelector('#request');
request.addEventListener('toggle', () => {
    if (request.open) track('cctv_floor_form_open');
});
document.querySelectorAll('[data-form-open]').forEach((link) => {
    link.addEventListener('click', () => {
        request.open = true;
        form.elements.namedItem('name').focus({ preventScroll: true });
    });
});
if (location.hash === '#request') request.open = true;

const phone = form.elements.namedItem('phone');
phone.addEventListener('input', () => { phone.setCustomValidity(''); });
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(digits.length >= 10 && digits.length <= 15 && /^[+\d\s().-]+$/.test(phone.value) ? '' : 'Введите корректный телефон: от 10 до 15 цифр.');
    for (const name of ['name', 'address', 'entrance', 'floor']) {
        const input = form.elements.namedItem(name);
        input.value = input.value.trim();
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const count = Number(data.get('apartments'));
    const text = [
        'Здравствуйте! Хочу получить расчёт видеонаблюдения на этаж без абонентской платы.',
        `Имя: ${data.get('name')}`,
        `Телефон: ${data.get('phone')}`,
        `ЖК / адрес: ${data.get('address')}`,
        `Подъезд: ${data.get('entrance')}`,
        `Этаж: ${data.get('floor')}`,
        `Количество квартир: ${count}`,
        selectionText(),
        `Ориентировочная стоимость с монтажом: ${formatTenge(packagePrice(selection().cameras, selection().diskTb))}`,
        `Ориентировочно с квартиры: ${formatTenge(packagePrice(selection().cameras, selection().diskTb) / count)}`
    ].join('\n');
    const url = whatsappUrl(text);
    const status = document.querySelector('#form-status');
    status.textContent = 'Сообщение подготовлено. Отправьте его в WhatsApp, чтобы мы получили вашу заявку. Если WhatsApp не открылся, используйте ссылку ниже.';
    status.hidden = false;
    const retry = document.querySelector('#form-whatsapp');
    retry.href = url;
    retry.hidden = false;
    track('cctv_floor_form_submit', { channel: 'whatsapp_handoff', apartments: count });
    window.open(url, '_blank', 'noopener,noreferrer');
});
document.querySelector('#form-whatsapp').addEventListener('click', () => track('cctv_floor_whatsapp_click', { source: 'form' }));
document.querySelector('#floor-form-fields').disabled = false;
