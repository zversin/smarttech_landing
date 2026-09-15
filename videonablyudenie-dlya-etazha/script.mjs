import { FLOOR_CCTV_PRICE, WHATSAPP_NUMBER, DEFAULT_APARTMENTS, formatTenge, pricePerApartment } from './config.mjs';

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
function updateCalculation() {
    const count = Number(calculator.value);
    output.textContent = formatTenge(pricePerApartment(count));
    apartmentField.value = String(count);
}
calculator.addEventListener('change', () => {
    updateCalculation();
    track('cctv_floor_calculator_change', { apartments: Number(calculator.value) });
});
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
        `Базовый комплект за этаж: ${formatTenge(FLOOR_CCTV_PRICE)}`,
        `Ориентировочно с квартиры: ${formatTenge(pricePerApartment(count))}`
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
