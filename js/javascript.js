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
