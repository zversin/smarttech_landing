(() => {
    'use strict';

    const id = Number(document.currentScript?.dataset.counter);
    if (!Number.isSafeInteger(id) || id <= 0) return;
    if (!['smarttech.asia', 'www.smarttech.asia'].includes(window.location.hostname)) return;

    const goals = new Set(['calculator_open', 'calculator_change', 'whatsapp_click', 'phone_click', 'form_whatsapp_handoff']);
    const paths = new Map([
        ['/kontrol-dostupa/', 'access'],
        ['/dlya-zhilyh-kompleksov/', 'residential'],
        ['/videonablyudenie-dlya-etazha/', 'cctv_floor']
    ]);
    const calculator = paths.get(window.location.pathname) || 'none';
    const enums = {
        calculator: new Set(['none', 'access', 'residential', 'cctv_floor']),
        source: new Set(['floating', 'footer', 'calculator', 'form', 'cta']),
        model: new Set(['341', '670QR', '673DX'])
    };
    const ranges = { lanes: [1, 5], directions: [1, 2], tier: [1, 3], apartments: [1, 20], cameras: [1, 4], diskTb: [0, 4], bitrateMbps: [1, 4] };

    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = window.ym.l || Date.now();
    // WhatsApp URLs can contain customer messages. Track only explicit, sanitized
    // events instead of sending outbound URLs or form contents to the counter.
    window.ym(id, 'init', { clickmap: false, trackLinks: false, accurateTrackBounce: true, webvisor: false });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.head.appendChild(tag);

    function track(name, input = {}) {
        if (!goals.has(name)) return;
        const params = { calculator };
        for (const [key, allowed] of Object.entries(enums)) {
            if (allowed.has(input[key])) params[key] = input[key];
        }
        for (const [key, [min, max]] of Object.entries(ranges)) {
            if (Number.isInteger(input[key]) && input[key] >= min && input[key] <= max) params[key] = input[key];
        }
        // Visit parameters work without creating goal definitions in the account.
        window.ym(id, 'params', { smarttech_actions: { [name]: 'yes' }, smarttech_context: params });
        window.ym(id, 'reachGoal', name, params);
    }
    window.smarttechAnalytics = { track };

    function selection() {
        const result = {};
        const names = { lanes: 'lanes', directions: 'directions', tier: 'tier', apartments: 'apartments', model: 'model' };
        for (const [name, key] of Object.entries(names)) {
            const value = document.querySelector(`[data-calculator] [name="${name}"]`)?.value;
            if (value !== undefined) result[key] = key === 'model' ? value : Number(value);
        }
        const ids = { 'camera-count': 'cameras', 'disk-size': 'diskTb', bitrate: 'bitrateMbps', apartments: 'apartments' };
        if (calculator === 'cctv_floor') {
            for (const [name, key] of Object.entries(ids)) {
                const element = document.getElementById(name);
                if (element) result[key] = Number(element.value);
            }
        }
        return result;
    }

    document.addEventListener('click', event => {
        const link = event.target.closest?.('a[href]');
        if (!link) return;
        let url;
        try { url = new URL(link.href, window.location.href); } catch { return; }
        if (url.protocol === 'tel:') {
            track('phone_click');
        } else if (url.protocol === 'https:' && ['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname)) {
            const source = link.closest('footer') ? 'footer'
                : link.classList.contains('floating-wa') ? 'floating'
                : link.matches('[data-quote], [data-calculator-whatsapp]') ? 'calculator'
                : link.id === 'form-whatsapp' ? 'form' : 'cta';
            track('whatsapp_click', { source, ...selection() });
        }
    }, true);

    document.addEventListener('change', event => {
        const control = event.target;
        const supported = ['lanes', 'directions', 'tier', 'apartments', 'model'].includes(control.name)
            && control.closest?.('[data-calculator]');
        const floor = calculator === 'cctv_floor' && ['camera-count', 'disk-size', 'bitrate', 'apartments'].includes(control.id);
        if (supported || floor) track('calculator_change', selection());
    });

    if ('IntersectionObserver' in window) {
        const seen = new WeakSet();
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (!entry.isIntersecting || seen.has(entry.target)) continue;
                seen.add(entry.target);
                track('calculator_open');
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.15 });
        document.querySelectorAll('[data-calculator], #calculator-title').forEach(element => observer.observe(element));
    }

    document.addEventListener('smarttech-analytics', event => {
        if (event.detail?.name === 'form_whatsapp_handoff') track('form_whatsapp_handoff', event.detail.params);
    });
})();
