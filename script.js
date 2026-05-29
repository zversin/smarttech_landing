
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

const defaultTexts = {};
document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (!key) {
        return;
    }
    defaultTexts[key] = element.textContent.trim();
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
        metaTitle: 'Hikvision Face ID және турникеттер - дайын СКУД жиынтықтары | SmartTech',
        metaDescription: 'Hikvision қолжетімділікті бақылау жиынтықтары: турникет, 2 Face ID терминалы, монтаж, қосу және баптау. 3 000, 6 000 және 10 000 адамға дейін.',
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
            navPackages: 'Пакеттер',
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

            packagesTitle: 'Hikvision Face ID + турникет дайын жиынтықтары',
            packagesSubtitle: 'Бір өту нүктесіне арналған дайын қолжетімділікті бақылау шешімін орнатамыз: Hikvision турникеті, кіріс пен шығысқа екі бет тану терминалы, кронштейндер, монтаж, қосу және базалық баптау.',
            packagesLead: 'Шешім кеңселерге, оқу орындарына, жатақханаларға, бизнес-орталықтарға, қоймаларға және кәсіпорындарға жарайды.',
            packageIncludesTitle: 'Құрамы',
            packageCapabilitiesTitle: 'Мүмкіндіктері',
            packageCta: 'КП алу',
            packageRecommended: 'Ұсынамыз',
            packageSetBracket: 'Терминалды турникетке орнатуға арналған кронштейн - 2 дана',
            packageSetInstall: 'Монтаж, қосу және базалық баптау - 1 жиынтық',
            packageStart3000Title: 'Hikvision START 3000',
            packageStart3000Short: '1 турникет + 3 000 бетке дейін 2 Face ID',
            packageStart3000Audience: 'Шағын нысандарға: кеңселерге, қоймаларға, мектептерге, оқу орталықтарына және шағын бизнес-орталықтарға.',
            packageStart3000Set1: 'Hikvision DS-K3G411LX-R/Pg-Dm55 турникеті - 1 дана',
            packageStart3000Set2: 'Hikvision DS-K1T341CM Face ID терминалы - 2 дана',
            packageStart3000Cap1: 'бет арқылы тану;',
            packageStart3000Cap2: 'карта арқылы кіру;',
            packageStart3000Cap3: 'кіру мен шығуды бақылау;',
            packageStart3000Cap4: 'оқиғалар журналы;',
            packageStart3000Cap5: 'пайдаланушыларды базалық баптау;',
            packageStart3000Cap6: 'терминалдарды кронштейн арқылы турникетке орнату.',
            packageStart3000Price: '1 250 000 ₸ бастап',
            packageStart6000Title: 'Hikvision START 6000',
            packageStart6000Short: '1 турникет + 6 000 бетке дейін 2 Face ID',
            packageStart6000Audience: 'Орташа жүктемелі нысандарға: колледждерге, жатақханаларға, бизнес-орталықтарға, кәсіпорындарға және оқу корпустарына.',
            packageStart6000Set1: 'Hikvision DS-K3G411LX-R/Pg-Dm55 турникеті - 1 дана',
            packageStart6000Set2: 'Hikvision DS-K1T670MX / DS-K1T670MX-QR Face ID терминалы - 2 дана',
            packageStart6000Cap1: 'Face ID арқылы жылдам өту;',
            packageStart6000Cap2: 'кіру мен шығуға бөлек терминалдар;',
            packageStart6000Cap3: 'қолжетімділік карталарын қолдау;',
            packageStart6000Cap4: 'оқиғалар журналы;',
            packageStart6000Cap5: 'HikCentral жүйесімен кейінгі интеграция мүмкіндігі;',
            packageStart6000Cap6: 'пайдаланушы базасы өсетін нысандарға жарайды.',
            packageStart6000Price: '1 450 000 ₸ бастап',
            packageStart10000Title: 'Hikvision START 10000',
            packageStart10000Short: '1 турникет + 10 000 бетке дейін 2 Face ID',
            packageStart10000Audience: 'Университеттерге, жатақханаларға, спорт кешендеріне, зауыттарға және өту ағыны жоғары нысандарға ұсынылатын жиынтық.',
            packageStart10000Set1: 'Hikvision DS-K3G411LX-R/Pg-Dm55 турникеті - 1 дана',
            packageStart10000Set2: 'Hikvision DS-K1T673DX Face ID терминалы - 2 дана',
            packageStart10000Cap1: 'кіру мен шығуда бет тану;',
            packageStart10000Cap2: 'өту жылдамдығы жоғары;',
            packageStart10000Cap3: 'карталарды қолдау;',
            packageStart10000Cap4: 'оқиғалар журналы;',
            packageStart10000Cap5: 'үлкен пайдаланушы базасымен жұмыс;',
            packageStart10000Cap6: 'HikCentral-ға қосу мүмкіндігі;',
            packageStart10000Cap7: 'қатысу есебі жүйелерімен интеграция мүмкіндігі.',
            packageStart10000Price: '1 850 000 ₸ бастап',
            packageIncludedTitle: 'Бағаға не кіреді',
            packageIncluded1: 'жабдықты жеткізу;',
            packageIncluded2: 'турникетті жинау және орнату;',
            packageIncluded3: 'екі Face ID терминалын кронштейндерге орнату;',
            packageIncluded4: 'қуатты қосу;',
            packageIncluded5: 'терминалдарды турникетке қосу;',
            packageIncluded6: 'кіру / шығу режимін баптау;',
            packageIncluded7: 'тест пайдаланушыларын жасау;',
            packageIncluded8: 'бет және карта арқылы өтуді тексеру;',
            packageIncluded9: 'жауапты қызметкерді базалық оқыту.',
            packageExtraTitle: 'Қосымша қосуға болады',
            packageExtra1: 'HikCentral Professional;',
            packageExtra2: 'қатысу есебі;',
            packageExtra3: 'студенттер немесе қызметкерлер базасымен интеграция;',
            packageExtra4: 'жатақханамен интеграция;',
            packageExtra5: 'ескі жүйеден пайдаланушыларды көшіру;',
            packageExtra6: 'бейнебақылау;',
            packageExtra7: 'қашықтан мониторинг;',
            packageExtra8: 'резервтік қуат;',
            packageExtra9: 'сервистік қызмет көрсету.',
            packagesSeoText: 'SmartTech Hikvision жабдықтары негізіндегі дайын қолжетімділікті бақылау шешімдерін жеткізеді және орнатады. Жиынтыққа турникет, екі бет тану терминалы, монтаж кронштейндері, қосу, баптау және жүйені іске қосу кіреді. Шешімдер кеңселерге, оқу орындарына, жатақханаларға, бизнес-орталықтарға және кәсіпорындарға жарайды.',
            packagesCustomNote: 'Жабдық, интеграция немесе жұмыс форматы бойынша басқа тілектеріңіз болса, міндетті қарап, нысаныңызға сай шешім нұсқасын ұсынамыз.',
            packagesNote: 'Құны "бастап" көрсетілген және жабдықтың қолжетімділігіне, монтаж жұмыстарының көлеміне, кабель трассаларының ұзындығына және интеграция талаптарына байланысты өзгеруі мүмкін. Нақты есеп үшін өтінім қалдырыңыз - нысаныңызға арналған коммерциялық ұсыныс дайындаймыз.',

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
        metaTitle: 'Hikvision Face ID and Turnstiles - Ready Access Control Kits | SmartTech',
        metaDescription: 'Ready Hikvision access control kits: turnstile, 2 Face ID terminals, installation, connection, and setup. Packages for up to 3,000, 6,000, and 10,000 faces.',
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
            navPackages: 'Packages',
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

            packagesTitle: 'Ready Hikvision Face ID + Turnstile Kits',
            packagesSubtitle: 'We install a ready access control solution for one passage point: a Hikvision turnstile, two face recognition terminals for entry and exit, brackets, installation, connection, and basic setup.',
            packagesLead: 'The solution fits offices, educational institutions, dormitories, business centers, warehouses, and enterprises.',
            packageIncludesTitle: 'Included Equipment',
            packageCapabilitiesTitle: 'Capabilities',
            packageCta: 'Get a Quote',
            packageRecommended: 'Recommended',
            packageSetBracket: 'Bracket for mounting the terminal on the turnstile - 2 pcs.',
            packageSetInstall: 'Installation, connection, and basic setup - 1 set',
            packageStart3000Title: 'Hikvision START 3000',
            packageStart3000Short: '1 turnstile + 2 Face ID terminals for up to 3,000 faces',
            packageStart3000Audience: 'For smaller sites: offices, warehouses, schools, training centers, and small business centers.',
            packageStart3000Set1: 'Hikvision DS-K3G411LX-R/Pg-Dm55 turnstile - 1 pc.',
            packageStart3000Set2: 'Hikvision DS-K1T341CM Face ID terminal - 2 pcs.',
            packageStart3000Cap1: 'face recognition;',
            packageStart3000Cap2: 'card access;',
            packageStart3000Cap3: 'entry and exit control;',
            packageStart3000Cap4: 'event log;',
            packageStart3000Cap5: 'basic user setup;',
            packageStart3000Cap6: 'terminal mounting on the turnstile via brackets.',
            packageStart3000Price: 'from 1,250,000 ₸',
            packageStart6000Title: 'Hikvision START 6000',
            packageStart6000Short: '1 turnstile + 2 Face ID terminals for up to 6,000 faces',
            packageStart6000Audience: 'For medium-load sites: colleges, dormitories, business centers, enterprises, and educational buildings.',
            packageStart6000Set1: 'Hikvision DS-K3G411LX-R/Pg-Dm55 turnstile - 1 pc.',
            packageStart6000Set2: 'Hikvision DS-K1T670MX / DS-K1T670MX-QR Face ID terminal - 2 pcs.',
            packageStart6000Cap1: 'fast Face ID passage;',
            packageStart6000Cap2: 'separate terminals for entry and exit;',
            packageStart6000Cap3: 'access card support;',
            packageStart6000Cap4: 'event log;',
            packageStart6000Cap5: 'future integration with HikCentral;',
            packageStart6000Cap6: 'suitable for sites with a growing user base.',
            packageStart6000Price: 'from 1,450,000 ₸',
            packageStart10000Title: 'Hikvision START 10000',
            packageStart10000Short: '1 turnstile + 2 Face ID terminals for up to 10,000 faces',
            packageStart10000Audience: 'Recommended for universities, dormitories, sports complexes, factories, and sites with high traffic.',
            packageStart10000Set1: 'Hikvision DS-K3G411LX-R/Pg-Dm55 turnstile - 1 pc.',
            packageStart10000Set2: 'Hikvision DS-K1T673DX Face ID terminal - 2 pcs.',
            packageStart10000Cap1: 'face recognition for entry and exit;',
            packageStart10000Cap2: 'high passage speed;',
            packageStart10000Cap3: 'card support;',
            packageStart10000Cap4: 'event log;',
            packageStart10000Cap5: 'large user database support;',
            packageStart10000Cap6: 'HikCentral connection option;',
            packageStart10000Cap7: 'attendance system integration option.',
            packageStart10000Price: 'from 1,850,000 ₸',
            packageIncludedTitle: 'What the Price Includes',
            packageIncluded1: 'equipment supply;',
            packageIncluded2: 'turnstile assembly and installation;',
            packageIncluded3: 'installation of two Face ID terminals on brackets;',
            packageIncluded4: 'power connection;',
            packageIncluded5: 'terminal connection to the turnstile;',
            packageIncluded6: 'entry / exit mode setup;',
            packageIncluded7: 'test user creation;',
            packageIncluded8: 'face and card passage testing;',
            packageIncluded9: 'basic training for the responsible employee.',
            packageExtraTitle: 'Optional Add-ons',
            packageExtra1: 'HikCentral Professional;',
            packageExtra2: 'attendance tracking;',
            packageExtra3: 'student or employee database integration;',
            packageExtra4: 'dormitory integration;',
            packageExtra5: 'user migration from an old system;',
            packageExtra6: 'CCTV;',
            packageExtra7: 'remote monitoring;',
            packageExtra8: 'backup power;',
            packageExtra9: 'service maintenance.',
            packagesSeoText: 'SmartTech supplies and installs ready access control solutions based on Hikvision equipment. The kit includes a turnstile, two face recognition terminals, mounting brackets, connection, setup, and system launch. The solutions fit offices, educational institutions, dormitories, business centers, and enterprises.',
            packagesCustomNote: 'If you have other requirements for equipment, integration, or the way the system should work, we can review the task and propose a suitable solution.',
            packagesNote: 'Prices are listed as "from" and may change depending on equipment availability, installation scope, cable route length, and integration requirements. Leave a request for an exact calculation - we will prepare a commercial offer for your site.',

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

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        if (!key) {
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
    let lastFocusedElement = null;

    const getFocusableElements = () => Array.from(modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])'))
        .filter((element) => !element.hasAttribute('disabled'));

    const openModal = (img) => {
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        modalImg.src = img.src;
        modalCaption.textContent = img.alt;

        const gallery = img.closest('.photo-gallery');
        currentImages = gallery ? Array.from(gallery.querySelectorAll('.gallery-img')) : [];
        currentIndex = currentImages.indexOf(img);

        lastFocusedElement = document.activeElement;
        closeBtn.focus();
    };

    const closeModal = () => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    };

    const showPrev = () => {
        if (!currentImages.length) {
            return;
        }
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        modalImg.src = currentImages[currentIndex].src;
        modalCaption.textContent = currentImages[currentIndex].alt;
    };

    const showNext = () => {
        if (!currentImages.length) {
            return;
        }
        currentIndex = (currentIndex + 1) % currentImages.length;
        modalImg.src = currentImages[currentIndex].src;
        modalCaption.textContent = currentImages[currentIndex].alt;
    };

    document.querySelectorAll('.gallery-img').forEach((img) => {
        img.addEventListener('click', () => {
            openModal(img);
        });
    });

    closeBtn.addEventListener('click', () => {
        closeModal();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    prevBtn.addEventListener('click', () => {
        showPrev();
    });

    nextBtn.addEventListener('click', () => {
        showNext();
    });

    document.addEventListener('keydown', (e) => {
        if (modal.style.display !== 'block') {
            return;
        }

        if (e.key === 'Tab') {
            const focusable = getFocusableElements();
            if (!focusable.length) {
                e.preventDefault();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;

            if (e.shiftKey && active === first) {
                e.preventDefault();
                last.focus();
                return;
            }

            if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            }
            return;
        }

        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        } else if (e.key === 'ArrowRight') {
            showNext();
        }
    });
}
