/* Buildless, dependency-free. All archive data and page assets are local. */
(() => {
  'use strict';
  const {stages, sources, sections} = window.WHITEPAPER_ARCHIVE;
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId = id => stages.find(s => s.id === id);
  const params = new URLSearchParams(location.search);
  const initial = Math.max(0, stages.findIndex(s => s.id === params.get('stage')));
  let current = initial, timer = null, toastTimer = null, showDiff = true, view = 'text';
  let viewerStage = null, viewerPage = 1, viewerTrigger = null;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function navigateTo(id) {
    $(id).scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth', block:'start'});
  }
  function updateURL() {
    try {
      const url = new URL(location.href);
      url.searchParams.set('stage', stages[current].id);
      url.searchParams.set('from', $('compare-from').value);
      url.searchParams.set('to', $('compare-to').value);
      url.searchParams.set('section', $('compare-section').value);
      if (view === 'pages') url.searchParams.set('view', 'pages'); else url.searchParams.delete('view');
      history.replaceState(null, '', url);
    } catch (_) { /* Some local-file browsers disallow history changes. */ }
  }
  function notify(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').classList.add('visible');
    toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 2800);
  }
  function diffWords(before, after) {
    const a = before.match(/\S+\s*/g) || [], b = after.match(/\S+\s*/g) || [];
    const rows = Array.from({length:a.length+1}, () => new Uint16Array(b.length+1));
    for(let i=a.length-1; i>=0; i--) for(let j=b.length-1; j>=0; j--) {
      rows[i][j] = a[i].trim() === b[j].trim() ? rows[i+1][j+1]+1 : Math.max(rows[i+1][j], rows[i][j+1]);
    }
    const ops = [];
    let i=0,j=0,added=0,removed=0;
    const add = (kind, text) => {
      if(ops.length && ops[ops.length-1].kind === kind) ops[ops.length-1].text += text;
      else ops.push({kind,text});
    };
    while(i<a.length || j<b.length) {
      if(i<a.length && j<b.length && a[i].trim() === b[j].trim()) { add('equal', b[j]); i++;j++; }
      else if(i<a.length && (j===b.length || rows[i+1][j] >= rows[i][j+1])) { add('remove',a[i++]); removed++; }
      else { add('add',b[j++]); added++; }
    }
    const html = side => ops.filter(o => side === 'before' ? o.kind !== 'add' : o.kind !== 'remove').map(o => o.kind === 'equal' ? esc(o.text) : `<${o.kind==='add'?'ins':'del'}>${esc(o.text)}</${o.kind==='add'?'ins':'del'}>`).join('');
    return {before:html('before'), after:html('after'), added, removed};
  }
  function sourceLink(id) {
    const s = sources.find(s => s.id === id);
    return `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a>`;
  }
  function renderAbstract() {
    const s = stages[current], prev = stages[current-1];
    let text = esc(s.sections.abstract);
    let status = 'The starting text in this four-stage record.';
    if(prev) {
      const diff = diffWords(prev.sections.abstract, s.sections.abstract);
      if($('highlight-edits').checked) text = diff.after;
      status = diff.added || diff.removed ? `Compared with ${prev.period}: ${diff.added} word${diff.added===1?'':'s'} added or replaced.` : `Abstract unchanged from ${prev.period}.`;
    }
    $('abstract-text').innerHTML = '<strong>Abstract.</strong> ' + text;
    $('abstract-status').textContent = status;
    renderContact();
  }
  function renderContact() {
    const s = stages[current], prev = stages[current-1];
    const changed = prev?.sections.contact && s.sections.contact && prev.sections.contact !== s.sections.contact;
    const address = changed && $('highlight-edits').checked
      ? `<del>${esc(prev.sections.contact)}</del> → <ins>${esc(s.sections.contact)}</ins>`
      : esc(s.sections.contact || '');
    const caption = s.id === 'august' ? 'Email sender · Back & Dai correspondence'
      : s.id === 'october' && changed && $('highlight-edits').checked ? 'August email sender → October PDF contact'
      : 'Printed contact · PDF page 1';
    $('document-contact').innerHTML = `${address}<small class="contact-caption">${caption}</small>`;
  }
  function setStage(index, user = false) {
    current = Math.max(0, Math.min(3, Number(index)));
    const s = stages[current];
    $('timeline-slider').value = current;
    $('timeline-slider').setAttribute('aria-valuetext', `${s.date}, ${s.short}`);
    document.documentElement.style.setProperty('--progress', `${current/3*100}%`);
    document.querySelectorAll('#timeline-stops [data-go]').forEach(b => { const active = Number(b.dataset.go) === current; b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active)); });
    document.querySelectorAll('.rail-ticks i').forEach((tick,i) => tick.classList.toggle('active',i===current));
    $('paper-stack').dataset.active = current;
    $('stage-kicker').textContent = `${s.num} / ${s.custodian.toUpperCase()}`;
    $('stage-heading').textContent = s.name;
    $('chapter-count').textContent = `${s.num} / 04`;
    $('prev-stage').disabled = current === 0;
    $('next-stage').disabled = current === 3;
    $('artifact-label').textContent = current === 0 ? 'SURVIVING EMAIL ABSTRACT' : `ABSTRACT · ${s.pages}-PAGE PDF`;
    $('document-overline').textContent = current === 0 ? 'TITLE AS SENT IN AUGUST 2008' : 'BITCOIN WHITEPAPER · ' + s.period.toUpperCase();
    $('document-title').textContent = s.title;
    $('open-document').textContent = current === 0 ? 'Read source email ↗' : 'Inspect original pages ↗';
    $('stage-badge').textContent = s.badge;
    $('stage-dek').textContent = s.dek;
    $('stage-story').textContent = s.story;
    $('date-label').textContent = current === 0 ? 'CORRESPONDENCE' : 'PDF CREATION DATE';
    $('stage-date').textContent = s.date;
    $('stage-time').textContent = s.utc ? s.utc.slice(11) : '';
    $('stage-survival').textContent = s.survive;
    $('stage-change-title').textContent = s.changeTitle;
    $('stage-change').textContent = s.change;
    $('stage-date-note').textContent = s.dateNote;
    $('stage-caution').textContent = s.caution;
    $('stage-source-links').innerHTML = s.sources.map(sourceLink).join('');
    renderAbstract();
    if(user) {
      $('stage-announcer').textContent = `Stage ${current+1} of 4. ${s.name}. ${s.date}.`;
      updateURL();
    }
  }
  function pauseTour() {
    clearInterval(timer);timer=null;
    $('play-tour').innerHTML = '<span aria-hidden="true">▶</span> Play the journey';
    $('play-tour').setAttribute('aria-pressed','false');
  }
  function manualStage(index, scroll=false) { pauseTour();setStage(index,true);if(scroll)navigateTo('journey'); }
  function toggleTour() {
    if(timer) { pauseTour();return; }
    if(current === 3) setStage(0,true);
    $('play-tour').innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause the journey';
    $('play-tour').setAttribute('aria-pressed','true');
    timer = setInterval(() => {setStage(current+1,true);if(current === 3) pauseTour();}, 7500);
  }
  function locationFor(s, section) {
    if(s.id === 'august') return section === 'contact' ? 'EMAIL SENDER · BACK & DAI' : ['abstract','title'].includes(section) ? 'EMAIL TRANSCRIPT' : 'FULL DRAFT UNKNOWN';
    const locations = {abstract:'OPENING ABSTRACT',title:'PAGE 1',fees:'§6 · INCENTIVE',difficulty:s.id === 'march'?'§4 · PROOF-OF-WORK':'§6 · INCENTIVE',network:'§5 · NETWORK',spv:'§8 · PAYMENT VERIFICATION',contact:'PAGE 1',honesty:'§6 · INCENTIVE'};
    return locations[section];
  }
  function unknownMarkup() {return '<span class="unknown-passage"><b>Unknown in the surviving record.</b>The full August PDF is not available. Its missing text cannot be treated as an addition or deletion.</span>';}
  function passageMarkup(value, markup) {
    if(value === null) return unknownMarkup();
    if(value === '') return '<span class="empty-passage">No transaction-fee paragraph appears in this edition.</span>';
    return markup ?? esc(value);
  }
  function renderCompare() {
    const a = byId($('compare-from').value), b = byId($('compare-to').value), key = $('compare-section').value;
    const section = sections.find(s=>s.id===key);
    const before = a.sections[key], after=b.sections[key];
    $('from-date').textContent = a.period.toUpperCase();
    $('to-date').textContent = b.period.toUpperCase();
    $('from-location').textContent = locationFor(a,key);
    $('to-location').textContent = locationFor(b,key);
    $('passage-location').textContent = section.label.toUpperCase();
    $('passage-heading').textContent = section.heading;
    $('passage-note').textContent = section.note;
    let result;
    if(before===null || after===null) {
      $('from-text').innerHTML = passageMarkup(before);
      $('to-text').innerHTML = passageMarkup(after);
      result='Comparison unavailable: the complete August draft is missing.';
    } else {
      const diff=diffWords(before,after);
      $('from-text').innerHTML = passageMarkup(before,diff.before);
      $('to-text').innerHTML = passageMarkup(after,diff.after);
      if(a.id===b.id) result='The same edition is selected on both sides.';
      else if(!diff.added && !diff.removed) result='No wording changes in this passage.';
      else result=`${diff.removed} word${diff.removed===1?'':'s'} removed · ${diff.added} word${diff.added===1?'':'s'} added (punctuation stays attached to words).`;
    }
    $('comparison-result').textContent = result;
    document.querySelector('.diff-panels').classList.toggle('clean',!showDiff);
    renderOverlay();
    updateURL();
  }
  function setView(next) {
    view = next;
    $('text-comparison').hidden = next !== 'text';
    $('page-comparison').hidden = next !== 'pages';
    $('text-view-button').classList.toggle('active',next === 'text');
    $('page-view-button').classList.toggle('active',next === 'pages');
    $('text-view-button').setAttribute('aria-pressed',String(next === 'text'));
    $('page-view-button').setAttribute('aria-pressed',String(next === 'pages'));
    $('compare-section').disabled = next === 'pages';
    renderCompare();
  }
  function renderOverlay() {
    const a=byId($('compare-from').value), b=byId($('compare-to').value);
    const available=Boolean(a.pdf && b.pdf);
    $('overlay-unavailable').hidden=available;
    $('overlay-content').hidden=!available;
    $('overlay-page').disabled=!available;
    $('reset-wipe').disabled=!available;
    if(!available) { $('overlay-page').innerHTML='<option>—</option>';$('overlay-pages-note').textContent='Only an email fragment survives for August.';return; }
    const count=Math.min(a.pages,b.pages);
    const page=Math.max(1,Math.min(count,Number($('overlay-page').value)||1));
    $('overlay-page').innerHTML=Array.from({length:count},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join('');
    $('overlay-page').value=page;
    $('overlay-pages-note').textContent=a.pages===b.pages?`${count} pages in each edition.`:`${a.pages} vs ${b.pages} pages. Use the source desk to see the extra page.`;
    $('overlay-base').src=`assets/pages/${a.id}/${page}.webp`;
    $('overlay-base').alt=`${a.period}, original page ${page}`;
    $('overlay-reveal').src=`assets/pages/${b.id}/${page}.webp`;
    $('overlay-reveal').alt=`${b.period}, original page ${page}`;
    $('overlay-from-label').textContent=`${b.period.toUpperCase()} · LEFT`;
    $('overlay-to-label').textContent=`RIGHT · ${a.period.toUpperCase()}`;
  }
  function chooseComparison(from,to,section) {
    $('compare-from').value=from;$('compare-to').value=to;$('compare-section').value=section;
    setView('text');navigateTo('compare');
  }
  function renderSourceDesk() {
    $('source-documents').innerHTML=stages.map(s => {
      const fileName=s.id==='august'?'':`bitcoin-${s.id==='october'?'2008-10-03':s.id==='bohm'?'2008-11-11':'2009-03-24'}.pdf`;
      const downloadUrl=s.downloadUrl || s.pdf;
      const downloadAttrs=/^https?:/.test(downloadUrl || '') ? 'target="_blank" rel="noopener noreferrer"' : `download="${fileName}"`;
      const md5=s.md5?`<span class="hash-label">MD5 · matches Appendix PM3, §42</span><div class="hash-line"><code>${esc(s.md5)}</code><button type="button" data-copy="${esc(s.md5)}" data-algorithm="MD5">Copy MD5</button></div>`:'';
      const evidence=s.evidenceSources?`<div class="source-evidence"><span class="small-label">BOHM · EXHIBIT NB1</span><p>The preserved PDF matches both hashes recorded in Appendix PM3, §42 (pp. 14–15). The supplied JFIF reproduces that entry.</p><div class="evidence-links">${s.evidenceSources.map(sourceLink).join('')}<a href="${esc(s.pdf)}" download="bitcoin-nb1.pdf">Bundled verified PDF ↓</a></div></div>`:'';
      return `<article class="source-document"><div class="file-icon" aria-hidden="true">${s.pages||'—'}<small>${s.pages?'PAGES':'EMAIL'}</small></div><div><h3 class="source-title">${esc(s.period)}</h3><span class="source-detail">${esc(s.custodian)}${s.bytes?` · ${s.bytes.toLocaleString('en-CA')} bytes`:''}</span></div><div class="source-meta"><span>${s.utc?esc(s.utc):'Title + abstract + email sender'}</span><small>${s.utc?'Creation timestamp, converted to UTC':'Full PDF · page count · hash unknown'}</small></div><div class="source-actions">${s.pdf?`<button type="button" data-view="${s.id}">Inspect pages ↗</button><a href="${esc(downloadUrl)}" ${downloadAttrs}>PDF ${s.id==='bohm'?'↗':'↓'}</a>`:`<button type="button" data-go="0" data-scroll="true">Read abstract ↗</button><a href="${sources.find(s=>s.id==='dai').url}" target="_blank" rel="noopener noreferrer">Email ↗</a>`}</div>${evidence}${s.sha256?`<details class="source-hash"><summary>${s.md5?'MD5, SHA-256':'SHA-256'} & original metadata</summary>${md5}<span class="hash-label">SHA-256</span><div class="hash-line"><code>${s.sha256}</code><button type="button" data-copy="${s.sha256}">Copy SHA-256</button></div><p style="margin-top:10px;line-height:1.8;font-size:9px">CreationDate: ${esc(s.rawDate)}<br>Creator: ${esc(s.creator)} · Producer: ${esc(s.producer)}<br>${s.pages} pages; references ${s.id==='october'?'share page 8':'on page 9'}. Original PDF bytes are preserved.</p></details>`:''}</article>`;
    }).join('');
    $('sources-list').innerHTML=sources.map((s,i)=>`<li id="source-${s.id}"><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><small>${esc(s.kind)}</small><p>${esc(s.note)}</p></li>`).join('');
    document.querySelector('.source-count').textContent = `${sources.length} records`;
  }
  function openViewer(id, trigger) {
    viewerStage=byId(id);viewerPage=1;viewerTrigger=trigger || document.activeElement;
    if(!viewerStage?.pdf)return;
    pauseTour();
    $('viewer-title').textContent=viewerStage.period+' · '+viewerStage.custodian;
    $('viewer-page').innerHTML=Array.from({length:viewerStage.pages},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join('');
    $('viewer-total').textContent='of '+viewerStage.pages;
    const downloadUrl=viewerStage.downloadUrl || viewerStage.pdf;
    $('viewer-download').href=downloadUrl;
    $('viewer-download').textContent=viewerStage.id==='bohm'?'Open original PDF on GitHub ↗':'Download original PDF ↓';
    if(/^https?:/.test(downloadUrl)) {
      $('viewer-download').removeAttribute('download');
      $('viewer-download').target='_blank';
      $('viewer-download').rel='noopener noreferrer';
    } else {
      $('viewer-download').download='bitcoin-'+viewerStage.id+'.pdf';
      $('viewer-download').removeAttribute('target');
      $('viewer-download').removeAttribute('rel');
    }
    $('viewer-zoom').checked=false;$('viewer-scroll').classList.remove('zoomed');
    setViewerPage(1);$('document-dialog').showModal();$('close-viewer').focus();
  }
  function setViewerPage(page) {
    viewerPage=Math.max(1,Math.min(viewerStage.pages,Number(page)));
    $('viewer-page').value=viewerPage;
    $('viewer-image').src=`assets/pages/${viewerStage.id}/${viewerPage}.webp`;
    $('viewer-image').alt=`${viewerStage.period} whitepaper, page ${viewerPage} of ${viewerStage.pages}`;
    $('viewer-prev').disabled=viewerPage===1;$('viewer-next').disabled=viewerPage===viewerStage.pages;
    $('viewer-scroll').scrollTo(0,0);
  }
  async function copyHash(value, algorithm = 'SHA-256') {
    try {
      if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const active=document.activeElement, area=document.createElement('textarea');
        area.value=value;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();
        const ok=document.execCommand('copy');area.remove();active?.focus();if(!ok)throw new Error('Clipboard unavailable');
      }
      notify(`${algorithm} copied.`);
    } catch(_) {notify('Select the hash and copy it with Ctrl+C or ⌘C.');}
  }

  // Populate every control before rendering state.
  const selectorLabels={august:'Aug 2008 · Email',october:'Oct 2008 · 8 pages',bohm:'Nov 2008 · Bohm',march:'Mar 2009 · Final'};
  const options=stages.map(s=>`<option value="${s.id}">${selectorLabels[s.id]}</option>`).join('');
  $('compare-from').innerHTML=options;$('compare-to').innerHTML=options;
  $('compare-from').value=byId(params.get('from'))?params.get('from'):'october';
  $('compare-to').value=byId(params.get('to'))?params.get('to'):'march';
  $('compare-section').innerHTML=sections.map(s=>`<option value="${s.id}">${esc(s.label)}</option>`).join('');
  if(sections.some(s=>s.id===params.get('section')))$('compare-section').value=params.get('section');
  renderSourceDesk();setStage(current);setView(params.get('view')==='pages'?'pages':'text');
  $('play-tour').setAttribute('aria-pressed','false');

  document.addEventListener('click',event=>{
    const stage=event.target.closest('[data-go]');
    if(stage)manualStage(stage.dataset.go,stage.classList.contains('specimen')||stage.dataset.scroll==='true');
    const compare=event.target.closest('[data-compare]');if(compare)chooseComparison(...compare.dataset.compare.split(','));
    const viewer=event.target.closest('[data-view]');if(viewer)openViewer(viewer.dataset.view,viewer);
    const copy=event.target.closest('[data-copy]');if(copy)copyHash(copy.dataset.copy, copy.dataset.algorithm);
  });
  $('timeline-slider').addEventListener('input',event=>manualStage(event.target.value));
  $('prev-stage').addEventListener('click',()=>manualStage(current-1));
  $('next-stage').addEventListener('click',()=>manualStage(current+1));
  $('play-tour').addEventListener('click',toggleTour);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseTour();});
  $('highlight-edits').addEventListener('change',renderAbstract);
  $('open-document').addEventListener('click',event=>{
    if(current===0)window.open(sources.find(s=>s.id==='dai').url,'_blank','noopener,noreferrer');
    else openViewer(stages[current].id,event.currentTarget);
  });
  $('compare-stage').addEventListener('click',()=>{
    if(current===0)chooseComparison('august','october','title');
    else chooseComparison(stages[current-1].id,stages[current].id,current===2?'fees':'abstract');
  });
  ['compare-from','compare-to','compare-section'].forEach(id=>$(id).addEventListener('change',renderCompare));
  $('swap-versions').addEventListener('click',()=>{const from=$('compare-from').value;$('compare-from').value=$('compare-to').value;$('compare-to').value=from;renderCompare();});
  $('text-view-button').addEventListener('click',()=>setView('text'));
  $('page-view-button').addEventListener('click',()=>setView('pages'));
  $('toggle-diff').addEventListener('click',()=>{showDiff=!showDiff;$('toggle-diff').textContent=showDiff?'Hide highlights':'Show highlights';$('toggle-diff').setAttribute('aria-pressed',String(showDiff));document.querySelector('.diff-panels').classList.toggle('clean',!showDiff);});
  $('overlay-page').addEventListener('change',renderOverlay);
  $('wipe-slider').addEventListener('input',event=>$('page-overlay').style.setProperty('--wipe',event.target.value+'%'));
  $('reset-wipe').addEventListener('click',()=>{$('wipe-slider').value=50;$('page-overlay').style.setProperty('--wipe','50%');});
  $('close-viewer').addEventListener('click',()=>$('document-dialog').close());
  $('document-dialog').addEventListener('close',()=>viewerTrigger?.focus());
  $('document-dialog').addEventListener('click',event=>{if(event.target===$('document-dialog')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();}});
  $('viewer-page').addEventListener('change',event=>setViewerPage(event.target.value));
  $('viewer-prev').addEventListener('click',()=>setViewerPage(viewerPage-1));
  $('viewer-next').addEventListener('click',()=>setViewerPage(viewerPage+1));
  $('viewer-zoom').addEventListener('change',event=>$('viewer-scroll').classList.toggle('zoomed',event.target.checked));
  $('document-dialog').addEventListener('keydown',event=>{if(['SELECT','INPUT'].includes(event.target.tagName))return;if(event.key==='ArrowLeft'){setViewerPage(viewerPage-1);event.preventDefault();}if(event.key==='ArrowRight'){setViewerPage(viewerPage+1);event.preventDefault();}});
})();
