
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const targetSelector = anchor.getAttribute('href');
        const target = targetSelector ? document.querySelector(targetSelector) : null;
        if (!target) {
            return;
        }

        e.preventDefault();
        const offsetTop = target.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
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

const featureCards = document.querySelectorAll('.feature-card');
if (featureCards.length) {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        featureCards.forEach((card) => {
            card.style.opacity = '0';
            observer.observe(card);
        });
    } else {
        featureCards.forEach((card) => {
            card.style.opacity = '1';
        });
    }
}

const textBindings = {
    navHome: '.nav-menu li:nth-child(1) a',
    navSolutions: '.nav-menu li:nth-child(2) a',
    navCapabilities: '.nav-menu li:nth-child(3) a',
    navCases: '.nav-menu li:nth-child(4) a',
    navProcess: '.nav-menu li:nth-child(5) a',
    navAbout: '.nav-menu li:nth-child(6) a',
    navContacts: '.nav-menu li:nth-child(7) a',

    heroTitle: '#hero .hero-title',
    heroSubtitle: '#hero .hero-subtitle',
    heroBtnConsult: '#hero .hero-buttons .btn-primary',
    heroBtnCases: '#hero .hero-buttons .btn-secondary',
    heroTrust1: '#hero .hero-trust span:nth-child(1)',
    heroTrust2: '#hero .hero-trust span:nth-child(2)',
    heroTrust3: '#hero .hero-trust span:nth-child(3)',
    heroTrust4: '#hero .hero-trust span:nth-child(4)',

    featuresTitle: '#features .section-title',
    feature1Title: '#features .feature-card:nth-of-type(1) h3',
    feature1Desc: '#features .feature-card:nth-of-type(1) p',
    feature2Title: '#features .feature-card:nth-of-type(2) h3',
    feature2Desc: '#features .feature-card:nth-of-type(2) p',
    feature3Title: '#features .feature-card:nth-of-type(3) h3',
    feature3Desc: '#features .feature-card:nth-of-type(3) p',
    feature4Title: '#features .feature-card:nth-of-type(4) h3',
    feature4Desc: '#features .feature-card:nth-of-type(4) p',

    capabilitiesTitle: '#capabilities .section-title',
    capabilitiesSubtitle: '#capabilities .section-subtitle',
    cap1Title: '#capabilities .capability-item:nth-of-type(1) h3',
    cap1Desc: '#capabilities .capability-item:nth-of-type(1) p',
    cap2Title: '#capabilities .capability-item:nth-of-type(2) h3',
    cap2Desc: '#capabilities .capability-item:nth-of-type(2) p',
    cap3Title: '#capabilities .capability-item:nth-of-type(3) h3',
    cap3Desc: '#capabilities .capability-item:nth-of-type(3) p',
    cap4Title: '#capabilities .capability-item:nth-of-type(4) h3',
    cap4Desc: '#capabilities .capability-item:nth-of-type(4) p',
    cap5Title: '#capabilities .capability-item:nth-of-type(5) h3',
    cap5Desc: '#capabilities .capability-item:nth-of-type(5) p',
    cap6Title: '#capabilities .capability-item:nth-of-type(6) h3',
    cap6Desc: '#capabilities .capability-item:nth-of-type(6) p',

    projectsTitle: '#projects .section-title',
    projectsSubtitle: '#projects .section-subtitle',

    case1Title: '#projects .project-item:nth-of-type(1) .project-title',
    case1Desc: '#projects .project-item:nth-of-type(1) .project-description',
    case1What: '#projects .project-item:nth-of-type(1) .equipment-info p:nth-of-type(1) strong',
    case1Result: '#projects .project-item:nth-of-type(1) .equipment-info p:nth-of-type(2) strong',
    case1What1: '#projects .project-item:nth-of-type(1) .equipment-info ul:nth-of-type(1) li:nth-of-type(1)',
    case1What2: '#projects .project-item:nth-of-type(1) .equipment-info ul:nth-of-type(1) li:nth-of-type(2)',
    case1What3: '#projects .project-item:nth-of-type(1) .equipment-info ul:nth-of-type(1) li:nth-of-type(3)',
    case1Result1: '#projects .project-item:nth-of-type(1) .equipment-info ul:nth-of-type(2) li:nth-of-type(1)',
    case1Result2: '#projects .project-item:nth-of-type(1) .equipment-info ul:nth-of-type(2) li:nth-of-type(2)',

    case2Title: '#projects .project-item:nth-of-type(2) .project-title',
    case2Desc: '#projects .project-item:nth-of-type(2) .project-description',
    case2What: '#projects .project-item:nth-of-type(2) .equipment-info p:nth-of-type(1) strong',
    case2Result: '#projects .project-item:nth-of-type(2) .equipment-info p:nth-of-type(2) strong',
    case2What1: '#projects .project-item:nth-of-type(2) .equipment-info ul:nth-of-type(1) li:nth-of-type(1)',
    case2What2: '#projects .project-item:nth-of-type(2) .equipment-info ul:nth-of-type(1) li:nth-of-type(2)',
    case2What3: '#projects .project-item:nth-of-type(2) .equipment-info ul:nth-of-type(1) li:nth-of-type(3)',
    case2Result1: '#projects .project-item:nth-of-type(2) .equipment-info ul:nth-of-type(2) li:nth-of-type(1)',
    case2Result2: '#projects .project-item:nth-of-type(2) .equipment-info ul:nth-of-type(2) li:nth-of-type(2)',

    case3Title: '#projects .project-item:nth-of-type(3) .project-title',
    case3Desc: '#projects .project-item:nth-of-type(3) .project-description',
    case3What: '#projects .project-item:nth-of-type(3) .equipment-info p:nth-of-type(1) strong',
    case3Result: '#projects .project-item:nth-of-type(3) .equipment-info p:nth-of-type(2) strong',
    case3What1: '#projects .project-item:nth-of-type(3) .equipment-info ul:nth-of-type(1) li:nth-of-type(1)',
    case3What2: '#projects .project-item:nth-of-type(3) .equipment-info ul:nth-of-type(1) li:nth-of-type(2)',
    case3What3: '#projects .project-item:nth-of-type(3) .equipment-info ul:nth-of-type(1) li:nth-of-type(3)',
    case3Result1: '#projects .project-item:nth-of-type(3) .equipment-info ul:nth-of-type(2) li:nth-of-type(1)',
    case3Result2: '#projects .project-item:nth-of-type(3) .equipment-info ul:nth-of-type(2) li:nth-of-type(2)',

    processTitle: '#process .section-title',
    processSubtitle: '#process .section-subtitle',
    process1Title: '#process .process-step:nth-of-type(1) h3',
    process1Desc: '#process .process-step:nth-of-type(1) p',
    process2Title: '#process .process-step:nth-of-type(2) h3',
    process2Desc: '#process .process-step:nth-of-type(2) p',
    process3Title: '#process .process-step:nth-of-type(3) h3',
    process3Desc: '#process .process-step:nth-of-type(3) p',

    aboutTitle: '#about .section-title',
    aboutP1: '#about .about-text p:nth-of-type(1)',
    aboutP2: '#about .about-text p:nth-of-type(2)',
    aboutP3: '#about .about-text p:nth-of-type(3)',
    aboutBtn: '#about .about-text .btn',
    aboutTeam: '#about .image-placeholder span',

    partnersTitle: '#partners .section-title',
    partner1Subtitle: '#partners .partner-card:nth-of-type(1) > p:nth-of-type(1)',
    partner1Desc: '#partners .partner-card:nth-of-type(1) .partner-description',
    partner2Subtitle: '#partners .partner-card:nth-of-type(2) > p:nth-of-type(1)',
    partner2Desc: '#partners .partner-card:nth-of-type(2) .partner-description',
    partner3Subtitle: '#partners .partner-card:nth-of-type(3) > p:nth-of-type(1)',
    partner3Desc: '#partners .partner-card:nth-of-type(3) .partner-description',

    contactTitle: '#contact .section-title',
    contactSubtitle: '#contact .contact-subtitle',
    contactCardTitle: '#contact .contact-card-text h3',
    contactCardDesc: '#contact .contact-card-text p',
    contactBtnWa: '#contact .contact-actions .btn-primary',
    contactBtnIg: '#contact .contact-actions .btn-secondary',
    contactMeta1: '#contact .contact-meta span:nth-of-type(1)',
    contactMeta2: '#contact .contact-meta span:nth-of-type(2)',
    contactMeta3: '#contact .contact-meta span:nth-of-type(3)',

    footerRights: '.footer .container > p:nth-of-type(1)',
    footerPartners: '.footer .container > p:nth-of-type(2)',

    floatingWaText: '.floating-wa'
};

const defaultTexts = {};
Object.entries(textBindings).forEach(([key, selector]) => {
    const element = document.querySelector(selector);
    defaultTexts[key] = element ? element.textContent.trim() : '';
});

const defaultMetaTitle = document.title;
const defaultMetaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

const defaultUi = {
    sliderPrev: document.querySelector('.slider-btn.prev')?.getAttribute('aria-label') || 'Прокрутить влево',
    sliderNext: document.querySelector('.slider-btn.next')?.getAttribute('aria-label') || 'Прокрутить вправо',
    sliderGroup: 'Фото объекта',
    sliderItem: 'Фото',
    modalPrev: 'Предыдущее фото',
    modalNext: 'Следующее фото',
    modalClose: 'Закрыть',
    floatingWaAria: document.querySelector('.floating-wa')?.getAttribute('aria-label') || 'Написать в WhatsApp'
};
const i18n = {
    kz: {
        metaTitle: 'SmartTech - бейнебақылау, дабыл, турникеттер',
        metaDescription: 'SmartTech - Қазақстандағы периметрді қорғау жүйелері: бейнебақылау, дабыл, турникеттер және қолжетімділікті бақылау. Астана.',
        ui: {
            sliderPrev: 'Солға жылжыту',
            sliderNext: 'Оңға жылжыту',
            sliderGroup: 'Нысан фотолары',
            sliderItem: 'Фото',
            modalPrev: 'Алдыңғы фото',
            modalNext: 'Келесі фото',
            modalClose: 'Жабу',
            floatingWaAria: 'WhatsApp-қа жазу'
        },
        text: {
            navHome: 'Басты бет',
            navSolutions: 'Жүйелер',
            navCapabilities: 'Мүмкіндіктер',
            navCases: 'Кейстер',
            navProcess: 'Қалай жұмыс істейміз',
            navAbout: 'Компания туралы',
            navContacts: 'Байланыс',

            heroTitle: 'SmartTech - бейнебақылау, дабыл, турникеттер',
            heroSubtitle: 'Камера, дабыл, турникет және қолжетімділікті бақылау жүйелерін орнатамыз. Нысанға шығып, сызбаны таңдап, жүйені сіздің жұмыс тәртібіңізге сай іске қосамыз.',
            heroBtnConsult: 'Нысанды талқылау',
            heroBtnCases: 'Кейстерді көру',
            heroTrust1: 'Астана',
            heroTrust2: 'Мектептер, кеңселер, қоймалар',
            heroTrust3: 'Қазақстан бойынша шығамыз',
            heroTrust4: 'Келісімшарт және сервис',

            featuresTitle: 'Не орнатамыз',
            feature1Title: 'Бейнебақылау',
            feature1Desc: 'Камераларды, жазбаны, архивті және нысанның маңызды аймақтарын бақылауды таңдаймыз.',
            feature2Title: 'Күзет дабылы',
            feature2Desc: 'Датчиктерді, дабыл сценарийлерін және оқиғалар бойынша хабарламаларды баптаймыз.',
            feature3Title: 'Турникеттер және қолжетімділікті бақылау',
            feature3Desc: 'Турникеттерді, Face ID, карталарды және қызметкерлер мен келушілердің өту есебін орнатамыз.',
            feature4Title: 'Интеграция және сервис',
            feature4Desc: 'Күзет жүйелерін өзара және нысандағы қолданыстағы инфрақұрылыммен байланыстырамыз.',

            capabilitiesTitle: 'Нысан не алады',
            capabilitiesSubtitle: 'Периметрді қорғау, бейнебақылау және қолжетімділікті бақылау жүйелері іс жүзінде қалай жұмыс істейді',
            cap1Title: 'Периметр мен кіру аймақтарын бақылау',
            cap1Desc: 'Өткізу бекеттерін, қызметтік аймақтарды және маңызды нүктелерді бір қауіпсіздік контурына біріктіреміз.',
            cap2Title: 'Оқиғалар туралы жедел хабарлама',
            cap2Desc: 'Қолжетімділік бұзушылықтарына, қозғалысқа және инциденттерге байланысты дабылдар мен хабарламаларды баптаймыз.',
            cap3Title: 'Архив және инциденттерді талдау',
            cap3Desc: 'Бейнежазбаны, өту тарихын және оқиғаларды сақтап, жағдайды тез қалпына келтіруге мүмкіндік береміз.',
            cap4Title: 'Артық ауыстырусыз интеграция',
            cap4Desc: 'Егер жабдықтың бір бөлігі орнатылған болса, жұмыс істеп тұрған инфрақұрылымды сақтап, кеңейтеміз.',
            cap5Title: 'Басшылыққа арналған бақылау',
            cap5Desc: 'Қолмен есепсіз өту, қатысу және қауіпсіздік оқиғалары бойынша түсінікті есептер береміз.',
            cap6Title: 'Жүйені сервистеу және дамыту',
            cap6Desc: 'Баптауды, қашықтан қолдауды, жаңартуларды және нысанды әрі қарай кеңейтуді өз мойнымызға аламыз.',

            projectsTitle: 'Кейстер',
            projectsSubtitle: 'Қауіпсіздікті күшейтіп, қолданыстағы инфрақұрылымды сақтаған нысандар мысалдары',

            case1Title: 'ҚазУТБ: 1-3 корпустар',
            case1Desc: 'Ауыстырмай жаңғырту: Perco жүйесін сақтап, Face ID және кесте бойынша аналитика қостық.',
            case1What: 'Не жасадық:',
            case1Result: 'Нәтиже:',
            case1What1: 'Perco KT-02.9 және Perco Web сақталып, турникеттер Face ID-ге бейімделді.',
            case1What2: 'Әр турникетке 2 Face ID орнатылып, база синхрондалды.',
            case1What3: 'Оқытушылар мен студенттердің қатысуы бойынша есептер бапталды.',
            case1Result1: 'Жүйені алмастырмай турникет санын 7-ден 10-ға дейін арттырдық.',
            case1Result2: 'Кесте қимасында қатысу бойынша бірыңғай есептілік алынды.',

            case2Title: '🏃 Спорт кешені',
            case2Desc: 'Жаңа нысан: қолжетімділікті іске қосып, Perco Web-тен Hik Central-ға фотоларды көшірдік.',
            case2What: 'Не жасадық:',
            case2Result: 'Нәтиже:',
            case2What1: 'Спорт кешенінде қолжетімділік контуры енгізілді.',
            case2What2: 'Perco Web-тен фото және пайдаланушылар базасы Hik Central-ға көшірілді.',
            case2What3: 'Қолжетімділік құқықтары мен қатысу есебі бапталды.',
            case2Result1: 'Фото мен деректерді қайта жинамай іске қосылды.',
            case2Result2: 'Бірінші күннен дайын қолжетімділік контуры іске қосылды.',

            case3Title: '🏠 Жатақхана',
            case3Desc: 'Жаңа нысан: деректерді көшіру және МФЦ есебі үшін Z5R Web интеграциясы.',
            case3What: 'Не жасадық:',
            case3Result: 'Нәтиже:',
            case3What1: 'Жатақханада жаңа қолжетімділік контуры енгізілді.',
            case3What2: 'Фото және пайдаланушы деректері автоматты көшірілді.',
            case3What3: 'МФЦ есебі үшін турникеттер Z5R Web-пен интеграцияланды.',
            case3Result1: 'МФЦ-де есеп пен есептілік қолмен енгізусіз қолжетімді болды.',
            case3Result2: 'Пайдаланушылар базасы деректер жоғалтусыз көшірілді.',

            processTitle: 'Қалай жұмыс істейміз',
            processSubtitle: 'Нысанға шығудан бастап іске қосу мен сервистеуге дейін ашық әрі кезең-кезеңімен',
            process1Title: 'Нысанға шығу және аудит',
            process1Desc: 'Өту нүктелерін, периметрді, тәуекелдерді және қауіпсіздік талаптарын қараймыз.',
            process2Title: 'Жоба, смета және келісу',
            process2Desc: 'Жабдықты, монтаж сызбасын, бюджетті және іске қосу мерзімдерін таңдаймыз.',
            process3Title: 'Монтаж, іске қосу және сүйемелдеу',
            process3Desc: 'Жүйені орнатып, қолжетімділікті баптап, іске қосылғаннан кейін сервисте қаламыз.',

            aboutTitle: 'SmartTech компаниясы туралы',
            aboutP1: 'Біз Астана мен Қазақстан бойынша периметрді қорғау жүйелерін орнатамыз: бейнебақылау, күзет дабылы, турникеттер және бизнеске, оқу орындарына және басқа нысандарға арналған қолжетімділікті бақылау.',
            aboutP2: 'Егер нысанда жабдықтың немесе бағдарламалық контурдың бір бөлігі бар болса, жұмыс істеп тұрған схеманы себепсіз бұзбаймыз: тиімді бөлігін сақтап, жаңасын дұрыс интеграциялаймыз.',
            aboutP3: 'Келісімшартпен ресми жұмыс істейміз: нысанға шығып, шешім таңдап, монтаж бен іске қосуды орындаймыз және кейін жүйені сүйемелдейміз.',
            aboutBtn: 'Жобаны талқылау',
            aboutTeam: 'SmartTech командасы',

            partnersTitle: 'Біздің серіктестер',
            partner1Subtitle: 'Қазақстандық технологиялар және бизнес университеті',
            partner1Desc: 'Білім беру саласындағы серіктес. Университет нысандарында қолжетімділікті бақылау, өту есебі және қауіпсіздікті күшейту жобаларын орындаймыз.',
            partner2Subtitle: 'Толық циклді ивент-агенттік',
            partner2Desc: 'Іс-шаралар саласындағы серіктес. Қолжетімділік, қауіпсіздік және адамдар ағынын ұйымдастыру бойынша бірге жұмыс істейміз.',
            partner3Subtitle: 'Ас үй және интерьер студиясы',
            partner3Desc: 'Коммерциялық сектордағы серіктес. Сервис пен сатуға арналған камералар, қолжетімділік және цифрлық процестерді баптаймыз.',

            contactTitle: 'Нысанға сай жүйе таңдап береміз',
            contactSubtitle: 'WhatsApp немесе Instagram-ға жазыңыз. Фото, жоспар немесе қысқа сипаттама жіберсеңіз де болады.',
            contactCardTitle: 'Нысанды сипаттаңыз немесе фото жіберіңіз',
            contactCardDesc: 'Не қойған дұрыс екенін, қазіргінің қай бөлігін қалдыруға болатынын және шамамен қандай бюджет керегін айтамыз.',
            contactBtnWa: 'WhatsApp-қа жазу',
            contactBtnIg: 'Instagram',
            contactMeta1: 'WhatsApp: +77087262237',
            contactMeta2: 'Instagram: @smarttechastana',
            contactMeta3: 'Астана • Қазақстан бойынша шығамыз',

            footerRights: '© 2026 SmartTech. Барлық құқықтар қорғалған.',
            footerPartners: 'Серіктестер: КазУТБ | TRC Event Agency | Kitchen Premium',

            floatingWaText: 'WhatsApp'
        }
    },
    en: {
        metaTitle: 'SmartTech - CCTV, alarms, turnstiles',
        metaDescription: 'SmartTech delivers perimeter security systems in Kazakhstan: CCTV, intrusion alarms, turnstiles, and access control. Based in Astana.',
        ui: {
            sliderPrev: 'Scroll left',
            sliderNext: 'Scroll right',
            sliderGroup: 'Object photos',
            sliderItem: 'Photo',
            modalPrev: 'Previous photo',
            modalNext: 'Next photo',
            modalClose: 'Close',
            floatingWaAria: 'Write to WhatsApp'
        },
        text: {
            navHome: 'Home',
            navSolutions: 'Systems',
            navCapabilities: 'Capabilities',
            navCases: 'Case Studies',
            navProcess: 'How We Work',
            navAbout: 'About',
            navContacts: 'Contacts',

            heroTitle: 'SmartTech - CCTV, alarms, turnstiles',
            heroSubtitle: 'We install CCTV, alarms, turnstiles, and access control. We visit the site, choose the right layout, and launch the system around your actual workflow.',
            heroBtnConsult: 'Discuss Your Site',
            heroBtnCases: 'View Cases',
            heroTrust1: 'Astana',
            heroTrust2: 'Schools, offices, warehouses',
            heroTrust3: 'On-site work across Kazakhstan',
            heroTrust4: 'Contract and maintenance',

            featuresTitle: 'What We Install',
            feature1Title: 'CCTV',
            feature1Desc: 'We select cameras, recording, archive storage, and coverage for the critical zones of your site.',
            feature2Title: 'Intrusion Alarms',
            feature2Desc: 'We configure detectors, alarm scenarios, and notifications for security events.',
            feature3Title: 'Turnstiles and Access Control',
            feature3Desc: 'We install turnstiles, Face ID, access cards, and passage tracking for staff and visitors.',
            feature4Title: 'Integration and Service',
            feature4Desc: 'We connect security systems with each other and with the existing infrastructure of your site.',

            capabilitiesTitle: 'What Your Site Gets',
            capabilitiesSubtitle: 'How perimeter security, CCTV, and access control systems work in practice',
            cap1Title: 'Perimeter and Entrance Control',
            cap1Desc: 'We secure checkpoints, staff-only areas, and critical points of the site in one safety contour.',
            cap2Title: 'Fast Event Notifications',
            cap2Desc: 'We configure alarms, notifications, and responses to access violations, movement, and incidents.',
            cap3Title: 'Archive and Incident Review',
            cap3Desc: 'We retain video, passage history, and event data so incidents can be reconstructed quickly.',
            cap4Title: 'Integration Without Unnecessary Replacement',
            cap4Desc: 'If part of the equipment is already installed, we preserve the working infrastructure and extend it.',
            cap5Title: 'Management Visibility',
            cap5Desc: 'We provide clear reporting on passage logs, attendance, and security events without manual tracking.',
            cap6Title: 'Service and System Growth',
            cap6Desc: 'We handle setup, remote support, updates, and further expansion of the site.',

            projectsTitle: 'Case Studies',
            projectsSubtitle: 'Examples of sites where we improved security while preserving the existing infrastructure',

            case1Title: 'KazUTB: Buildings 1-3',
            case1Desc: 'Modernization without replacement: we kept Perco and added Face ID with schedule-based analytics.',
            case1What: 'What we did:',
            case1Result: 'Result:',
            case1What1: 'Kept Perco KT-02.9 and Perco Web, and modified turnstiles for Face ID.',
            case1What2: 'Installed 2 Face ID devices per turnstile and synchronized the user base.',
            case1What3: 'Configured attendance reports for faculty and students.',
            case1Result1: 'Increased turnstiles from 7 to 10 without replacing the system.',
            case1Result2: 'Delivered unified attendance reporting tied to class schedules.',

            case2Title: '🏃 Sports Complex',
            case2Desc: 'New facility: we launched access control and migrated photos from Perco Web to Hik Central.',
            case2What: 'What we did:',
            case2Result: 'Result:',
            case2What1: 'Deployed the access control environment in the sports complex.',
            case2What2: 'Migrated photos and user records from Perco Web to Hik Central.',
            case2What3: 'Configured access rights and attendance tracking.',
            case2Result1: 'Go-live without rebuilding photo and user data from scratch.',
            case2Result2: 'Operational access control from day one.',

            case3Title: '🏠 Dormitory',
            case3Desc: 'New facility with data migration and Z5R Web integration for MFC reporting.',
            case3What: 'What we did:',
            case3Result: 'Result:',
            case3What1: 'Deployed a new access control environment in the dormitory.',
            case3What2: 'Automatically migrated photos and user records.',
            case3What3: 'Integrated turnstiles with Z5R Web for MFC tracking.',
            case3Result1: 'Tracking and reporting are available in MFC without manual input.',
            case3Result2: 'User database migrated without data loss.',

            processTitle: 'How We Work',
            processSubtitle: 'Transparent and step-by-step, from site survey to launch and maintenance',
            process1Title: 'Site Survey and Audit',
            process1Desc: 'We review entry points, perimeter risks, and security requirements.',
            process2Title: 'Design, Quote, and Approval',
            process2Desc: 'We select equipment, define the installation layout, and agree on budget and timeline.',
            process3Title: 'Installation, Launch, and Support',
            process3Desc: 'We install the system, configure access, and stay involved after go-live.',

            aboutTitle: 'About SmartTech',
            aboutP1: 'We install perimeter security systems in Astana and across Kazakhstan: CCTV, intrusion alarms, turnstiles, and access control for businesses, educational facilities, and other sites.',
            aboutP2: 'If a site already has some equipment or software in place, we do not break what works: we preserve the reliable parts and integrate the new layer properly.',
            aboutP3: 'We work officially under contract: visit the site, select the solution, complete installation and commissioning, and support the system after launch.',
            aboutBtn: 'Discuss Your Project',
            aboutTeam: 'SmartTech Team',

            partnersTitle: 'Our Partners',
            partner1Subtitle: 'Kazakhstan University of Technology and Business',
            partner1Desc: 'Education sector partner. We implement access control, passage tracking, and security upgrades on university facilities.',
            partner2Subtitle: 'Full-Service Event Agency',
            partner2Desc: 'Event industry partner. We support access control, safety, and visitor flow organization for temporary infrastructure.',
            partner3Subtitle: 'Kitchen and Interior Studio',
            partner3Desc: 'Commercial-sector partner. We set up cameras, access control, and digital operations for service and sales.',

            contactTitle: 'We Will Select the Right System for Your Site',
            contactSubtitle: 'Message us on WhatsApp or Instagram. You can simply send a photo, a floor plan, or a short description of the task.',
            contactCardTitle: 'Describe the Site or Send a Photo',
            contactCardDesc: 'We will tell you what makes sense to install, what can stay from the current setup, and the rough budget range.',
            contactBtnWa: 'Message on WhatsApp',
            contactBtnIg: 'Instagram',
            contactMeta1: 'WhatsApp: +77087262237',
            contactMeta2: 'Instagram: @smarttechastana',
            contactMeta3: 'Astana • on-site work across Kazakhstan',

            footerRights: '© 2026 SmartTech. All rights reserved.',
            footerPartners: 'Partners: KazUTB | TRC Event Agency | Kitchen Premium',

            floatingWaText: 'WhatsApp'
        }
    }
};

let currentLanguage = 'ru';
function resolveInitialLanguage() {
    let savedLanguage = '';
    try {
        savedLanguage = localStorage.getItem('smarttech_lang') || '';
    } catch (error) {
        savedLanguage = '';
    }

    if (savedLanguage && (savedLanguage === 'ru' || savedLanguage === 'kz' || savedLanguage === 'en')) {
        return savedLanguage;
    }

    const browserLanguage = (navigator.language || '').toLowerCase();
    if (browserLanguage.startsWith('kk') || browserLanguage.startsWith('kz')) {
        return 'kz';
    }
    if (browserLanguage.startsWith('en')) {
        return 'en';
    }
    return 'ru';
}

function uiByLanguage(lang) {
    if (lang === 'ru') {
        return defaultUi;
    }
    return i18n[lang]?.ui || defaultUi;
}

function textByLanguage(lang, key) {
    if (lang === 'ru') {
        return defaultTexts[key] || '';
    }
    return i18n[lang]?.text?.[key] || defaultTexts[key] || '';
}

function updateSliderLabels() {
    const ui = uiByLanguage(currentLanguage);

    document.querySelectorAll('.slider-btn.prev').forEach((button) => {
        button.setAttribute('aria-label', ui.sliderPrev);
    });

    document.querySelectorAll('.slider-btn.next').forEach((button) => {
        button.setAttribute('aria-label', ui.sliderNext);
    });

    document.querySelectorAll('.slider-dots').forEach((container) => {
        container.setAttribute('aria-label', ui.sliderGroup);
        const dots = container.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.setAttribute('aria-label', `${ui.sliderItem} ${index + 1}`);
        });
    });

    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    const modalClose = document.querySelector('.modal-close');
    if (modalPrev) {
        modalPrev.setAttribute('aria-label', ui.modalPrev);
    }
    if (modalNext) {
        modalNext.setAttribute('aria-label', ui.modalNext);
    }
    if (modalClose) {
        modalClose.setAttribute('aria-label', ui.modalClose);
    }

    const floatingWa = document.querySelector('.floating-wa');
    if (floatingWa) {
        floatingWa.setAttribute('aria-label', ui.floatingWaAria);
    }
}

function updateGalleryMetadata(lang) {
    const buildingLabelByLang = {
        ru: 'Корпус',
        kz: 'Корпус',
        en: 'Building'
    };

    const photoWordByLang = {
        ru: 'фото',
        kz: 'фото',
        en: 'photo'
    };

    const gymLabelByLang = {
        ru: 'Спортзал',
        kz: 'Спорт кешені',
        en: 'Sports Complex'
    };

    const dormLabelByLang = {
        ru: 'Общежитие',
        kz: 'Жатақхана',
        en: 'Dormitory'
    };

    const buildingPrefix = buildingLabelByLang[lang] || buildingLabelByLang.ru;
    const photoWord = photoWordByLang[lang] || photoWordByLang.ru;

    const caseOneItems = document.querySelectorAll('#projects .project-item:nth-of-type(1) .gallery-item');
    caseOneItems.forEach((item, index) => {
        let building = 1;
        let photo = index + 1;

        if (index >= 3 && index < 6) {
            building = 2;
            photo = index - 2;
        }

        if (index >= 6) {
            building = 3;
            photo = index - 5;
        }

        item.dataset.label = `${buildingPrefix} ${building}`;

        const image = item.querySelector('.gallery-img');
        if (image) {
            image.alt = `${buildingPrefix} ${building} - ${photoWord} ${photo}`;
        }
    });

    const gymPrefix = gymLabelByLang[lang] || gymLabelByLang.ru;
    document.querySelectorAll('#projects .project-item:nth-of-type(2) .gallery-img').forEach((image, index) => {
        image.alt = `${gymPrefix} - ${photoWord} ${index + 1}`;
    });

    const dormPrefix = dormLabelByLang[lang] || dormLabelByLang.ru;
    document.querySelectorAll('#projects .project-item:nth-of-type(3) .gallery-img').forEach((image, index) => {
        image.alt = `${dormPrefix} - ${photoWord} ${index + 1}`;
    });
}

function applyLanguage(lang) {
    currentLanguage = (lang === 'ru' || lang === 'kz' || lang === 'en') ? lang : 'ru';

    document.documentElement.lang = currentLanguage === 'kz' ? 'kk' : currentLanguage;

    if (currentLanguage === 'ru') {
        document.title = defaultMetaTitle;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', defaultMetaDescription);
        }
    } else {
        document.title = i18n[currentLanguage].metaTitle;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', i18n[currentLanguage].metaDescription);
        }
    }

    Object.entries(textBindings).forEach(([key, selector]) => {
        const element = document.querySelector(selector);
        if (!element) {
            return;
        }
        element.textContent = textByLanguage(currentLanguage, key);
    });

    updateGalleryMetadata(currentLanguage);
    updateSliderLabels();

    document.querySelectorAll('.lang-btn').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.lang === currentLanguage);
    });

    try {
        localStorage.setItem('smarttech_lang', currentLanguage);
    } catch (error) {
        // Ignore localStorage errors in private mode.
    }
}

document.querySelectorAll('.lang-btn').forEach((button) => {
    button.addEventListener('click', () => {
        const targetLanguage = button.dataset.lang;
        applyLanguage(targetLanguage);
    });
});

applyLanguage(resolveInitialLanguage());

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

        const ui = uiByLanguage(currentLanguage);
        dotsContainer.setAttribute('aria-label', ui.sliderGroup);

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'slider-dot';
            dot.setAttribute('aria-label', `${ui.sliderItem} ${index + 1}`);

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

updateSliderLabels();
const modal = document.getElementById('photoModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const closeBtn = document.querySelector('.modal-close');
const prevBtn = document.querySelector('.modal-prev');
const nextBtn = document.querySelector('.modal-next');

if (modal && modalImg && modalCaption && closeBtn && prevBtn && nextBtn) {
    let currentImages = [];
    let currentIndex = 0;

    document.querySelectorAll('.gallery-img').forEach((img) => {
        img.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalCaption.textContent = img.alt;

            const gallery = img.closest('.photo-gallery');
            currentImages = gallery ? Array.from(gallery.querySelectorAll('.gallery-img')) : [];
            currentIndex = currentImages.indexOf(img);
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    prevBtn.addEventListener('click', () => {
        if (!currentImages.length) {
            return;
        }
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        modalImg.src = currentImages[currentIndex].src;
        modalCaption.textContent = currentImages[currentIndex].alt;
    });

    nextBtn.addEventListener('click', () => {
        if (!currentImages.length) {
            return;
        }
        currentIndex = (currentIndex + 1) % currentImages.length;
        modalImg.src = currentImages[currentIndex].src;
        modalCaption.textContent = currentImages[currentIndex].alt;
    });

    document.addEventListener('keydown', (e) => {
        if (modal.style.display !== 'block') {
            return;
        }

        if (e.key === 'Escape') {
            modal.style.display = 'none';
        } else if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
}
