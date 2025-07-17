// === Handling click on the menu === //
const links = document.querySelectorAll('.header-nav-link');

links.forEach((link, index) => {
    link.addEventListener('click', function () {
        links.forEach(el => el.classList.remove('active'));
        this.classList.add('active');

        localStorage.setItem('activeNavIndex', index);
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const savedIndex = localStorage.getItem('activeNavIndex');
    if (savedIndex !== null) {
        links.forEach(el => el.classList.remove('active'));
        links[parseInt(savedIndex)]?.classList.add('active');
    }
});

document.querySelector('.header-logo').addEventListener('click', () => {
    const links = document.querySelectorAll('.header-nav-link');

    links.forEach(link => link.classList.remove('active'));

    const homeLink = document.querySelector('.header-nav-link[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');

        const index = Array.from(links).indexOf(homeLink);
        localStorage.setItem('activeNavIndex', index);
    }
});

// === Processing language switcher (jQuery) === //
$(function () {
    // Open/close switcher
    $(document).on('click', '.language-switcher', function (e) {
        e.stopPropagation();
        const $container = $(this).closest('.language-container');
        $('.language-container').not($container).removeClass('open');
        $container.toggleClass('open');
    });

    // Click the switch
    $(document).on('click', '.language-option', function (e) {
        e.stopPropagation();

        const lang = $(this).attr('data-lang');

        loadTranslations(lang);

        const $container = $(this).closest('.language-container');
        const $current = $container.find('.language-current');
        const selectedLang = $(this).text();
        const currentLangText = $current.text();

        $current.text(selectedLang);
        $(this).text(currentLangText).attr('data-lang', currentLangText);

        $container.removeClass('open');
    });


    // Click outside the switch
    $(document).on('click', function () {
        $('.language-container').removeClass('open');
    });
});

// === Loading pages (jQuery) === //
function loadPage(page) {
    $("#content").load(`pages/${page}.html`, function () {
        updateTexts();
    });
}

$(window).on("hashchange", function () {
    const page = location.hash.substring(1) || "home";
    loadPage(page);
});

$(document).ready(function () {
    // === Restore selected language === //
    const savedLang = localStorage.getItem('selectedLang');
    if (savedLang) {
        const $container = $('.language-container');
        const $current = $container.find('.language-current');
        const $options = $container.find('.language-option');

        $options.each(function () {
            const $opt = $(this);
            if ($opt.attr('data-lang') === savedLang) {
                const currentText = $current.text();
                const currentLang = $current.text();
                $current.text($opt.text());
                $opt.text(currentText).attr('data-lang', currentLang);
            }
        });

    }

    // === Loading page by hash === //
    const page = location.hash.substring(1) || "home";

    loadTranslations(currentLang).then(() => {
        loadPage(page);
    });

    $(document).on('click', '.representation-button-contact', function () {
        location.hash = 'contacts';
    });
});

// === Translation of pages === //
let currentLang = localStorage.getItem('selectedLang') || 'en';
let translations = {};

function loadTranslations(lang) {
    return fetch(`lang/${lang}.json`)
        .then(res => res.json())
        .then(data => {
            translations = data;
            currentLang = lang;
            localStorage.setItem('selectedLang', lang);
            updateTexts();
        });
}

// === Print texts === //
let currentAbortController = null;
async function typeHTML(element, html, speed = 50) {
    if (currentAbortController) {
        currentAbortController.abort();
    }

    const controller = new AbortController();
    currentAbortController = controller;
    const signal = controller.signal;

    element.innerHTML = '';
    element.classList.add('typing-cursor');

    let i = 0;
    let buffer = '';
    let tag = false;

    return new Promise((resolve) => {
        function type() {
            if (signal.aborted) {
                element.classList.remove('typing-cursor');
                resolve();
                return;
            }

            if (i >= html.length) {
                element.classList.remove('typing-cursor');
                resolve();
                return;
            }

            const char = html[i];
            buffer += char;

            if (char === '<') tag = true;
            if (char === '>') tag = false;

            if (!tag) {
                element.innerHTML = buffer;
                i++;
                setTimeout(type, speed);
            } else {
                i++;
                type();
            }
        }

        type();
    });
}


// === Update texts === //
let updateVersion = 0;
async function updateTexts() {
    const currentVersion = ++updateVersion;

    const menuElements = document.querySelectorAll('.lang-txt[data-i18n]');
    menuElements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            el.innerHTML = translations[key];
        }
    });

    const container = document.querySelector('#content');
    if (!container) return;

    const repTextEl = container.querySelector('[data-i18n="representationText"]');
    const repSubTextEl = container.querySelector('[data-i18n="representationSubText"]');
    const contactButton = document.querySelector('.representation-button-contact');

    if (contactButton) {
        contactButton.style.transition = 'none';
        contactButton.classList.remove('visible');
        void contactButton.offsetHeight;
        contactButton.style.transition = '';
    }

    if (repSubTextEl) repSubTextEl.style.visibility = 'hidden';

    if (repTextEl && translations['representationText']) {
        await typeHTML(repTextEl, translations['representationText']);
        if (updateVersion !== currentVersion) return;
    }

    if (repSubTextEl && translations['representationSubText']) {
        repSubTextEl.style.visibility = 'visible';
        await typeHTML(repSubTextEl, translations['representationSubText']);
        if (updateVersion !== currentVersion) return;
    }

    if (contactButton) {
        contactButton.classList.remove('visible');
        setTimeout(() => {
            if (updateVersion === currentVersion) {
                contactButton.classList.add('visible');
            }
        }, 200);
    }
}