/* Runs before styles load so a saved theme does not flash the other palette. */
(() => {
  'use strict';
  const key = 'whitepaper-theme';
  const root = document.documentElement;
  let initial = 'light';
  try {
    if (localStorage.getItem(key) === 'dark') initial = 'dark';
  } catch (_) { /* Local-file or private browsers may block storage. */ }
  root.dataset.theme = initial;

  function syncControl() {
    const dark = root.dataset.theme === 'dark';
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      button.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
      button.querySelector('.theme-label').textContent = dark ? 'Light mode' : 'Dark mode';
    }
    document.querySelector('meta[name="theme-color"]').content = dark ? '#171d19' : '#f3f1e8';
  }
  document.addEventListener('DOMContentLoaded', () => {
    syncControl();
    document.getElementById('theme-toggle').addEventListener('click', () => {
      const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = theme;
      try { localStorage.setItem(key, theme); } catch (_) { /* The switch still works without storage. */ }
      syncControl();
    });
  });
})();
