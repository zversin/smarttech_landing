// Мобильное меню
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Анимация гамбургера
    hamburger.classList.toggle('active');
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Изменение навбара при скролле
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.12)';
    } else {
        navbar.style.boxShadow = '0 6px 20px rgba(15, 23, 42, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Наблюдение за карточками
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Слайдеры для галерей
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const autoScrollDelay = 5000;

document.querySelectorAll('.photo-slider').forEach((slider) => {
    const track = slider.querySelector('.photo-gallery');
    const prev = slider.querySelector('.slider-btn.prev');
    const next = slider.querySelector('.slider-btn.next');

    if (!track || !prev || !next) {
        return;
    }

    const slides = Array.from(track.querySelectorAll('.gallery-img'));
    const dots = [];
    let autoTimer = null;

    const getStep = () => {
        const first = track.querySelector('.gallery-img');
        if (!first) {
            return track.clientWidth;
        }
        const styles = window.getComputedStyle(track);
        const gapValue = parseFloat(styles.gap || styles.columnGap || '0');
        const gap = Number.isNaN(gapValue) ? 0 : gapValue;
        return first.getBoundingClientRect().width + gap;
    };

    const getCurrentIndex = () => {
        if (!slides.length) {
            return 0;
        }
        const step = getStep();
        if (!step) {
            return 0;
        }
        return Math.min(slides.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
    };

    const updateButtons = () => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        prev.disabled = track.scrollLeft <= 0;
        next.disabled = track.scrollLeft >= maxScroll - 1;
    };

    const updateDots = () => {
        if (!dots.length) {
            return;
        }
        const currentIndex = getCurrentIndex();
        dots.forEach((dot, index) => {
            const isActive = index === currentIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    };

    const updateUI = () => {
        updateButtons();
        updateDots();
    };

    const scrollToIndex = (index) => {
        const step = getStep();
        track.scrollTo({ left: step * index, behavior: 'smooth' });
    };

    const stopAuto = () => {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    };

    const startAuto = () => {
        if (prefersReducedMotion || slides.length < 2) {
            return;
        }
        stopAuto();
        autoTimer = setInterval(() => {
            const step = getStep();
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (track.scrollLeft >= maxScroll - step * 0.5) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: step, behavior: 'smooth' });
            }
        }, autoScrollDelay);
    };

    if (slides.length > 1) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        dotsContainer.setAttribute('role', 'tablist');
        dotsContainer.setAttribute('aria-label', 'Фото объекта');

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'slider-dot';
            dot.setAttribute('aria-label', `Фото ${index + 1}`);
            dot.addEventListener('click', () => {
                stopAuto();
                scrollToIndex(index);
                startAuto();
            });
            dotsContainer.appendChild(dot);
            dots.push(dot);
        });

        slider.insertAdjacentElement('afterend', dotsContainer);

        dotsContainer.addEventListener('mouseenter', stopAuto);
        dotsContainer.addEventListener('mouseleave', startAuto);
        dotsContainer.addEventListener('focusin', stopAuto);
        dotsContainer.addEventListener('focusout', startAuto);
    }

    prev.addEventListener('click', () => {
        stopAuto();
        track.scrollBy({ left: -getStep(), behavior: 'smooth' });
        startAuto();
    });

    next.addEventListener('click', () => {
        stopAuto();
        track.scrollBy({ left: getStep(), behavior: 'smooth' });
        startAuto();
    });

    track.addEventListener('scroll', updateUI, { passive: true });
    window.addEventListener('resize', updateUI);

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin', stopAuto);
    slider.addEventListener('focusout', startAuto);

    track.addEventListener('touchstart', stopAuto, { passive: true });
    track.addEventListener('touchend', startAuto);

    updateUI();
    startAuto();
});
const modal = document.getElementById('photoModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const closeBtn = document.querySelector('.modal-close');
const prevBtn = document.querySelector('.modal-prev');
const nextBtn = document.querySelector('.modal-next');

let currentImages = [];
let currentIndex = 0;

// Открытие модального окна при клике на фото
document.querySelectorAll('.gallery-img').forEach((img, index, images) => {
    img.addEventListener('click', function() {
        modal.style.display = 'block';
        modalImg.src = this.src;
        modalCaption.textContent = this.alt;
        
        // Получаем все изображения в текущей галерее
        const gallery = this.closest('.photo-gallery');
        currentImages = Array.from(gallery.querySelectorAll('.gallery-img'));
        currentIndex = currentImages.indexOf(this);
    });
});

// Закрытие модального окна
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Закрытие при клике вне изображения
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Навигация по фотографиям
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    modalImg.src = currentImages[currentIndex].src;
    modalCaption.textContent = currentImages[currentIndex].alt;
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    modalImg.src = currentImages[currentIndex].src;
    modalCaption.textContent = currentImages[currentIndex].alt;
});

// Закрытие по клавише Escape, навигация стрелками
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
        } else if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    }
});
