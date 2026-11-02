/* Benson Lin portfolio — vanilla JS, no dependencies. */
(() => {
'use strict';
const d = document, root = d.documentElement;
const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const page = d.body.dataset.page;

/* ---- 0. links from the previous single-page site (#hash) -> new pages ---- */
if (page === 'home' && location.hash) {
  const map = {
    'gaucho-racing':'gaucho-racing.html','gr26':'gaucho-racing.html#gr26','gaucho-racing-content':'gaucho-racing.html',
    'sidediff':'gaucho-racing.html#side-diffusers','side-diffusers':'gaucho-racing.html#side-diffusers','media':'gaucho-racing.html#additional',
    'sidepod-research':'sidepod-cooling.html','sidepod':'sidepod-cooling.html','sidepod-research-content':'sidepod-cooling.html',
    'hydration-bot':'hydration-bot.html','hydration-bot-content':'hydration-bot.html',
    'thumb-rest':'thumb-rest.html','thumb-rest-content':'thumb-rest.html',
    'capillary-spreading':'capillary-spreading.html','capillary-spreading-content':'capillary-spreading.html',
    'disney-capstone':'disney-capstone.html','disney-capstone-content':'disney-capstone.html',
    'bracket-fea':'bracket-fea.html','bracket':'bracket-fea.html','bracket-fea-content':'bracket-fea.html',
    'me-10-project':'laziness-detector.html','me-10-project-content':'laziness-detector.html',
    'extras':'extras.html','side-projects':'extras.html#side-projects','clarinet-easter-egg':'extras.html#music'
  };
  const t = map[decodeURIComponent(location.hash.slice(1))];
  if (t) location.replace(t);
}

/* Stable CSS heading sizes; no delayed JavaScript fitting. */

/* ---- 1. light on the carbon + hero tilt (rAF, stops when settled) ---- */
const light = $('.sheen i'), stage = $('.wing-stage');
if (light) {
  let tx = innerWidth * .62, ty = innerHeight * .3, cx = tx, cy = ty, raf = 0;
  let nx = 0, ny = 0, rx = 0, ry = 0;
  const paint = () => {
    cx += (tx - cx) * .1; cy += (ty - cy) * .1; rx += (nx - rx) * .08; ry += (ny - ry) * .08;
    light.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
    if (stage) { stage.style.setProperty('--rx', (-ry * 5).toFixed(2) + 'deg'); stage.style.setProperty('--ry', (rx * 7).toFixed(2) + 'deg'); }
    raf = (Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(nx - rx) + Math.abs(ny - ry) > .4) ? requestAnimationFrame(paint) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(paint); };
  paint();
  if (!reduce.matches) {
    if (fine.matches) {
      addEventListener('pointermove', e => {
        tx = e.clientX; ty = e.clientY; nx = (e.clientX / innerWidth - .5) * 2; ny = (e.clientY / innerHeight - .5) * 2; kick();
      }, { passive: true });
    } else {
      // touch devices: the light drifts with scroll position instead of a pointer
      const onScroll = () => {
        const max = Math.max(1, d.documentElement.scrollHeight - innerHeight), p = scrollY / max;
        tx = innerWidth * (.15 + .7 * Math.abs(Math.sin(p * Math.PI * 2))); ty = innerHeight * (.2 + .5 * p); kick();
      };
      addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
  }
}

/* ---- 2. menu ---- */
const wm = $('.work-menu');
if (wm) {
  d.addEventListener('click', e => { if (wm.open && !wm.contains(e.target)) wm.open = false; });
  d.addEventListener('keydown', e => { if (e.key === 'Escape' && wm.open) { wm.open = false; $('summary', wm).focus(); } });
}

/* ---- 3. lightbox ---- */
const lb = $('#lb');
if (lb && lb.showModal) {
  const zs = $$('.fig .zoom, .xcard .ph-box img'), img = $('.lb-stage img', lb), stg = $('.lb-stage', lb), cap = $('.cap', lb), cnt = $('.cnt', lb);
  let i = 0;
  const src = el => el.tagName === 'A' ? el.getAttribute('href') : el.currentSrc || el.src;
  const text = el => { const f = el.closest('figure, .xcard'); const c = f && (f.querySelector('figcaption') || f.querySelector('h3')); return c ? c.textContent.replace(/^\s*Fig\.\s*\d+\s*/, '').trim() : (el.alt || ''); };
  const show = n => {
    i = (n + zs.length) % zs.length; const el = zs[i], im = el.tagName === 'A' ? $('img', el) : el;
    stg.classList.remove('zoomed'); img.src = src(el); img.alt = im.alt || ''; cap.textContent = text(el); cnt.textContent = `${i + 1} / ${zs.length}`;
    stg.scrollTo(0, 0);
  };
  zs.forEach((el, n) => {
    el.addEventListener('click', e => { e.preventDefault(); show(n); lb.showModal(); });
    if (el.tagName !== 'A') { el.tabIndex = 0; el.setAttribute('role', 'button'); el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(n); lb.showModal(); } }); }
  });
  $('.lb-x', lb).addEventListener('click', () => lb.close());
  $('.lb-prev', lb).addEventListener('click', () => show(i - 1));
  $('.lb-next', lb).addEventListener('click', () => show(i + 1));
  img.addEventListener('click', () => stg.classList.toggle('zoomed'));
  lb.addEventListener('click', e => { if (e.target === lb || e.target === stg) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
}

/* ---- 4. videos: play when in view (muted, loops), native controls stay ---- */
const saver = navigator.connection && navigator.connection.saveData;
const vids = $$('video[data-inview]');
if (vids.length && 'IntersectionObserver' in window) {
  vids.forEach(v => { v.addEventListener('pause', () => { if (!v._auto) v._user = true; v._auto = false; }); });
  const io = new IntersectionObserver(es => es.forEach(en => {
    const v = en.target;
    if (en.isIntersecting && !v._user && !reduce.matches && !saver) { v.muted = true; const p = v.play(); if (p) p.catch(() => {}); }
    else if (!en.isIntersecting && !v.paused) { v._auto = true; v.pause(); }
  }), { threshold: .5 });
  vids.forEach(v => io.observe(v));
}

/* ---- 5. YouTube facades (nothing heavy loads until clicked) ---- */
$$('.yt').forEach(b => b.addEventListener('click', () => {
  const id = b.dataset.id;
  if (location.protocol === 'file:') { window.open('https://www.youtube.com/watch?v=' + id, '_blank', 'noopener'); return; }
  const f = d.createElement('iframe');
  f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0'; f.title = b.dataset.title || 'Video';
  f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'; f.allowFullscreen = true;
  b.replaceChildren(f); b.classList.add('on'); b.style.cursor = 'default';
}, { once: true }));
$$('.yt img').forEach(im => im.addEventListener('error', () => im.remove()));

/* ---- 6. Native navigation only, without page-load effects ---- */
d.addEventListener('click', e => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a=e.target.closest('a[href]');
  if (!a || a.hasAttribute('download') || (a.target && a.target !== '_self')) return;
  let dest;
  try { dest=new URL(a.href, location.href); } catch (err) { return; }
  if (dest.origin !== location.origin) return;
  // Browsers do not reliably re-scroll when a link points to the current
  // fragment (e.g. clicking Selected Work, Contact or GR26 a second time).
  // Handle same-page fragments consistently on *every* click, without
  // interfering with normal links to other pages or with modified clicks.
  if (dest.pathname === location.pathname && dest.search === location.search) {
    if (dest.hash) {
      let id;
      try { id = decodeURIComponent(dest.hash.slice(1)); } catch (_) { return; }
      const target = d.getElementById(id);
      if (target) {
        e.preventDefault();
        // Keep native deep-link/bookmark behavior and the Back button intact.
        if (location.hash !== dest.hash) history.pushState(null, '', dest.hash);
        target.scrollIntoView({ behavior: reduce.matches ? 'instant' : 'smooth', block: 'start' });
        // The skip link also moves keyboard focus to the main landmark.
        if (a.classList.contains('skip')) target.focus({ preventScroll: true });
      }
    } else if (a.classList.contains('brand') && page === 'home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce.matches ? 'instant' : 'smooth' });
    }
  }
});

/* ---- 7. keyboard: left/right moves between projects ---- */
if (page === 'project') {
  addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || (lb && lb.open) || /input|textarea|select/i.test(e.target.tagName)) return;
    const l = $(e.key === 'ArrowLeft' ? 'link[rel=prev]' : e.key === 'ArrowRight' ? 'link[rel=next]' : 'x');
    if (l) location.href = l.href;
  });
}

/* ---- 8. Laziness Detector: leaving the tab triggers the alert ---- */
if (d.body.dataset.p === 'ld') {
  const t = d.title; d.addEventListener('visibilitychange', () => { d.title = d.hidden ? 'Leaving early? Back to your desk.' : t; });
}

/* ---- 9. Music Mode ---- */
const exitBtn = $('#mm-exit'), entry = $('.mm-enter');
const store = v => { try { v ? sessionStorage.setItem('bl-music', '1') : sessionStorage.removeItem('bl-music'); } catch (e) {} };
const MELODY = [[8,5],[13,3],[18,4],[23,2],[30,3],[35,5],[41,4],[46,6],[53,3],[58,2],[64,4],[70,5],[76,3],[82,4],[88,2],[93,5]];
function staves(animate) {
  if ($('#mm-staves')) return;
  const w = d.createElement('div'); w.id = 'mm-staves'; w.setAttribute('aria-hidden', 'true');
  const tops = innerHeight > 700 ? [16, 48, 80] : [24, 70];
  tops.forEach((t, s) => {
    const st = d.createElement('div'); st.className = 'staff'; st.style.top = t + '%'; st.style.setProperty('--s', s);
    st.innerHTML = '<div class="ln"></div>' + MELODY.map(([x, p], k) => {
      const q = (p + s * 2) % 9; return `<i class="nt${q < 4 ? '' : ' dn'}" style="left:${x}%;top:${q * 6}px;--d:${k}"></i>`;
    }).join('');
    w.appendChild(st);
  });
  w.className = animate ? 'draw' : 'still'; d.body.prepend(w);
}
function burst(x, y) {
  if (reduce.matches) return;
  let c = $('#mm-burst'); if (!c) { c = d.createElement('div'); c.id = 'mm-burst'; c.setAttribute('aria-hidden', 'true'); d.body.appendChild(c); }
  const fl = d.createElement('span'); fl.className = 'mm-flare'; fl.style.setProperty('--fx', x + 'px'); fl.style.setProperty('--fy', y + 'px'); c.appendChild(fl);
  fl.addEventListener('animationend', () => fl.remove(), { once: true });
  const chars = ['♪','♫','♬','♩','♭','♯','𝄞'], cols = ['#f5dfb6','#edbc9f','#e8a9c4','#ecc58c','#f6e8dc'];
  const n = innerWidth < 650 ? 32 : 60, reach = Math.min(480, innerWidth * .5);
  for (let k = 0; k < n; k++) {
    const a = Math.PI * 2 * k / n + (Math.random() - .5) * .35, r = 80 + Math.random() * reach, s = d.createElement('span');
    s.className = 'mm-note'; s.textContent = chars[Math.floor(Math.random() * chars.length)];
    s.style.cssText = `left:${x}px;top:${y}px;color:${cols[k % cols.length]};font-size:${18 + Math.random() * 30}px;--dx:${Math.cos(a) * r}px;--dy:${Math.sin(a) * r - 28}px;--rot:${-200 + Math.random() * 400}deg;--sc:${.6 + Math.random() * .8};--dl:${Math.random() * 120}ms;--ms:${1100 + Math.random() * 700}ms`;
    c.appendChild(s); s.addEventListener('animationend', () => s.remove(), { once: true });
  }
}
function swap(fn, x, y) {
  if (!d.startViewTransition || reduce.matches) { fn(); return; }
  root.style.setProperty('--vx', x + 'px'); root.style.setProperty('--vy', y + 'px'); root.classList.add('vt-music');
  const t = d.startViewTransition(fn); t.finished.finally(() => root.classList.remove('vt-music'));
}
function enter(x, y) {
  swap(() => { root.classList.add('music'); store(1); staves(!reduce.matches); if (exitBtn) exitBtn.hidden = false; if (entry) entry.setAttribute('aria-expanded', 'true'); }, x, y);
  burst(x, y);
}
function leave(x, y) {
  swap(() => { root.classList.remove('music'); store(0); const s = $('#mm-staves'); if (s) s.remove(); if (exitBtn) exitBtn.hidden = true; if (entry) entry.setAttribute('aria-expanded', 'false'); }, x, y);
}
if (root.classList.contains('music')) { staves(false); if (exitBtn) exitBtn.hidden = false; if (entry) entry.setAttribute('aria-expanded', 'true'); }
if (entry) entry.addEventListener('click', e => {
  const r = entry.getBoundingClientRect(), x = e.detail === 0 ? r.left + r.width / 2 : e.clientX, y = e.detail === 0 ? r.top + r.height / 2 : e.clientY;
  if (root.classList.contains('music')) leave(x, y); else enter(x, y);
});
if (exitBtn) exitBtn.addEventListener('click', e => {
  const r = exitBtn.getBoundingClientRect(); leave(r.left + r.width / 2, r.top + r.height / 2);
});
d.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('music') && !(lb && lb.open) && !(wm && wm.open)) leave(innerWidth / 2, innerHeight / 2); });
})();
