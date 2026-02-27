(function () {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const navMenu = document.querySelector('[data-nav-menu]');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const pageKey = document.body.getAttribute('data-page');
    if (pageKey) {
        document.querySelectorAll('[data-nav-key]').forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('data-nav-key') === pageKey);
        });
    }

    const forms = document.querySelectorAll('.js-contact-form');

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function setFieldError(field, message) {
        const errorTarget = document.querySelector('[data-error-for="' + field.name + '"]');
        if (errorTarget) {
            errorTarget.textContent = message || '';
        }
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    forms.forEach(function (form) {
        const status = form.querySelector('.form-status');

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const name = form.querySelector('[name="name"]');
            const email = form.querySelector('[name="email"]');
            const organization = form.querySelector('[name="organization"]');
            const message = form.querySelector('[name="message"]');

            let hasError = false;

            if (!name || name.value.trim().length < 2) {
                hasError = true;
                if (name) {
                    setFieldError(name, 'Please enter your full name.');
                }
            } else {
                setFieldError(name, '');
            }

            if (!email || !validateEmail(email.value.trim())) {
                hasError = true;
                if (email) {
                    setFieldError(email, 'Please enter a valid work email address.');
                }
            } else {
                setFieldError(email, '');
            }

            if (!organization || organization.value.trim().length < 2) {
                hasError = true;
                if (organization) {
                    setFieldError(organization, 'Please add your organization name.');
                }
            } else {
                setFieldError(organization, '');
            }

            if (!message || message.value.trim().length < 15) {
                hasError = true;
                if (message) {
                    setFieldError(message, 'Please share project details (at least 15 characters).');
                }
            } else {
                setFieldError(message, '');
            }

            if (!status) {
                return;
            }

            status.classList.remove('is-success', 'is-error');

            if (hasError) {
                status.classList.add('is-error');
                status.textContent = 'Please review the highlighted fields and try again.';
                return;
            }

            status.classList.add('is-success');
            status.textContent = 'Thanks. Your request is captured locally. Please also message us on WhatsApp for the fastest response.';
            form.reset();
        });
    });
})();
