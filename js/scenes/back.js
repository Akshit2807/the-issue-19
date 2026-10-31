/* Scene 9 · back — The Back Cover. Feeling: EUPHORIA, settling into WARMTH. */
const gsap = window.gsap;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CAP = 36;

/* the product: a faceted Didone-label bottle, ink line on paper, foil cap. Eau de toi. */
const BOTTLE = (label, age) => `
  <svg class="bc-bottle" viewBox="0 0 140 190" aria-hidden="true">
    <defs><linearGradient id="bc-glass" x1="0" x2="1">
      <stop offset="0" stop-color="var(--paper)"/><stop offset=".14" stop-color="#fffdf8"/><stop offset=".24" stop-color="var(--paper)"/>
      <stop offset=".86" stop-color="var(--newsprint)"/><stop offset="1" stop-color="#d9cdb8"/></linearGradient>
      <linearGradient id="bc-foil" x1="0" x2="1"><stop offset="0" stop-color="#8c6d31"/><stop offset=".3" stop-color="#e6cf94"/><stop offset=".55" stop-color="var(--foil)"/><stop offset="1" stop-color="#7a5e2a"/></linearGradient></defs>
    <ellipse cx="70" cy="184" rx="52" ry="4" fill="var(--ink)" opacity=".12"/>
    <rect x="52" y="4" width="36" height="36" rx="2" fill="url(#bc-foil)" stroke="var(--ink)" stroke-width="1.5"/>
    <path d="M52 30 H88" stroke="var(--ink)" stroke-width=".8" opacity=".5"/>
    <rect x="59" y="40" width="22" height="11" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5"/>
    <path d="M22 66 L38 51 H102 L118 66 V166 L102 181 H38 L22 166 Z" fill="url(#bc-glass)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M38 51 L44 62 H96 L102 51 M44 62 V170 L38 181 M96 62 V170 L102 181 M44 170 H96 M22 66 L44 62 M118 66 L96 62 M22 166 L44 170 M118 166 L96 170" fill="none" stroke="var(--ink)" stroke-width=".8" opacity=".45"/>
    <path d="M30 72 V158" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>
    <rect x="49" y="96" width="42" height="46" fill="var(--paper)" stroke="var(--ink)" stroke-width="1"/>
    <rect x="52" y="99" width="36" height="40" fill="none" stroke="var(--ink)" stroke-width=".5"/>
    <text class="bc-label" x="70" y="118" text-anchor="middle" font-size="7.4" textLength="32" lengthAdjust="spacingAndGlyphs">${label}</text>
    <text x="70" y="127" text-anchor="middle" font-size="4.2" font-family="DM Mono, monospace" letter-spacing=".5" fill="var(--muted)">EAU DE TOI</text>
    <text x="70" y="135" text-anchor="middle" font-size="4.2" font-family="DM Mono, monospace" letter-spacing=".5" fill="var(--red)">Nº ${age}</text>
  </svg>`;

export default {
  id: 'back',
  title: 'The Back Cover',
  feeling: 'Euphoria',
  tone: 'paper',
  fullBleed: true,
  transition: 'close',
  glyph: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="11" y="7" width="26" height="34"/><path d="M16 22h16M18 27h12"/></svg>`,

  mount(el, ctx) {
    const name = ctx.fmt('{{name}}');
    el.innerHTML = `
      <div class="back">
        <button class="bcover" type="button" aria-label="Tap the back cover">
          <span class="bc-border"></span>
          <span class="bc-ad" data-arrive>
            <span class="mono bc-top">ADVERTISEMENT</span>
            <span class="bc-word" aria-label="${esc(ctx.fmt(ctx.get('copy.back.product') || 'FRIENDSHIP'))}.">${[...`${ctx.fmt(ctx.get('copy.back.product') || 'FRIENDSHIP')}.`].map(l => `<span class="ltr" aria-hidden="true">${esc(l)}</span>`).join('')}</span>
            <span class="deck bc-deck">${esc(ctx.fmt(ctx.get('copy.back.deck') || 'The fragrance.'))}</span>
            <span class="bc-product">${BOTTLE(esc(ctx.fmt(ctx.get('copy.back.product') || 'FRIENDSHIP')), esc(ctx.fmt('{{age}}')))}</span>
            <span class="mono bc-notes">${esc(ctx.fmt(ctx.get('copy.back.notes') || ''))}</span>
            <span class="mono bc-terms">${esc(ctx.fmt(ctx.get('copy.back.terms')))}</span>
            <span class="bc-foil"></span>
            <span class="h3 bc-next">NEXT ISSUE: 365 DAYS FROM NOW.</span>
            <span class="mono bc-hint">TAP THE COVER</span>
          </span>
        </button>
        <div class="shreds" aria-hidden="true"></div>
        <div class="finale">
          <h2 class="h1 finale-h" tabindex="-1"><span class="ml"><span>Happy</span></span><span class="ml"><span>birthday,</span></span><span class="ml"><span>${esc(name)}.</span></span></h2>
          <div class="finale-actions">
            <button class="btn again" type="button">[ READ AGAIN ]</button>
            ${ctx.config.replyLink ? `<a class="btn btn--primary reply" href="${esc(ctx.config.replyLink)}" target="_blank" rel="noopener">[ REPLY TO THE EDITOR ]</a>` : ''}
            <p class="redpen colophon">${esc(ctx.fmt(ctx.get('copy.back.colophon')))}</p>
            <a class="mono credits" href="assets/CREDITS.md" target="_blank" rel="noopener">IMAGE CREDITS</a>
          </div>
        </div>
      </div>`;
    this.el = el;
  },

  fragments(ctx) {
    const mem = ctx.memory, out = [];
    const push = (text, kind) => text && !out.some(o => o.text === text) && out.push({ text: String(text), kind });
    mem.stamps.forEach(s => push(s, 'mono'));
    mem.specimens.forEach(s => push(s, 'serif'));
    if (mem.tissues) push(`TISSUES USED: ${mem.tissues}`, 'mono');
    mem.coverLines.slice(0, 6).forEach(s => push(ctx.fmt(s), 'serif'));
    if (mem.approved) push('APPROVED', 'mono');
    if (mem.accepted) push('ACCEPTED', 'mono');
    if (mem.stamps.length || mem.specimens.length) push('GUEST EDITOR', 'mono');
    // three big Bodoni fragments give the pile a hierarchy, like a torn-magazine collage
    push(ctx.fmt('{{name}}'), 'big'); push(String(ctx.config.age), 'big'); push('yes', 'big');
    (ctx.get('copy.back.shreds') || []).forEach(s => push(ctx.fmt(s), /^[A-Z0-9 ·:…%]+$/.test(s) ? 'mono' : 'serif'));
    return out.slice(0, CAP);   // never repeat a fragment: a duplicate reads as a bug
  },

  enter(ctx) {
    const el = this.el, R = ctx.reduced, $ = s => el.querySelector(s), m = ctx.motion;
    const box = $('.shreds');
    let burstN = 0, revealed = false, scheduled = false, landed = false;

    // reset
    box.innerHTML = '';
    gsap.set($('.finale'), { autoAlpha: 0 });
    gsap.set(el.querySelectorAll('.finale-h .ml > span'), { yPercent: 105 });
    gsap.set($('.finale-actions'), { autoAlpha: 0, y: 0 });
    gsap.set($('.bc-ad'), { opacity: 1 });
    gsap.set($('.bc-ad').children, { autoAlpha: 1 });
    $('.bc-hint').hidden = false;

    if (R) gsap.fromTo($('.bc-ad').children, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    else gsap.timeline()
      .fromTo($('.bc-top'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.1)
      // the word tightens without layout: per-letter x, not letter-spacing
      .fromTo(el.querySelectorAll('.bc-word .ltr'), { x: (i, t, a) => (i - (a.length - 1) / 2) * 6, opacity: 0 }, { x: 0, opacity: 1, duration: 1.4, ease: 'expo.out' }, 0.2)
      .fromTo($('.bc-product'), { opacity: 0, y: 14, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'expo.out' }, 0.45)
      .fromTo([$('.bc-deck'), $('.bc-notes'), $('.bc-terms'), $('.bc-foil'), $('.bc-next')], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.08 }, 0.6)
      .fromTo($('.bc-hint'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.6);

    const frags = this.fragments(ctx);
    const build = () => {
      box.innerHTML = frags.map((f, i) => `<span class="shred shred--${f.kind} ${i % 3 === 0 ? 'is-news' : ''} ${i % 4 === 1 ? 'is-red' : ''}" style="clip-path:url(#torn-${'abc'[i % 3]})">${esc(f.text)}</span>`).join('');
      return [...box.children];
    };

    const W = () => box.clientWidth, H = () => box.clientHeight;
    const restSpot = s => ({
      x: gsap.utils.random(8, Math.max(10, W() - s.offsetWidth - 8)),
      y: H() * (innerWidth < 600 ? gsap.utils.random(0.38, 0.66) : gsap.utils.random(0.4, 0.72)),
      rotation: gsap.utils.random(-25, 25),
    });

    /* the burst sprays from the bottle (or the tap point if there's no bottle on screen) */
    const origin = (x, y) => {
      const b = $('.bc-bottle')?.getBoundingClientRect(), r = box.getBoundingClientRect();
      return b && b.width ? [b.left + b.width / 2 - r.left, b.top + b.height * 0.25 - r.top] : [x, y];
    };
    const burst = (px, py) => {
      [px, py] = origin(px, py);
      burstN++;
      const fresh = !box.children.length;
      const shreds = fresh ? build() : [...box.children];
      gsap.killTweensOf(shreds);                     // a re-tap mid-flight re-throws from where they are, no snapping
      gsap.to($('.bc-ad').children, { autoAlpha: 0, duration: 0.3, overwrite: 'auto' });   // no ghost ad behind the headline
      $('.bc-hint').hidden = true;
      ctx.sound.play('paper'); ctx.sound.haptic();
      let last = 0;
      shreds.forEach((s, i) => {
        const end = restSpot(s);
        if (R) { gsap.set(s, { x: end.x, y: end.y, rotation: end.rotation, opacity: 1 }); return; }
        const d = gsap.utils.random(1.4, 1.9), at = Math.random() * 0.12;
        last = Math.max(last, d + at);
        if (fresh) gsap.set(s, { x: px - s.offsetWidth / 2, y: py - s.offsetHeight / 2, rotation: 0, opacity: 1 });
        const side = Math.random() < 0.5 ? -1 : 1;
        const peakX = gsap.utils.clamp(-40, W() - 40, (fresh ? px : gsap.getProperty(s, 'x')) + side * innerWidth * gsap.utils.random(0.4, 0.55) * 0.5);
        gsap.timeline({ delay: at })
          .to(s, { x: peakX, duration: d * 0.45, ease: 'power2.out' }, 0)
          .to(s, { x: end.x, duration: d * 0.55, ease: 'sine.inOut' }, d * 0.45)
          // a re-tap re-throws from where they are, but never off the top of the page
          .to(s, { y: Math.max(-H() * 0.04, (fresh ? py : gsap.getProperty(s, 'y')) - innerHeight * gsap.utils.random(0.25, 0.45)), duration: d * 0.45, ease: 'power2.out' }, 0)
          .to(s, { y: end.y, duration: d * 0.55, ease: 'power3.in' }, d * 0.45)
          .to(s, { rotation: end.rotation + 360 * gsap.utils.random([-1, 1]), duration: d, ease: 'power1.out' }, 0)
          .fromTo(s, { scaleY: 1 }, { keyframes: { scaleY: [1, 0.86, 1] }, duration: 0.2, ease: 'power1.out' }, d)
          .add(() => i % 6 === 0 && ctx.sound.play('tick'), d);
      });
      if (!R && !landed) { landed = true; ctx.after(1450, () => m.shake($('.back'), 2)); }   // the first landing hits the table
      if (!scheduled) { scheduled = true; ctx.after(R ? 200 : (last + 0.3) * 1000, revealFinale); }
    };

    const revealFinale = () => {
      if (revealed) return;
      revealed = true;
      gsap.set($('.finale'), { autoAlpha: 1 });
      const tl = gsap.timeline();
      tl.add(m.maskReveal(el.querySelectorAll('.finale-h .ml > span'), { duration: 1 }))
        .add(() => { ctx.complete(); $('.finale-h').focus({ preventScroll: true }); }, 0.3)
        .fromTo($('.finale-actions'), { autoAlpha: 0, y: R ? 0 : 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' }, R ? 0.3 : 1.6);
    };

    ctx.on($('.bcover'), 'click', e => {
      const r = box.getBoundingClientRect();
      const x = e.clientX ? e.clientX - r.left : r.width / 2, y = e.clientY ? e.clientY - r.top : r.height / 2;
      burst(x, y);
    });
    ctx.on($('.again'), 'click', () => ctx.goto('cover', { returnVisit: true }));
  },

  leave() {},
};
