/* Scene manager (DESIGN.md §5.4): state machine, transitions, swipe-scrub, keyboard, chrome, contents, memory, preload. */
import motion from './motion.js';
import sound from './sound.js';

const gsap = window.gsap;
const $ = (s, r = document) => r.querySelector(s);
// a swipe may start on a button (the cover is one big button); only real form controls and gesture surfaces opt out
const NO_SCRUB = 'input, textarea, select, [data-gesture]';
const pad = n => String(n).padStart(2, '0');

export const isUnlocked = () => !!window.__issueUnlocked;

export function createManager({ config, scenes, startId, now }) {
  const stage = $('#stage');
  const chrome = {
    folioL: $('.folio-l'), folioC: $('.folio-c'), folioR: $('.folio-r'),
    sound: $('.sound-btn'), contents: $('.contents-btn'), skip: $('.skip-btn'), next: $('.next-btn'),
  };
  const contents = $('#contents');
  const hush = $('#hush');
  const announcer = $('#announcer');
  const reduced = motion.reduced;

  const pages = new Map();          // id -> { page, sheet, recto, verso, shade, edge }
  const visited = new Set();
  const memory = { stamps: [], specimens: [], tissues: 0, coverLines: [], approved: false, accepted: false };
  let cur = -1, state = 'BOOT', idleTimer = 0, returnVisit = false;
  let turning = false;              // a transition owns the stage (the incoming scene may already be ACTIVE mid-turn)
  let scrub = null;                 // active swipe-scrub
  const live = { timers: new Set(), listeners: [] };

  /* ---------- formatting ---------- */
  const bday = new Date(config.birthday);
  const vars = {
    name: config.name, NAME: config.name.toUpperCase(),
    sender: config.sender, SENDER: config.sender.toUpperCase(),
    age: String(config.age), year: String(bday.getFullYear()),
    date: bday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase(),
    birthdayShort: bday.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }),
    usualOrder: config.usualOrder,
    coffees: String(config.stats?.coffees ?? ''), tripsPlanned: String(config.stats?.tripsPlanned ?? ''), tripsTaken: String(config.stats?.tripsTaken ?? ''),
  };
  const fmt = s => String(s ?? '').replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
  const get = path => path.split('.').reduce((o, k) => (o == null ? o : o[k]), config);

  /* ---------- ctx (one per scene, guarded so a stale scene can't drive the manager) ---------- */
  function makeCtx(scene) {
    const isCur = () => scenes[cur] === scene;
    return {
      config, fmt, get, memory, sound, now,
      reduced, motion,
      get returnVisit() { return returnVisit; },
      complete: () => isCur() && complete(),
      next: () => isCur() && next(),
      goto: (id, opts = {}) => isCur() && goto(scenes.findIndex(s => s.id === id), opts),
      remember(key, value) {
        if (Array.isArray(memory[key])) { if (!memory[key].includes(value)) memory[key].push(value); }
        else memory[key] = value;
      },
      /* timers + listeners auto-cleared on leave */
      after(ms, fn) { const t = setTimeout(() => { live.timers.delete(t); fn(); }, ms); live.timers.add(t); return t; },
      every(ms, fn) { const t = setInterval(fn, ms); live.timers.add(t); return t; },
      clear(t) { clearTimeout(t); clearInterval(t); live.timers.delete(t); },
      on(target, type, fn, opts) { target.addEventListener(type, fn, opts); live.listeners.push([target, type, fn, opts]); },
      quiet() { clearTimeout(idleTimer); idleTimer = 0; hideSkip(); },  // scene is in a deliberate silence: no skip
      page: () => pages.get(scene.id),
    };
  }
  const ctxs = new Map(scenes.map(s => [s.id, makeCtx(s)]));

  /* ---------- mounting ---------- */
  function mount(scene) {
    if (pages.has(scene.id)) return pages.get(scene.id);
    const page = document.createElement('section');
    page.className = 'page' + (scene.fullBleed ? ' page--bleed' : '');
    page.dataset.scene = scene.id;
    page.setAttribute('aria-label', `Page ${scenes.indexOf(scene) + 1}: ${scene.title}`);
    page.hidden = true;
    page.innerHTML = `<div class="sheet"><div class="spread">${scene.fullBleed ? '' : '<aside class="verso" aria-hidden="true"></aside>'}<div class="recto"></div></div><div class="page-shade"></div><div class="page-edge"></div></div>`;
    stage.append(page);
    const p = { page, sheet: $('.sheet', page), recto: $('.recto', page), verso: $('.verso', page), shade: $('.page-shade', page), edge: $('.page-edge', page) };
    pages.set(scene.id, p);
    const ctx = ctxs.get(scene.id);
    if (p.verso && scene.verso) p.verso.innerHTML = scene.verso(ctx);
    scene.mount(p.recto, ctx);
    return p;
  }

  function preload(scene) {
    if (!scene || !isUnlocked()) return;
    const run = () => {
      mount(scene);
      (scene.assets?.(ctxs.get(scene.id)) || []).forEach(src => { const i = new Image(); i.src = src; i.decode?.().catch(() => {}); });
    };
    (window.requestIdleCallback || (f => setTimeout(f, 200)))(run);
  }

  /* ---------- lifecycle ---------- */
  function cleanupLive() {
    live.timers.forEach(t => { clearTimeout(t); clearInterval(t); });
    live.timers.clear();
    live.listeners.forEach(([t, ty, fn, o]) => t.removeEventListener(ty, fn, o));
    live.listeners.length = 0;
  }
  function leave(scene) {
    const p = pages.get(scene.id);
    cleanupLive();
    try { scene.leave?.(ctxs.get(scene.id)); } catch (e) { console.error(e); }
    // kill (don't revert): the outgoing page freezes as it slides away; enter() resets it next time.
    gsap.killTweensOf([p.recto, ...p.recto.querySelectorAll('*')]);
  }

  function setBody(scene) {
    document.body.dataset.tone = scene.tone || 'paper';
    document.body.dataset.scene = scene.id;
    if (scene.fullBleed) document.body.dataset.bleed = scene.id; else delete document.body.dataset.bleed;
  }

  function enter(idx, { focus = true } = {}) {
    const scene = scenes[idx];
    const p = mount(scene);
    cur = idx; visited.add(scene.id);
    state = 'ENTERING';
    setBody(scene);
    p.page.hidden = false; p.page.inert = false;
    p.page.classList.add('is-current'); p.page.classList.remove('is-incoming');
    updateChrome();
    announcer.textContent = `Page ${idx + 1}: ${scene.title}`;
    const q = new URLSearchParams(location.search); q.set('scene', scene.id);
    history.replaceState(null, '', `${location.pathname}?${q}`);
    // restore [data-arrive] and run enter() in the same task, so enter()'s from-states paint first
    p.page.querySelectorAll('[data-arrive]').forEach(n => { n.style.opacity = ''; });
    try { scene.enter(ctxs.get(scene.id)); } catch (e) { console.error(e); }
    state = 'ACTIVE';
    returnVisit = false;
    armIdle();
    preload(scenes[idx + 1]);
    if (focus) (p.recto.querySelector('[data-focus]') || p.recto.querySelector('h1, h2'))?.focus({ preventScroll: true });
  }

  function complete() {
    if (state !== 'ACTIVE') return;
    state = 'COMPLETE';
    clearTimeout(idleTimer); hideSkip();
    const scene = scenes[cur];
    unlockNext(scene.id);
    if (!scenes[cur + 1]) return;
    chrome.next.querySelector('.lbl').textContent = scene.nextLabel || 'Turn the page →';
    nav.next.classList.add('is-ready');
    setHint(hintFor('done'), true);
    chrome.next.hidden = false;
    chrome.next.classList.remove('is-pulse');
    gsap.fromTo(chrome.next, { opacity: 0, x: reduced ? 0 : -6 }, { opacity: 1, x: 0, duration: motion.dur.s, ease: motion.ease.couture, overwrite: 'auto', onComplete: () => chrome.next.classList.add('is-pulse') });
  }

  /* ---------- idle skip (§2.5) ---------- */
  function armIdle() {
    clearTimeout(idleTimer); hideSkip();
    const s = scenes[cur];
    if (state !== 'ACTIVE' || s.noSkip || !scenes[cur + 1]) return;
    idleTimer = setTimeout(() => {
      if (state !== 'ACTIVE') return;
      chrome.skip.hidden = false;
      gsap.fromTo(chrome.skip, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: motion.ease.couture });
    }, 10000);
  }
  function hideSkip() { chrome.skip.hidden = true; }
  ['pointerdown', 'keydown', 'wheel'].forEach(t => addEventListener(t, () => { if (state === 'ACTIVE' && (idleTimer || !chrome.skip.hidden)) armIdle(); }, { passive: true }));

  /* ---------- transitions ---------- */
  const turnDur = () => (reduced ? 0.2 : innerWidth >= 1024 ? 0.9 : 0.78);
  gsap.set('#paw', { xPercent: 100, yPercent: -50 });

  /* The Turn. Tap/keyboard: the incoming sheet leaves fast (power4.out, >25% in the first 100ms), the outgoing one
     sinks back. Scrub: everything linear so the page sits exactly under the thumb. */
  function addTurn(tl, from, to, dir, at = 0, { scrub = false, ease } = {}) {
    const D = turnDur();
    const inE = scrub ? 'none' : ease || 'power4.out', outE = scrub ? 'none' : ease || 'power2.out';
    tl.fromTo(from.sheet, { x: 0, xPercent: 0, rotation: 0, scale: 1 }, { xPercent: -8 * dir, rotation: -1.5 * dir, scale: 0.96, duration: D * 0.9, ease: outE }, at)
      .fromTo(from.shade, { opacity: 0 }, { opacity: 0.25, duration: D * 0.9, ease: outE }, at)
      .fromTo(to.sheet, { x: () => dir * innerWidth, rotation: 2.5 * dir, scale: 1 }, { x: 0, rotation: 0, duration: D, ease: inE }, at)
      // the ink lags the paper a touch: the page reads as a sheet carrying print, not a slide
      .fromTo(to.recto.children, { x: dir * 40 }, { x: 0, duration: D, ease: scrub ? 'none' : 'power3.out' }, at)
      // paper thickness: the leading edge shadow widens mid-turn, then narrows
      .fromTo(to.edge, { opacity: dir > 0 ? 1 : 0, scaleX: 1 }, { keyframes: { scaleX: [1, 2, 1] }, duration: D, ease: 'none' }, at)
      .to(to.edge, { opacity: 0, duration: D * 0.3, ease: 'none' }, at + D * 0.7);
    return D;
  }

  function prepare(from, to) {
    from.page.inert = true;
    to.page.hidden = false; to.page.inert = true;
    to.page.classList.add('is-incoming');
    // objects marked [data-arrive] wait for enter(); headlines are printed on the paper and ride in with it
    to.page.querySelectorAll('[data-arrive]').forEach(n => { n.style.opacity = '0'; });
    from.sheet.style.willChange = to.sheet.style.willChange = 'transform';
  }
  function cleanSheets(...ps) {
    ps.forEach(p => {
      gsap.set([p.sheet, p.shade, p.edge], { clearProps: 'all' });
      gsap.set(p.recto.children, { clearProps: 'transform' });
      p.sheet.style.willChange = '';
    });
  }
  /* land: the incoming scene starts mid-turn (35% of a tap turn, 65% of the paw), so the page arrives with ink already moving */
  function land(fromIdx, toIdx, focus = true) {
    const from = pages.get(scenes[fromIdx].id);
    from.page.classList.remove('is-current');
    enter(toIdx, { focus });
  }
  /* finish: the outgoing page is put away once the turn is over */
  function finish(fromIdx, toIdx) {
    const from = pages.get(scenes[fromIdx].id), to = pages.get(scenes[toIdx].id);
    from.page.hidden = true;
    cleanSheets(from, to);
    turning = false;
  }

  function buildTransition(fromIdx, toIdx, kind, { scrub = false } = {}) {
    const fromScene = scenes[fromIdx], toScene = scenes[toIdx];
    const from = pages.get(fromScene.id), to = mount(toScene);
    const dir = toIdx > fromIdx ? 1 : -1;
    const tl = gsap.timeline({ paused: true });
    const done = () => { land(fromIdx, toIdx); finish(fromIdx, toIdx); };
    prepare(from, to);
    chrome.next.hidden = true; hideSkip();

    if (reduced) {
      // 200ms crossfade; hush keeps its line (crossfades only)
      if (kind === 'hush') {
        hush.querySelector('.hush-line').textContent = fmt(get(toScene.hushLine) || '');
        tl.set(hush, { className: 'is-on' }).to(hush, { opacity: 1, duration: 0.2 })
          .fromTo('.hush-line', { opacity: 0, y: 0 }, { opacity: 1, duration: 0.2 })
          .to({}, { duration: 1.2 })
          .add(done)
          .to(hush, { opacity: 0, duration: 0.2 }).set(hush, { className: '' });
      } else {
        tl.fromTo(to.sheet, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' })
          .add(done);
      }
      return tl;
    }

    if (kind === 'hush') {
      const line = hush.querySelector('.hush-line');
      line.textContent = fmt(get(toScene.hushLine) || '');
      gsap.set(to.sheet, { opacity: 0 });
      tl.set(hush, { className: 'is-on' })
        // the lights dim the moment she taps
        .fromTo(hush, { opacity: 0 }, { opacity: 1, duration: 0.42, ease: 'power1.out' })
        .fromTo(line, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: motion.ease.couture })
        .to({}, { duration: 1.4 })
        .set(to.sheet, { opacity: 1 })
        .add(() => { hush.style.pointerEvents = 'none'; done(); })
        .to(hush, { opacity: 0, duration: 0.7, ease: motion.ease.couture })
        .add(() => { hush.className = ''; hush.style.pointerEvents = ''; });
      return tl;
    }

    if (kind === 'paw') {
      const paw = $('#paw');
      tl.set(paw, { className: 'is-on', xPercent: 100, yPercent: -50, x: 0 })
        .to(paw, { xPercent: 10, duration: 0.32, ease: motion.ease.snap })
        .add('turn');
      // the paw drags the page: one shared, weighted ease (this one is a camera move, not a tap response)
      const D = addTurn(tl, from, to, 1, tl.duration(), { ease: motion.ease.turn });
      tl.to(paw, { x: () => -innerWidth * 0.32, duration: D * 0.7, ease: motion.ease.turn }, 'turn')
        .to(paw, { xPercent: 100, x: 0, duration: 0.28, ease: motion.ease.exit }, `turn+=${D * 0.72}`)
        .add(() => land(fromIdx, toIdx), `turn+=${D * 0.65}`)
        .add(() => finish(fromIdx, toIdx), `turn+=${D}`)
        .set(paw, { className: '' });
      return tl;
    }

    if (kind === 'close') {
      /* The Close: every page as a card, fanned; they gather, the top card flips to the back cover's paper side
         and grows (FLIP) into the real back cover. Then a hard cut: no crossfade, no grey frame. */
      const closer = $('#closer');
      const last = scenes.length - 1;
      closer.innerHTML = scenes.map((s, i) => `<div class="mini${i === last ? ' is-top' : ''}"><span class="mono">P. ${pad(i + 1)}</span><b>${s.title}</b>${s.glyph || ''}</div>`).join('');
      const cards = [...closer.children];
      const n = cards.length, top = cards[n - 1];
      const target = () => {
        const bc = to.page.querySelector('.bcover') || to.sheet;
        const r = bc.getBoundingClientRect(), b = to.page.querySelector('.bc-border')?.getBoundingClientRect();
        return { r, b };
      };
      let T = null;
      gsap.set(to.sheet, { opacity: 0 });
      tl.set(closer, { className: 'is-on' })
        .set(cards, { transformOrigin: '50% 120%' })
        .to(from.sheet, { scale: 0.92, opacity: 0, duration: 0.5, ease: motion.ease.exit }, 0)
        .fromTo(cards, { scale: 0.4, opacity: 0, rotation: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: motion.ease.couture, stagger: 0.04 }, 0.2)
        .to(cards, { rotation: i => -24 + (48 * i) / (n - 1), duration: 0.7, ease: motion.ease.couture })
        .to(cards, { rotation: 0, duration: 0.45, ease: 'power2.inOut' })
        .to(cards.slice(0, -1), { opacity: 0, duration: 0.25, ease: 'none' }, '<')   // gone while they gather: no ghost stack
        .to(top, { rotationY: 90, transformPerspective: 900, duration: 0.2, ease: 'power2.in' })
        .add(() => {
          // edge-on: become the back cover's paper side (its border drawn where the real one sits)
          T = target();
          const { r, b } = T;
          const bx = b ? ((b.left - r.left) / r.width) * 120 : 8, by = b ? ((b.top - r.top) / r.height) * 160 : 8;
          const bw = b ? (b.width / r.width) * 120 : 104, bh = b ? (b.height / r.height) * 160 : 144;
          // stroke in card units = 1px once the card has grown to the real cover
          top.innerHTML = `<svg class="mini-border" viewBox="0 0 120 160" preserveAspectRatio="none" aria-hidden="true"><rect x="${bx.toFixed(2)}" y="${by.toFixed(2)}" width="${bw.toFixed(2)}" height="${bh.toFixed(2)}" fill="none" stroke="var(--ink)" stroke-width="${(120 / r.width).toFixed(3)}"/></svg>`;
          top.classList.add('is-back');
        })
        .set(top, { rotationY: -90 })
        .to(top, { rotationY: 0, duration: 0.28, ease: 'power2.out' })
        .set(top, { transformOrigin: '50% 50%' })
        .to(top, {
          x: () => T.r.left + T.r.width / 2 - innerWidth / 2,
          y: () => T.r.top + T.r.height / 2 - innerHeight / 2,
          scaleX: () => T.r.width / 120, scaleY: () => T.r.height / 160,
          duration: 0.7, ease: 'power3.inOut',
        })
        .add(() => { gsap.set(to.sheet, { opacity: 1 }); closer.className = ''; closer.innerHTML = ''; done(); });
      return tl;
    }

    const D = addTurn(tl, from, to, dir, 0, { scrub });
    // scrub turns land at the end (a drag can go back). Tap turns land at 35%: with power4.out the sheet is ~85%
    // across by then, so the ink starts moving as the paper arrives instead of after a blank beat
    if (scrub) tl.add(done, D);
    else tl.add(() => land(fromIdx, toIdx), D * 0.35).add(() => finish(fromIdx, toIdx), D);
    return tl;
  }

  function go(toIdx, { kind, returning = false } = {}) {
    if (turning || state === 'BOOT' || toIdx === cur || toIdx < 0 || toIdx >= scenes.length) return;
    if (toIdx > 0 && !isUnlocked()) return;   // the magic-word lock: nothing past page 1 until she says it
    const fromIdx = cur;
    const scene = scenes[toIdx];
    kind = kind || (toIdx > fromIdx ? scene.transition || 'turn' : 'turn');
    state = 'TURNING'; turning = true;
    if (!contentsClosing) closeContents(true);
    leave(scenes[fromIdx]);
    returnVisit = returning;   // read by the incoming scene's enter(), reset right after
    buildTransition(fromIdx, toIdx, kind).play();
    sound.play('paper');
  }
  function next() { if (turning) return; if (state === 'COMPLETE' || state === 'ACTIVE') { if (state === 'ACTIVE') state = 'COMPLETE'; go(cur + 1); } }
  function goto(idx, { returnVisit: rv = false } = {}) { go(idx, { kind: 'turn', returning: rv }); }

  /* ---------- swipe-scrub (§2.4) ---------- */
  stage.addEventListener('pointerdown', e => {
    if (turning || state !== 'COMPLETE' || !scenes[cur + 1] || e.target.closest(NO_SCRUB) || e.button > 0) return;
    scrub = { x: e.clientX, y: e.clientY, mode: 'pending', id: e.pointerId, v: 0, lx: e.clientX, lt: e.timeStamp, tl: null };
  });
  addEventListener('pointermove', e => {
    if (!scrub || e.pointerId !== scrub.id) return;
    const dx = e.clientX - scrub.x, dy = e.clientY - scrub.y;
    if (scrub.mode === 'pending') {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (Math.abs(dy) > Math.abs(dx) || dx > 0) { scrub = null; return; }
      const kind = scenes[cur + 1].transition || 'turn';
      if (kind !== 'turn' || reduced) { scrub.mode = 'flick'; swallowClick(); return; }
      scrub.mode = 'scrub';
      swallowClick();
      state = 'TURNING'; turning = true;
      scrub.from = cur;
      scrub.tl = buildTransition(cur, cur + 1, 'turn', { scrub: true });
    }
    if (scrub.mode === 'scrub') {
      const dt = Math.max(1, e.timeStamp - scrub.lt);
      scrub.v = (e.clientX - scrub.lx) / dt; scrub.lx = e.clientX; scrub.lt = e.timeStamp;
      scrub.tl.progress(Math.min(0.999, Math.max(0, -dx / innerWidth)), true);   // 1:1 with the thumb
    }
  });
  /* a drag that started on a button must not also press it */
  let swallowT = 0;
  const swallowClick = () => { clearTimeout(swallowT); swallow = true; swallowT = setTimeout(() => { swallow = false; }, 600); };
  let swallow = false;
  addEventListener('click', e => { if (swallow) { swallow = false; e.stopPropagation(); e.preventDefault(); } }, true);
  const endScrub = e => {
    if (!scrub || e.pointerId !== scrub.id) return;
    const s = scrub; scrub = null;
    const cancel = e.type === 'pointercancel';      // the browser took the gesture: never read clientX from it
    if (s.mode === 'flick') { if (!cancel && e.clientX - s.x < -60) next(); return; }
    if (s.mode !== 'scrub') return;
    const p = s.tl.progress(), D = turnDur();
    const commit = !cancel && (p > 0.35 || s.v < -0.4);
    if (commit) { leave(scenes[s.from]); sound.play('paper'); }
    gsap.to(s.tl, {
      progress: commit ? 1 : 0,
      duration: gsap.utils.clamp(0.18, 0.5, (commit ? 1 - p : p) * D * 0.6 + 0.12),
      ease: 'power2.out',
      onComplete: commit ? null : () => {
        const from = pages.get(scenes[s.from].id), to = pages.get(scenes[s.from + 1].id);
        to.page.hidden = true; to.page.classList.remove('is-incoming');
        to.page.querySelectorAll('[data-arrive]').forEach(n => { n.style.opacity = ''; });
        from.page.inert = false;
        cleanSheets(from, to);
        state = 'COMPLETE'; turning = false;
        chrome.next.hidden = false;
      },
    });
  };
  addEventListener('pointerup', endScrub);
  addEventListener('pointercancel', endScrub);

  /* ---------- chrome ---------- */
  function updateChrome() {
    const s = scenes[cur];
    chrome.folioL.textContent = `P. ${pad(cur + 1)}`;
    chrome.folioC.textContent = fmt('ISSUE Nº {{age}} — PRINT RUN: 1');
    chrome.folioR.textContent = fmt('{{NAME}} — Nº {{age}}');
    chrome.next.hidden = true;
    chrome.next.querySelector('.lbl').textContent = s.nextLabel || 'Turn the page →';
    syncNav();
  }
  /* bottom nav bar: always-on back / next, ignores scene gating (next() accepts ACTIVE too) */
  const nav = { bar: $('#navbar'), prev: $('.nav-prev'), next: $('.nav-next'), count: $('.nav-count') };
  nav.hint = $('.nav-hint'); nav.stops = $('.stops'); nav.walker = $('.walker');
  nav.stops.innerHTML = scenes.map(() => '<b></b>').join('');
  const hintFor = id => fmt((config.copy.nav && config.copy.nav[id]) || '');
  function setHint(text, done = false) {
    if (nav.hint.textContent === text) return;
    nav.hint.classList.toggle('is-done', done);
    gsap.timeline()
      .to(nav.hint, { opacity: 0, y: reduced ? 0 : 6, duration: 0.15, ease: 'power2.in', overwrite: 'auto' })
      .add(() => { nav.hint.textContent = text; })
      .to(nav.hint, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2.4)' });
  }
  let walkerAt = -1;
  /* NEXT stays dimmed + locked until the page's interaction is done (she should explore everything).
     ponytail: 75s safety unlock in case a scene never reports complete */
  const completedIds = new Set();
  let lockTimer = 0;
  function unlockNext(id, soft = false) {
    completedIds.add(id);
    clearTimeout(lockTimer);
    nav.next.classList.remove('is-locked'); nav.next.removeAttribute('aria-disabled');
    if (soft) setHint('psst… you can tap next now 🐾', true);
  }
  function lockNext() {
    const id = scenes[cur].id;
    clearTimeout(lockTimer);
    if (completedIds.has(id)) return unlockNext(id);
    nav.next.classList.add('is-locked'); nav.next.setAttribute('aria-disabled', 'true');
    if (cur > 0) lockTimer = setTimeout(() => { if (scenes[cur].id === id) unlockNext(id, true); }, 75000);
  }
  const setNavH = () => document.documentElement.style.setProperty('--navh', nav.bar.hidden ? '0px' : `${nav.bar.offsetHeight}px`);
  new ResizeObserver(setNavH).observe(nav.bar);
  function syncNav() {
    nav.bar.hidden = scenes[cur].id === 'press' && now() < bday;
    nav.prev.hidden = cur <= 0;
    nav.next.hidden = !scenes[cur + 1];
    nav.count.textContent = `Page ${cur + 1} of ${scenes.length}`;
    [...nav.stops.children].forEach((b, i) => { b.classList.toggle('is-visited', visited.has(scenes[i].id)); b.classList.toggle('is-here', i === cur); });
    // the little cat walks the trail to this page, hopping as it goes
    const pct = scenes.length > 1 ? (cur / (scenes.length - 1)) * 100 : 0;
    if (reduced || walkerAt < 0) gsap.set(nav.walker, { left: `${pct}%`, scaleX: 1 });
    else {
      const dir = cur >= walkerAt ? 1 : -1, hops = Math.max(1, Math.abs(cur - walkerAt));
      gsap.set(nav.walker, { scaleX: dir });
      gsap.to(nav.walker, { left: `${pct}%`, duration: 0.5 + hops * 0.18, ease: 'power2.inOut', overwrite: 'auto' });
      gsap.fromTo(nav.walker, { y: 0 }, { y: -7, duration: 0.14, ease: 'sine.out', yoyo: true, repeat: hops * 2 - 1 });
    }
    walkerAt = cur;
    nav.next.classList.remove('is-ready');
    setHint(hintFor(scenes[cur].id));
    lockNext();
    setNavH();
  }
  nav.prev.addEventListener('click', () => { if (!turning && cur > 0) goto(cur - 1); });
  nav.next.addEventListener('click', () => {
    if (nav.next.classList.contains('is-locked')) {   // not yet: wiggle and repeat what to do
      gsap.fromTo(nav.next, { x: 0 }, { keyframes: { x: [0, -8, 8, -6, 6, 0] }, duration: reduced ? 0.01 : 0.4, ease: 'none', overwrite: 'auto' });
      const h = hintFor(scenes[cur].id);
      nav.hint.textContent = ''; setHint(`first, ${h}`);
      return;
    }
    if (!turning && state === 'ENTERING') state = 'ACTIVE'; next();
  });
  chrome.next.addEventListener('click', () => next());
  chrome.skip.addEventListener('click', () => { if (state === 'ACTIVE') { complete(); next(); } });
  const syncSound = () => { chrome.sound.textContent = `SOUND: ${sound.on ? 'ON' : 'OFF'}`; chrome.sound.setAttribute('aria-pressed', String(sound.on)); };
  chrome.sound.addEventListener('click', () => { sound.toggle(); syncSound(); });
  syncSound();

  /* ---------- contents (§3.2) ---------- */
  const list = $('.contents-list', contents);
  const sheet = $('.contents-sheet', contents);
  const scrim = $('.contents-scrim', contents);
  let contentsClosing = false;
  function openContents() {
    if (turning || !contents.hidden) return;
    list.innerHTML = scenes.map((s, i) => {
      // unread pages are redacted, bar length = the real title's length (the joke is that it's all there)
      const inner = `<span class="pg">${pad(i + 1)}</span><span class="t">${visited.has(s.id) ? s.title : `<span class="redact" style="width:${Math.min(16, s.title.length * 0.55)}em" aria-hidden="true"></span><span class="sr-only">Not yet read</span>`}</span><span class="f">${visited.has(s.id) ? s.feeling : '<span class="redact" aria-hidden="true"></span>'}</span>`;
      if (i === cur) return `<li><div class="contents-row is-here" aria-current="page">${inner}</div></li>`;
      return visited.has(s.id)
        ? `<li><button class="contents-row" type="button" data-i="${i}">${inner}</button></li>`
        : `<li><div class="contents-row">${inner}</div></li>`;
    }).join('');
    contents.hidden = false;
    gsap.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.3, overwrite: 'auto' });
    gsap.fromTo(sheet, { yPercent: 100 }, { yPercent: 0, ...motion.sp('settle') });
    (list.querySelector('button') || $('.contents-close', contents)).focus({ preventScroll: true });
  }
  function closeContents(instant = false, refocus = true) {
    if (contents.hidden) return;
    if (instant) { gsap.killTweensOf([scrim, sheet]); contents.hidden = true; contentsClosing = false; return; }
    contentsClosing = true;
    gsap.to(scrim, { opacity: 0, duration: 0.25, overwrite: 'auto' });
    gsap.to(sheet, { yPercent: 100, duration: 0.3, ease: motion.ease.exit, overwrite: 'auto', onComplete: () => { contents.hidden = true; contentsClosing = false; } });
    if (refocus) chrome.contents.focus({ preventScroll: true });
  }
  chrome.contents.addEventListener('click', openContents);
  contents.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) return closeContents();
    const b = e.target.closest('button[data-i]');
    if (b) { closeContents(false, false); goto(+b.dataset.i); }   // the sheet drops while the page turns
  });

  /* ---------- keyboard ---------- */
  addEventListener('keydown', e => {
    if (!contents.hidden) {
      if (e.key === 'Escape') closeContents();
      if (e.key === 'Tab') { // trap focus in the sheet
        const f = [...contents.querySelectorAll('button')];
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f.at(-1).focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
      return;
    }
    if (e.target.closest?.('input, textarea')) return;
    if ((e.key === 'ArrowRight' || e.key === 'PageDown') && state === 'COMPLETE') { e.preventDefault(); next(); }
    if ((e.key === 'ArrowLeft' || e.key === 'PageUp') && !turning && cur > 0 && visited.has(scenes[cur - 1].id)) { e.preventDefault(); goto(cur - 1); }
  });

  /* ---------- boot ---------- */
  let start = isUnlocked() ? scenes.findIndex(s => s.id === startId) : -1;   // ?scene= only works after the lock is opened
  if (startId && start < 0) console.warn(`Unknown scene "${startId}", starting at press.`);
  if (start < 0) start = 0;
  scenes.slice(0, start).forEach(s => visited.add(s.id));
  enter(start, { focus: false });

  return { memory, get state() { return state; } };
}
