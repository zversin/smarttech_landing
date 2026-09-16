
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

// Сохраняем входящие ссылки на разделы прежней главной страницы.
const legacyAnchors = JSON.parse(document.querySelector('#legacy-anchors')?.textContent || '{}');
function resolveLegacyAnchor() {
    if (document.getElementById(window.location.hash.slice(1))) return;
    const target = legacyAnchors[window.location.hash.slice(1)];
    if (target) window.location.replace(target);
}
resolveLegacyAnchor();
window.addEventListener('hashchange', resolveLegacyAnchor);

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(navMenu.classList.contains('active')));
    });

    document.querySelectorAll('.nav-menu a').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.focus();
        }
    });
}

document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const url = new URL(anchor.href, window.location.href);
        if (url.pathname !== window.location.pathname) return;
        const target = url.hash ? document.getElementById(url.hash.slice(1)) : null;
        if (!target) {
            return;
        }

        e.preventDefault();
        // Раскрываем форму до расчёта прокрутки, иначе высота страницы ограничит её.
        if (target instanceof HTMLDetailsElement) target.open = true;
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - (navbar?.offsetHeight || 70) - 16;
        window.scrollTo({
            top: offsetTop,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
        });
    });
});

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.12)';
        } else {
            navbar.style.boxShadow = '0 6px 20px rgba(15, 23, 42, 0.08)';
        }
    });
}
