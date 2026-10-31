/* Scene 3 · release — The Release Form. Feeling: MISCHIEF, then the warm shock of being seen through. */
const gsap = window.gsap;
const SUP = ['¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
const SIZES = [15, 13, 12, 11, 10, 9, 8, 7, 6];

export const approvedStamp = (w = 220, h = 90) => `
  <svg class="stamp-svg" viewBox="0 0 220 90" width="${w}" height="${h}" aria-hidden="true">
    <g filter="url(#ink)" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="214" height="84" rx="3" stroke-width="3"/>
      <rect x="9" y="9" width="202" height="72" rx="1.5" stroke-width="1.2"/>
      <text x="110" y="49" text-anchor="middle" font-size="31" stroke="none" style="letter-spacing:.14em;font-weight:500">APPROVED</text>
      <path d="M26 58 H194" stroke-width="1.2"/>
      <text x="110" y="73" text-anchor="middle" font-size="11" stroke="none">BY THE EDITOR</text>
    </g>
  </svg>`;

export default {
  id: 'release',
  title: 'The Release Form',
  feeling: 'Mischief',
  tone: 'paper',
  transition: 'turn',
  nextLabel: 'Turn the page →',
  noSkip: true,   // SIGN is the skip button
  assets: () => ['assets/textures/newsprint.webp'],
  glyph: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="7" y="15" width="34" height="18" rx="1"/><path d="M13 24h22"/></svg>`,

  verso(ctx) {
    return `<div class="plate">
      <p class="mono plate-folio"><span>P. 03</span><span>THE RELEASE FORM</span></p>
      <h2 class="h2 plate-title">The Release Form</h2>
      <p class="mono plate-feeling">FEELING — MISCHIEF</p>
      <p class="deck plate-deck">${ctx.fmt(ctx.get('copy.release.deck'))}</p>
    </div>`;
  },

  mount(el, ctx) {
    el.innerHTML = `
      <div class="release">
        <div class="stock stock--newsprint"></div>
        <article class="form" data-arrive>
          <header class="form-head mono"><span>MODEL RELEASE</span><span>FORM 12-AM</span></header>
          <h2 class="sr-only" tabindex="-1" data-focus>The Release Form</h2>
          <p class="form-body">${ctx.fmt(ctx.get('copy.release.body'))}</p>
          <div class="sig">
            <div class="sig-line"><span class="sig-name"></span></div>
            <div class="sig-labels mono"><span>SIGNATURE</span><span>${ctx.fmt('DATE: {{date}}')}</span></div>
          </div>
          <ol class="fine mono">${(ctx.get('copy.release.fine') || []).map(f => `<li>${ctx.fmt(f)}</li>`).join('')}</ol>
          <div class="approved">${approvedStamp()}</div>
          <p class="redpen form-note" aria-live="polite"></p>
          <div class="fn-area"><hr class="fn-rule"><ol class="footnotes" aria-live="polite"></ol></div>
        </article>
        <div class="form-actions" data-arrive>
          <button class="btn btn--primary sign" type="button"><span class="sign-bg" aria-hidden="true"></span><span class="sign-lbl">[ SIGN ]</span></button>
          <button class="btn think" type="button"></button>
        </div>
        <div class="loupe" role="dialog" aria-label="Footnote 9, magnified" tabindex="-1" hidden><p><sup>⁹</sup> see: SIGN.</p></div>
      </div>`;
    this.el = el;
  },

  enter(ctx) {
    const el = this.el, R = ctx.reduced, $ = s => el.querySelector(s), m = ctx.motion;
    const notes = ctx.get('copy.release.footnotes'), labels = ctx.get('copy.release.thinkLabels');
    const sign = $('.sign'), think = $('.think'), list = $('.footnotes'), loupe = $('.loupe');
    let n = 0, signed = false;

    // reset
    list.innerHTML = '';
    el.querySelectorAll('.form-body .fn-mark').forEach(x => x.remove());
    think.textContent = labels[0]; think.disabled = false;
    $('.form-note').innerHTML = '';
    loupe.hidden = true;
    gsap.set([$('.sign-bg'), $('.sign-lbl'), think], { scale: 1, scaleX: 1, scaleY: 1, y: 0 });
    gsap.set($('.form-actions'), { y: 0, opacity: 1 });
    $('.sig-name').innerHTML = '';
    gsap.set($('.approved'), { opacity: 0 });
    $('.form-actions').inert = false;

    /* entrance: the page lands, then the form settles */
    if (R) gsap.fromTo([$('.form'), $('.form-actions')], { opacity: 0 }, { opacity: 1, duration: 0.2 });
    else gsap.timeline()
      .fromTo($('.form'), { y: 24, opacity: 0, rotation: -0.6 }, { y: 0, opacity: 1, rotation: 0, duration: 0.9, ease: 'expo.out' })
      .fromTo([...$('.form').children].filter(c => !c.matches('.approved')), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.06 }, 0.1)
      .fromTo($('.form-actions').children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.06 }, 0.35);

    const marker = (host, i) => {
      const s = document.createElement('sup'); s.className = 'fn-mark'; s.textContent = SUP[i];
      host.append(s);
      gsap.fromTo(s, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.3 });
    };

    ctx.on(think, 'click', () => {
      if (n >= notes.length || signed) return;
      const i = n++;
      marker(i === 0 ? $('.form-body') : list.lastElementChild.querySelector('.fn-t'), i);
      const li = document.createElement('li');
      li.style.fontSize = `${SIZES[i]}px`;
      const text = ctx.fmt(notes[i]);
      if (i === notes.length - 1) li.innerHTML = `<button class="fn-loupe" type="button" aria-label="Footnote 9 is tiny. Magnify it."><span class="fn-t"><sup>${SUP[i]}</sup> ${text}</span></button>`;
      else li.innerHTML = `<span class="fn-t"><sup>${SUP[i]}</sup> ${text}</span>`;
      list.append(li);
      gsap.fromTo(li, { y: R ? 0 : 12, opacity: 0 }, { y: 0, opacity: 1, duration: R ? 0.2 : 0.5, ease: 'expo.out' });
      if (i === 2) gsap.fromTo(li.querySelector('.fn-fig'), { x: R ? 0 : 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'expo.out', delay: 0.1 });

      // the SIGN button gets more persuasive: the slab grows taller, the word grows bigger, the width stays inside the page
      const g = Math.min(1, n / notes.length);
      gsap.to($('.sign-bg'), { scaleY: 1 + 0.4 * g, ...m.sp('wobble') }   /* no scaleX: the wobble overshoot pushed a full-width slab past the gutters */);
      gsap.to($('.sign-lbl'), { scale: 1 + 0.7 * g, ...m.sp('wobble') });
      gsap.to(think, { y: 0.2 * g * 56, ...m.sp('settle') });   // make room below the taller slab
      ctx.sound.play('tick');
      if (n >= notes.length) { think.textContent = 'fine.'; think.disabled = true; }
      else think.textContent = labels[Math.min(n, labels.length - 1)];
    });

    /* the loupe for footnote 9 */
    ctx.on(list, 'click', e => {
      const b = e.target.closest('.fn-loupe'); if (!b) return;
      const r = b.getBoundingClientRect(), host = el.getBoundingClientRect();
      loupe.hidden = false;
      gsap.set(loupe, { x: Math.min(host.width - 176, Math.max(16, r.left - host.left + r.width / 2 - 80)), y: r.top - host.top - 150 });
      gsap.fromTo(loupe, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, ...m.sp('lift') });
      loupe.focus({ preventScroll: true });
    });
    ctx.on(el, 'pointerdown', e => {
      if (loupe.hidden || e.target.closest('.fn-loupe')) return;
      gsap.to(loupe, { scale: 0.6, opacity: 0, duration: 0.2, ease: 'power2.in', overwrite: 'auto', onComplete: () => { loupe.hidden = true; } });
      list.querySelector('.fn-loupe')?.focus({ preventScroll: true });
    });

    /* SIGN */
    ctx.on(sign, 'click', () => {
      if (signed) return; signed = true;
      ctx.remember('approved', true);
      $('.form-actions').inert = true;
      gsap.to($('.form-actions'), { y: R ? 0 : 60, opacity: 0, duration: 0.36, ease: 'power2.in', overwrite: 'auto' });
      gsap.to(loupe, { opacity: 0, duration: 0.2, onComplete: () => { loupe.hidden = true; } });
      const tl = gsap.timeline({ delay: 0.15 });
      tl.add(m.redpen($('.sig-name'), ctx.fmt('{{name}}'), { duration: 0.9 }), 0)
        .add(() => {
          const st = $('.approved');
          gsap.set(st, { rotation: -6 - Math.random() * 4 });
          gsap.fromTo(st, { opacity: 0 }, { opacity: 1, duration: R ? 0.15 : 0.06, ease: 'none' });
          gsap.fromTo(st, { scale: R ? 1 : 1.6 }, { scale: 1, ...m.sp('stamp') });
          ctx.sound.play('stamp'); ctx.sound.haptic();
          ctx.after(R ? 0 : 90, () => m.shake($('.form'), 2));
        }, 0.2)
        .add(() => {
          m.redpen($('.form-note'), ctx.fmt(ctx.get(n === 0 ? 'copy.release.firstTake' : 'copy.release.after')));
          ctx.complete();
        }, R ? 0.4 : 1.0);
    });
  },

  leave() {},
};
