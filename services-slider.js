// Native scrolling keeps touch, keyboard focus and the no-JavaScript layout usable.
document.querySelectorAll('[data-services-slider]').forEach((slider) => {
    const track = slider.querySelector('.services-track');
    const cards = [...track.querySelectorAll('.feature-card')];
    const controls = slider.querySelector('.service-slider-controls');
    const previous = slider.querySelector('[data-services-prev]');
    const next = slider.querySelector('[data-services-next]');
    const count = slider.querySelector('[data-services-count]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let pendingFrame = 0;

    slider.classList.add('services-ready');

    function update() {
        const max = track.scrollWidth - track.clientWidth;
        const scrollable = max > 2;
        controls.hidden = !scrollable;
        if (scrollable) track.setAttribute('tabindex', '0');
        else track.removeAttribute('tabindex');
        previous.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= max - 2;
        const visible = cards.filter(card => {
            const left = card.offsetLeft - track.scrollLeft;
            return left >= -2 && left + card.offsetWidth <= track.clientWidth + 2;
        });
        const first = visible.length ? cards.indexOf(visible[0]) : cards.reduce((nearest, card, index) =>
            Math.abs(card.offsetLeft - track.scrollLeft) < Math.abs(cards[nearest].offsetLeft - track.scrollLeft) ? index : nearest, 0);
        const last = visible.length ? cards.indexOf(visible[visible.length - 1]) : first;
        const number = index => String(index + 1).padStart(2, '0');
        const label = `${number(first)}${last > first ? `–${number(last)}` : ''} / ${number(cards.length - 1)}`;
        if (count.textContent !== label) count.textContent = label;
    }

    function show(card, behavior = reducedMotion.matches ? 'instant' : 'smooth') {
        if (!card) return;
        track.scrollTo({ left: card.offsetLeft, behavior });
    }

    function step(direction) {
        const candidates = cards.filter(card => direction > 0
            ? card.offsetLeft > track.scrollLeft + 2
            : card.offsetLeft < track.scrollLeft - 2);
        show(direction > 0 ? candidates[0] : candidates[candidates.length - 1]);
    }

    previous.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
    track.addEventListener('keydown', event => {
        if (event.target !== track) return;
        const actions = { ArrowLeft: () => step(-1), ArrowRight: () => step(1), Home: () => show(cards[0]), End: () => show(cards[cards.length - 1]) };
        if (!actions[event.key]) return;
        event.preventDefault();
        actions[event.key]();
    });
    track.addEventListener('scroll', () => {
        cancelAnimationFrame(pendingFrame);
        pendingFrame = requestAnimationFrame(update);
    }, { passive: true });
    track.addEventListener('focusin', event => {
        const card = event.target.closest('.feature-card');
        if (!card) return;
        const left = card.offsetLeft - track.scrollLeft;
        if (left < 0 || left + card.offsetWidth > track.clientWidth) show(card, 'instant');
    });

    // Footer and incoming links can open any service without leaving the landing.
    function revealHash(hash) {
        show(cards.find(card => `#${card.id}` === hash), 'instant');
    }
    document.addEventListener('click', event => {
        const link = event.target.closest('a[href]');
        if (!link) return;
        const url = new URL(link.href, location.href);
        if (url.origin === location.origin && url.pathname === location.pathname) revealHash(url.hash);
    });
    window.addEventListener('hashchange', () => revealHash(location.hash));
    new ResizeObserver(update).observe(track);
    update();
    revealHash(location.hash);
});
