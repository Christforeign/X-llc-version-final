/**
 * X Group Theme - JavaScript Universel & Modulaire
 *
 * Gère le tiroir latéral (•••), le basculeur de thème Clair/Sombre,
 * et la fluidité des interactions de navigation.
 *
 * @package XGroupTheme
 */

(function($) {
    'use strict';

    // Preloader avec animation d'assemblage du logo (durée calibrée : ~2 secondes, max 3 secondes)
    function dismissPreloader() {
        var $preloader = $('#xgPreloader');
        if ($preloader.length) {
            $preloader.addClass('xg-preloader-hidden');
            setTimeout(function() {
                $preloader.remove();
            }, 400);
        }
    }

    $(window).on('load', function() {
        // Laisse le logo s'assembler pendant 2 secondes puis affiche le site
        setTimeout(dismissPreloader, 2000);
    });

    // Sécurité absolue : quoi qu'il arrive, le site s'affiche à 2.8s maximum (garanti moins de 4s)
    setTimeout(function() {
        dismissPreloader();
    }, 2800);

    $(document).ready(function() {
        var $drawer   = $('#xgDrawerMenu');
        var $backdrop = $('#xgDrawerBackdrop');
        var $openBtn  = $('#xgOpenDrawerBtn');
        var $closeBtn = $('#xgCloseDrawerBtn');

        function openDrawer() {
            $drawer.addClass('is-open');
            $backdrop.addClass('is-visible');
            $('body').css('overflow', 'hidden');
        }

        function closeDrawer() {
            $drawer.removeClass('is-open');
            $backdrop.removeClass('is-visible');
            $('body').css('overflow', '');
        }

        // Ouvrir le tiroir sur clic des 3 points (•••)
        if ($openBtn.length) {
            $openBtn.on('click', function(e) {
                e.preventDefault();
                openDrawer();
            });
        }

        // Fermer le tiroir sur clic de la croix ou du fond sombre
        if ($closeBtn.length) {
            $closeBtn.on('click', function(e) {
                e.preventDefault();
                closeDrawer();
            });
        }

        if ($backdrop.length) {
            $backdrop.on('click', function() {
                closeDrawer();
            });
        }

        // Fermer avec la touche Échap
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' && $drawer.hasClass('is-open')) {
                closeDrawer();
            }
        });

        // -------------------------------------------------------------
        // BASCULEUR DE THÈME : SOMBRE (NOIR) / CLAIR (BLANC)
        // -------------------------------------------------------------
        function updateThemeDisplay(theme) {
            if (theme === 'light') {
                $('body').addClass('xg-theme-light').removeClass('xg-theme-dark').attr('data-theme', 'light');
                $('.xg-theme-icon-dark').hide();
                $('.xg-theme-icon-light').show();
            } else {
                $('body').addClass('xg-theme-dark').removeClass('xg-theme-light').attr('data-theme', 'dark');
                $('.xg-theme-icon-dark').show();
                $('.xg-theme-icon-light').hide();
            }
        }

        var savedTheme = localStorage.getItem('xg_theme_mode');
        if (savedTheme) {
            updateThemeDisplay(savedTheme);
        } else {
            var initialTheme = $('body').hasClass('xg-theme-light') ? 'light' : 'dark';
            updateThemeDisplay(initialTheme);
        }

        $(document).on('click', '.xg-theme-toggle-btn', function(e) {
            e.preventDefault();
            var isCurrentLight = $('body').hasClass('xg-theme-light') || $('body').attr('data-theme') === 'light';
            var newTheme = isCurrentLight ? 'dark' : 'light';
            localStorage.setItem('xg_theme_mode', newTheme);
            updateThemeDisplay(newTheme);
        });

        // Défilement fluide vers les ancres
        $('a[href^="#"]').on('click', function(e) {
            var href = $(this).attr('href');
            if (href && href.length > 1) {
                var target = $(href);
                if (target.length) {
                    e.preventDefault();
                    $('html, body').stop().animate({
                        scrollTop: target.offset().top - 80
                    }, 400);
                }
            }
        });
    });

})(jQuery);
