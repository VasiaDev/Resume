// === Handling click on the menu === //
const links = document.querySelectorAll('.header-nav-link');

links.forEach(link => {
    link.addEventListener('click', function (e) {
        links.forEach(el => el.classList.remove('active'));
        this.classList.add('active');
    });
});

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

        const $option = $(this);
        const selectedLang = $option.text();
        const lang = $option.attr('data-lang');
        const $container = $option.closest('.language-container');
        const $current = $container.find('.language-current');
        const currentLang = $current.text();

        $current.text(selectedLang);
        $option.text(currentLang).attr('data-lang', currentLang);

        $container.removeClass('open');

        //REWORK: сохранение в LocalStorage для дальнейшей логики
        console.log('Language changed to:', lang);
    });

    // Click outside the switch
    $(document).on('click', function () {
        $('.language-container').removeClass('open');
    });
});


