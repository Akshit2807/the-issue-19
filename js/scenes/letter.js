/* Scene 8 · letter — The Letter (Tissue Included). Feeling: BEING LOVED, then crying about it, then laughing about crying. */
const gsap = window.gsap;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const TISSUE_BOX = `<svg viewBox="0 0 64 48" aria-hidden="true">
  <path d="M19 15 C21 9 25 3 31 -1 C33 4 38 9 45 15 Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M31 -1 C30 5 29 10 27 15" fill="none" stroke="var(--ink)" stroke-width=".8" opacity=".5"/>
  <path d="M4 14 L60 14 L59 46 L5 46 Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M18 18 C22 12 42 12 46 18 C42 21 22 21 18 18Z" fill="var(--ink)" opacity=".85"/>
  <path d="M10 30 L54 30 M10 34 L40 34" stroke="var(--ink)" stroke-width=".8" opacity=".35" stroke-linecap="round"/>
</svg>`;
const TISSUE = `<svg viewBox="0 0 60 50" aria-hidden="true"><path d="M6 10 C14 2 24 8 32 4 C40 0 50 6 55 12 C52 22 57 30 52 40 C44 46 34 42 26 47 C18 50 10 44 5 38 C9 28 2 20 6 10Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.1" stroke-linejoin="round"/><path d="M14 18 C22 22 30 16 40 22 M16 30 C24 34 34 28 44 33" stroke="var(--petal)" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`;

/* a tiny Espresso for the stamp: she sits, tail curled, collar red */
const espressoMini = `<svg viewBox="0 0 40 46" aria-hidden="true"><path d="M13 16 L12 5 L18 11 C19.5 10.6 21.5 10.6 23 11 L29 5 L28 16 C30 19 30 23 28 25 C33 30 34 38 32 44 L10 44 C8 38 9 30 14 25 C12 23 12 19 13 16Z" fill="var(--ink)"/><path d="M32 44 C38 44 39 37 35 35" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/><path d="M15 24.5 C18 26.5 24 26.5 27 24.5" fill="none" stroke="var(--red)" stroke-width="1.6" stroke-linecap="round"/><circle cx="17.5" cy="18" r="1.1" fill="var(--paper)"/><circle cx="24.5" cy="18" r="1.1" fill="var(--paper)"/></svg>`;

/* the postage stamp + postmark + address that make the envelope an object */
const POSTMARK = d => `<svg class="postmark" viewBox="0 0 120 60" aria-hidden="true"><g filter="url(#ink)" fill="none" stroke="currentColor">
  <circle cx="34" cy="30" r="24" stroke-width="1.6"/><circle cx="34" cy="30" r="18" stroke-width=".8"/>
  <text x="34" y="29" text-anchor="middle" font-size="9" stroke="none" fill="currentColor" font-family="DM Mono, monospace">00:00</text>
  <text x="34" y="39" text-anchor="middle" font-size="5.5" stroke="none" fill="currentColor" font-family="DM Mono, monospace" letter-spacing=".6">${d}</text>
  <path d="M60 20 C70 16 80 24 90 20 S110 16 118 20 M60 30 C70 26 80 34 90 30 S110 26 118 30 M60 40 C70 36 80 44 90 40 S110 36 118 40" stroke-width="1.3"/></g></svg>`;

const polaroid = (p, i, side) => p ? `
  <button class="lp lp--${side}" type="button" aria-label="Photo: ${esc(p.alt)}. Flip it over.">
    <span class="tape"></span>
    <span class="lp-inner">
      <span class="lp-face lp-front polaroid"><img src="${p.src}" alt="${esc(p.alt)}" width="400" height="300" loading="lazy" decoding="async"><span class="lp-cap">${esc(p.caption || '')}</span></span>
      <span class="lp-face lp-back"><span class="redpen">${esc(p.back || '…')}</span></span>
    </span>
  </button>` : '';

export default {
  id: 'letter',
  title: 'The Letter',
  feeling: 'Being celebrated',
  tone: 'paper',
  transition: 'hush',
  hushLine: 'copy.hush.letter',
  nextLabel: 'Close the magazine →',
  noSkip: true,
  assets: () => [],
  glyph: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="8" y="14" width="32" height="22"/><path d="M8 14l16 12 16-12"/></svg>`,

  verso(ctx) {
    return `<div class="plate">
      <p class="mono plate-folio"><span>P. 08</span><span>THE LETTER</span></p>
      <h2 class="h2 plate-title">The Letter</h2>
      <p class="mono plate-feeling">FEELING — BEING CELEBRATED</p>
      <p class="deck plate-deck">Tissue included. Not required. Recommended.</p>
    </div>`;
  },

  mount(el, ctx) {
    const L = ctx.config.letter, t = [];   // no photos in the letter
    // editorial convention: after the drop cap, the rest of the first words run in small caps
    const paras = L.paragraphs.map((p, i) => {
      const txt = esc(ctx.fmt(p));
      if (i) return `<p class="lpara">${txt}</p>`;
      const m3 = txt.match(/^(\S+\s+\S+\s+\S+)(.*)$/s);
      return `<p class="lpara">${m3 ? `<span class="lead">${m3[1]}</span>${m3[2]}` : txt}</p>`;
    });
    const body = paras.join('');
    el.innerHTML = `
      <div class="letter-scene">
        <div class="stock stock--blush"></div>
        <div class="env-stage" data-arrive>
          <h2 class="sr-only" tabindex="-1" data-focus>The Letter. Open the envelope.</h2>
          <button class="env" type="button" aria-label="Open the envelope">
            <span class="env-back"></span>
            <span class="env-paper"><span class="env-paper-lines"></span></span>
            <span class="env-front"><svg viewBox="0 0 300 190" preserveAspectRatio="none" aria-hidden="true"><path d="M1 1 L150 112 L299 1 L299 189 L1 189 Z" fill="var(--paper)"/><path d="M1 189 L128 96 M299 189 L172 96" fill="none" stroke="var(--ink)" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linecap="round"/><path d="M1 1 L1 189 L299 189 L299 1" fill="none" stroke="var(--ink)" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg></span>
            <span class="env-dress" aria-hidden="true">
              <span class="pstamp-perf"><span class="pstamp-art">${espressoMini}</span><span class="mono pstamp-val">Nº ${esc(ctx.fmt('{{age}}'))}</span></span>
              ${POSTMARK(esc(ctx.fmt('{{birthdayShort}}').toUpperCase()))}
              <span class="redpen env-address">${(ctx.get('copy.letter.address') || []).map(l => `<span>${esc(ctx.fmt(l))}</span>`).join('')}</span>
            </span>
            <span class="env-flap">
              <span class="flap-face flap-front"><svg viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true"><path d="M1 1 L150 118 L299 1 Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg><i class="seal"><b>Nº</b></i></span>
              <span class="flap-face flap-back"></span>
            </span>
          </button>
          <p class="mono env-label">${esc(ctx.fmt(ctx.get('copy.letter.envelope')))}</p>
          <p class="caption env-hint">tap, or swipe up</p>
        </div>
        <div class="letter" tabindex="-1" aria-label="The letter">
          <div class="letter-inner">
            <h3 class="greeting reveal">${esc(ctx.fmt(L.greeting))}</h3>
            <div class="lbody">${body}</div>
            <p class="redpen signoff"></p>
            ${t[4] ? `<figure class="develop reveal"><span class="dev-wrap polaroid"><span class="dev-img"><img class="dev-color" src="${t[4].src}" alt="${esc(t[4].alt)}" width="400" height="300" loading="lazy"><span class="dev-top duotone"><img src="${t[4].src}" alt="" width="400" height="300" loading="lazy"></span></span><span class="lp-cap mono">${esc(ctx.fmt('DEVELOPING… — {{date}}'))}</span></span></figure>` : ''}
            <p class="mono letter-end">— END OF LETTER —</p>
          </div>
        </div>
        <!-- the tissue box sits on the desk above the letter, never on the text -->
        <div class="tissue-dock" hidden>
          <div class="tissue-words"><p class="redpen tissue-tag">${esc(ctx.fmt(ctx.get('copy.letter.tissueTag')))}</p><p class="mono tissue-count" aria-live="polite">TISSUES USED: 0</p></div>
          <button class="tissue-box" type="button" aria-label="Take a tissue">${TISSUE_BOX}</button>
        </div>
        <p class="redpen note tissue-note" aria-live="polite"></p>
      </div>`;
    this.el = el;
  },

  enter(ctx) {
    const el = this.el, R = ctx.reduced, $ = s => el.querySelector(s), m = ctx.motion;
    const env = $('.env'), letter = $('.letter'), inner = $('.letter-inner'), dock = $('.tissue-dock');
    let opened = false, tissues = 0, signed = false;

    // reset
    $('.env-stage').hidden = false;
    letter.hidden = true; dock.hidden = true;
    letter.scrollTop = 0;
    gsap.set([env, $('.env-paper'), $('.env-flap'), $('.env-label'), $('.env-hint')], { clearProps: 'all' });
    gsap.set(el.querySelectorAll('.reveal, .lpara'), { opacity: 0, y: R ? 0 : 24 });
    gsap.set(el.querySelectorAll('.lp-inner'), { rotationY: 0 });
    el.querySelectorAll('.tissue').forEach(t => t.remove());
    $('.tissue-count').textContent = 'TISSUES USED: 0';
    $('.tissue-note').innerHTML = ''; $('.signoff').innerHTML = '';

    if (R) gsap.fromTo([env, $('.env-label'), $('.env-hint')], { opacity: 0 }, { opacity: 1, duration: 0.2 });
    else gsap.timeline()
      .fromTo(env, { y: 30, opacity: 0, rotation: -3 }, { y: 0, opacity: 1, rotation: 0, duration: 1.2, ease: 'expo.out' })
      .fromTo([$('.env-label'), $('.env-hint')], { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.2 }, 0.5);

    /* stage 1: the envelope */
    const open = () => {
      if (opened) return; opened = true;
      ctx.sound.play('paper');
      const paper = $('.env-paper'), flap = $('.env-flap');
      const pr = paper.getBoundingClientRect();
      const fill = Math.max(innerWidth / pr.width, innerHeight / pr.height) * 1.08;
      const sr = el.getBoundingClientRect();
      const toCx = sr.left + sr.width / 2 - (pr.left + pr.width / 2), toCy = sr.top + sr.height / 2 - (pr.top + pr.height / 2);
      const tl = gsap.timeline({ onComplete: showLetter });
      if (R) { tl.to([env, $('.env-label'), $('.env-hint')], { opacity: 0, duration: 0.2 }); return; }
      tl.to([$('.env-label'), $('.env-hint'), $('.env-dress')], { opacity: 0, duration: 0.3 }, 0)
        .to(flap, { rotationX: -180, duration: 0.6, ease: 'power2.inOut' }, 0)
        .set(flap, { zIndex: 1 }, 0.3)
        .to(paper, { yPercent: -60, duration: 0.7, ease: 'expo.out' }, 0.75)
        .set(paper, { zIndex: 6 }, 1.25)
        .to(paper, { x: toCx, y: toCy - pr.height * 0.0, yPercent: 0, scale: fill, duration: 0.7, ease: 'power2.inOut' }, 1.25)
        .to([$('.env-back'), $('.env-front'), $('.env-dress'), flap], { y: 40, opacity: 0, duration: 0.4, ease: 'power2.in' }, 1.25);
    };
    const showLetter = () => {
      letter.hidden = false;
      gsap.fromTo(letter, { opacity: 0 }, { opacity: 1, duration: R ? 0.2 : 0.5, ease: 'none', onComplete: () => { $('.env-stage').hidden = true; } });
      letter.focus({ preventScroll: true });
      dock.hidden = false;
      gsap.fromTo(dock, { opacity: 0, y: R ? 0 : -8 }, { opacity: 1, y: 0, duration: R ? 0.2 : 0.6, ease: 'expo.out', delay: R ? 0 : 0.4 });
      observe();
    };
    ctx.on(env, 'click', open);
    let sy = null;
    ctx.on(env, 'pointerdown', e => { sy = e.clientY; });
    ctx.on(env, 'pointerup', e => { if (sy != null && e.clientY - sy < -30) open(); sy = null; });

    /* stage 2: paragraphs settle as she scrolls (no tricks) */
    const observe = () => {
      this.io?.disconnect();
      this.io = new IntersectionObserver(entries => entries.forEach(en => {
        if (!en.isIntersecting) return;
        const t = en.target; this.io.unobserve(t);
        if (t.classList.contains('signoff')) return writeSignoff();
        gsap.to(t, { opacity: 1, y: 0, duration: R ? 0.3 : 0.9, ease: 'expo.out' });
        if (t.classList.contains('develop')) gsap.to($('.dev-top'), { opacity: 0, duration: 3, ease: 'power1.inOut', delay: 0.6 });
      }), { root: letter, rootMargin: '0px 0px -15% 0px' });
      el.querySelectorAll('.reveal, .lpara, .signoff').forEach(n => this.io.observe(n));
    };
    const writeSignoff = () => {
      if (signed) return; signed = true;
      m.redpen($('.signoff'), ctx.fmt(ctx.config.letter.signoff), { duration: 1.4 });
      ctx.after(R ? 300 : 1500, () => ctx.complete());
    };

    /* polaroid flip */
    ctx.on(dock, 'click', e => { if (e.target.closest('.tissue-box')) pullTissue(); });
    ctx.on(inner, 'click', e => {
      const b = e.target.closest('.lp');
      if (b) {
        const inn = b.querySelector('.lp-inner');
        const flipped = gsap.getProperty(inn, 'rotationY') > 90;
        gsap.to(inn, { rotationY: flipped ? 0 : 180, ...m.sp('lift') });
        ctx.sound.play('paper');
      }
    });

    /* the tissue box: passive, never required */
    const pullTissue = () => {
      if (tissues >= 3) { m.redpen($('.tissue-note'), ctx.fmt(ctx.get('copy.letter.tissuesOut'))); return; }
      tissues++;
      ctx.remember('tissues', tissues);
      $('.tissue-count').textContent = `TISSUES USED: ${tissues}`;
      const box = $('.tissue-box').getBoundingClientRect(), ir = inner.getBoundingClientRect();
      const t = document.createElement('div');
      t.className = 'tissue'; t.innerHTML = TISSUE;
      inner.append(t);
      const sx = box.left - ir.left - 2, sy0 = box.bottom - ir.top;
      const measure = Math.min(ir.width - 80, 520);
      const tx = 20 + Math.random() * (measure - 40), ty = letter.scrollTop + letter.clientHeight * (0.35 + Math.random() * 0.35);
      gsap.set(t, { x: sx, y: sy0, rotation: 0 });
      ctx.sound.play('paper');
      if (R) { gsap.set(t, { x: tx, y: ty, rotation: gsap.utils.random(-15, 15) }); gsap.fromTo(t, { opacity: 0 }, { opacity: 1, duration: 0.2 }); return; }
      gsap.timeline()
        .to(t, { y: sy0 + 30, ...m.presets.stamp })
        .fromTo(t, { rotation: -14 }, { rotation: 0, ...m.presets.wobble }, '<')
        .to(t, { x: tx, duration: 1.2, ease: 'sine.inOut' }, '-=0.5')
        .to(t, { y: ty, duration: 1.2, ease: 'power2.out' }, '<')
        .to(t, { rotation: gsap.utils.random(-15, 15), duration: 1.2, ease: 'sine.inOut' }, '<');
    };
  },

  leave() { this.io?.disconnect(); },
};
