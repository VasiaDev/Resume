// === Processing language switcher === //
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

// === Loading pages === //
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