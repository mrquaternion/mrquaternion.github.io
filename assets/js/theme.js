(function () {
    'use strict';
    var root = document.documentElement;
    var system = window.matchMedia('(prefers-color-scheme: dark)');
    var preference = null;
    try { preference = localStorage.getItem('portfolio-theme'); } catch (error) {}
    if (preference !== 'light' && preference !== 'dark') preference = null;

    function applyTheme() {
        var dark = preference ? preference === 'dark' : system.matches;
        root.dataset.theme = dark ? 'dark' : 'light';
        document.querySelectorAll('.theme-toggle').forEach(function (button) {
            var french = root.lang === 'fr';
            var label = dark
                ? (french ? 'Activer le mode clair' : 'Switch to light mode')
                : (french ? 'Activer le mode sombre' : 'Switch to dark mode');
            button.setAttribute('aria-label', label);
            button.setAttribute('title', label);
            button.querySelector('span').textContent = dark ? '☀' : '☾';
        });
    }

    applyTheme();
    document.addEventListener('DOMContentLoaded', function () {
        applyTheme();
        document.querySelectorAll('.theme-toggle').forEach(function (button) {
            button.addEventListener('click', function () {
                preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
                try { localStorage.setItem('portfolio-theme', preference); } catch (error) {}
                applyTheme();
            });
        });
    });
    system.addEventListener('change', applyTheme);
    window.addEventListener('storage', function (event) {
        if (event.key === 'portfolio-theme' || event.key === null) {
            preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
            applyTheme();
        }
    });
}());
