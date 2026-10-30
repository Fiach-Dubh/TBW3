/* Supplemental chronology. The original archive and comparison remain independent. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const archive = window.WHITEPAPER_ARCHIVE;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const ledger = $('chronology-events');
  if (ledger && archive?.chronology) {
    ledger.innerHTML = archive.chronology.events.map(event => {
      const source = archive.sources.find(source => source.id === event.source);
      const date = event.datetime ? `<time datetime="${esc(event.datetime)}">${esc(event.dateLabel)}</time>` : `<span class="chronology-date-only">${esc(event.dateLabel)}</span>`;
      return `<li><div class="chronology-event-date">${date}${event.time ? `<span>${esc(event.time)}</span>` : ''}<small>${esc(event.precisionNote)}</small></div><div class="chronology-event-body"><h4>${esc(event.title)}</h4><p>${esc(event.description)}</p>${source ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a>` : ''}</div></li>`;
    }).join('');
    const eventCount = document.querySelector('.chronology-ledger > summary span');
    if (eventCount) eventCount.textContent = `${archive.chronology.events.length} EVENTS · PRECISION & SOURCES`;
  }
  const dialog = $('chronology-dialog');
  let trigger;
  document.querySelectorAll('[data-open-chronology]').forEach(control => control.addEventListener('click', event => {
    if (!dialog?.showModal || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = control;
    if (!dialog.open) dialog.showModal();
  }));
  $('close-chronology')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('close', () => trigger?.focus());
  dialog?.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  $('chronology-zoom')?.addEventListener('change', event => $('chronology-viewer-scroll').classList.toggle('zoomed', event.target.checked));
  // Direct links to a source remain useful even when its bibliography is folded.
  function revealSource() {
    if (!location.hash.startsWith('#source-')) return;
    const source = document.getElementById(location.hash.slice(1));
    const details = source?.closest('details');
    if (details) { details.open = true; source.scrollIntoView({block: 'center'}); }
  }
  window.addEventListener('hashchange', revealSource);
  revealSource();
})();
