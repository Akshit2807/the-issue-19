/* Scene 5 · edit — The Travel & Taste Edit. Feeling: WANDERLUST & APPETITE, restless joy. */
import { ringPath } from './press.js';
const gsap = window.gsap;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Six passport stamp shapes; text from config. */
function passportStamp(i, text) {
  const t = esc(text), id = `ps-${i}`;
  const ring = (r, sw) => `<path d="${ringPath(50, 50, r, 0.7, 31 + i * 7, 18)}" stroke-width="${sw}"/>`;
  const shapes = [
    `${ring(44, 2.6)}${ring(33, 1.1)}<path id="${id}" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" fill="none" stroke="none"/><text font-size="8.5"><textPath href="#${id}" startOffset="2%" textLength="225" lengthAdjust="spacingAndGlyphs">${t} · ${t} ·</textPath></text><text x="50" y="55" text-anchor="middle" font-size="13" stroke="none">Nº ${i + 1}</text>`,
    `<rect x="5" y="22" width="90" height="56" rx="2" stroke-width="2.6"/><rect x="10" y="27" width="80" height="46" stroke-width="1"/><text x="50" y="47" text-anchor="middle" font-size="${t.length > 12 ? 7.5 : 10}">${t}</text><text x="50" y="62" text-anchor="middle" font-size="7">ENTRY · ADMITTED</text>`,
    `<ellipse cx="50" cy="50" rx="46" ry="32" stroke-width="2.4"/><ellipse cx="50" cy="50" rx="39" ry="25" stroke-width="1"/><text x="50" y="48" text-anchor="middle" font-size="${t.length > 12 ? 7 : 9.5}">${t}</text><text x="50" y="61" text-anchor="middle" font-size="7">✕ NO REGRETS ✕</text>`,
    `<path d="M30 8 H70 L92 30 V70 L70 92 H30 L8 70 V30 Z" stroke-width="2.4"/><path d="M33 15 H67 L85 33 V67 L67 85 H33 L15 67 V33 Z" stroke-width="1"/><text x="50" y="47" text-anchor="middle" font-size="${t.length > 12 ? 7 : 9.5}">${t}</text><text x="50" y="61" text-anchor="middle" font-size="7">DEPARTED</text>`,
    `${ring(44, 1.4)}${ring(40, 2.6)}<text x="50" y="44" text-anchor="middle" font-size="7">ARRIVED</text><text x="50" y="57" text-anchor="middle" font-size="${t.length > 12 ? 7 : 9.5}">${t}</text><path d="M24 64 H76" stroke-width="1"/>`,
    `<path d="M12 18 H88 L94 24 V76 L88 82 H12 L6 76 V24 Z" stroke-width="2.6"/><text x="50" y="44" text-anchor="middle" font-size="7">VISA · ONE FRIEND</text><text x="50" y="58" text-anchor="middle" font-size="${t.length > 12 ? 7 : 9.5}">${t}</text><path d="M18 66 H82" stroke-width="1" stroke-dasharray="3 3"/>`,
  ];
  return `<svg class="stamp-svg pstamp" viewBox="0 0 100 100" aria-hidden="true"><g filter="url(#ink)" fill="none" stroke="currentColor">${shapes[i % 6]}</g></svg>`;
}

/* faint printed pictograms on the empty visa slots (order follows config.memories) */
const PICTO = [
  'M3 11 21 4 14 21 11 13Z M11 13 21 4',                                                     // plane
  'M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z M16 11h2a2 2 0 0 1 0 4h-2 M8 3v3 M11 3v3',          // cup
  'M8 3v7a2 2 0 0 0 4 0V3 M10 3v18 M16 3c-2 2-2 7 0 8v10',                                    // fork
  'M6 4h12v11H6z M6 11h12 M8 18l-2 3 M16 18l2 3',                                           // train
  'M12 10v11 M9 21h6 M12 3c-2 2-2 4 0 5 2-1 2-3 0-5z M10 10h4',                              // candle
  'M4 4h16v16H4z M7 7h10v10H7z',                                                            // frame
];
const picto = i => `<svg class="pslot-picto" viewBox="0 0 24 24" aria-hidden="true"><path d="${PICTO[i % PICTO.length]}"/></svg>`;

const accepted = `<svg class="stamp-svg" viewBox="0 0 180 70" aria-hidden="true"><g filter="url(#ink)" fill="none" stroke="currentColor"><rect x="3" y="3" width="174" height="64" rx="4" stroke-width="3.2"/><text x="90" y="46" text-anchor="middle" font-size="30" stroke="none" style="letter-spacing:.12em">ACCEPTED</text></g></svg>`;

export default {
  id: 'edit',
  title: 'Trips We’ll Take',
  feeling: 'Wanderlust',
  tone: 'paper',
  transition: 'turn',
  nextLabel: 'Turn the page →',
  assets: ctx => ['assets/art/chart-goa.webp', 'assets/art/map.webp'],
  glyph: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="10.5"/></svg>`,

  verso(ctx) {
    return `<div class="plate">
      <p class="mono plate-folio"><span>P. 05</span><span>TRAVEL &amp; TASTE</span></p>
      <h2 class="h2 plate-title">Trips We’ll Take</h2>
      <p class="mono plate-feeling">FEELING — WANDERLUST &amp; APPETITE</p>
      <p class="deck plate-deck">${ctx.fmt(ctx.get('copy.edit.deck'))}</p>
    </div>`;
  },

  mount(el, ctx) {
    const mem = ctx.config.memories.slice(0, 6);
    const rows = (ctx.get('copy.edit.receipt') || []).map(([a, b]) => `<li><span>${esc(ctx.fmt(a))}</span><i></i><span>${esc(ctx.fmt(b))}</span></li>`).join('');
    const tot = (ctx.get('copy.edit.receiptTotal') || []).map(([a, b]) => `<li><span>${esc(ctx.fmt(a))}</span><i></i><span>${esc(ctx.fmt(b))}</span></li>`).join('');
    el.innerHTML = `
      <div class="edit">
        <div class="stock stock--newsprint"></div>
        <div class="collage" aria-hidden="true">
          <img class="chart" src="assets/art/chart-goa.webp" alt="" width="740" height="960">
          <img class="map" src="assets/art/map.webp" alt="" width="1000" height="667">
          <svg class="coffee c1" viewBox="0 0 120 120"><g filter="url(#stain)"><path d="${ringPath(60, 60, 48, 1.4, 5)}"/><path d="${ringPath(63, 57, 44, 1.6, 9)}" class="echo"/></g></svg>
          <svg class="coffee c2" viewBox="0 0 120 120"><g filter="url(#stain)"><path d="${ringPath(60, 60, 48, 1.4, 13)}"/></g></svg>
        </div>
        <header class="edit-head">
          <h2 class="h2 edit-title" tabindex="-1"><span class="ml"><span>Trips</span></span><span class="ml"><span>We’ll Take</span></span></h2>
          <p class="deck edit-deck">${ctx.fmt(ctx.get('copy.edit.deck'))}</p>
        </header>
        <div data-arrive class="passport" role="group" aria-label="Passport: tap each page to stamp it">
          <p class="mono pp-head" aria-hidden="true"><span>VISAS / VISAS</span><span>${esc(ctx.fmt('PAGE {{age}}'))}</span></p>
          <div class="pp-grid">
          ${mem.map((m, i) => `<button class="slot-btn" type="button" data-i="${i}" aria-label="Stamp: ${esc(ctx.fmt(m.label))}">
              ${picto(i)}
              <span class="pslot-stamp">${passportStamp(i, ctx.fmt(m.stampText || m.label))}</span>
              <span class="mono pslot-label">${esc(ctx.fmt(m.label))}</span>
            </button>`).join('')}
          </div>
          <p class="pp-mrz" aria-hidden="true">${esc(`P<${ctx.fmt('{{NAME}}').replace(/[^A-Z]/g, '<')}<<BEST<FRIEND`.padEnd(44, '<'))}</p>
        </div>
        <div data-arrive class="memo-area" aria-live="polite"><p class="caption memo-empty">${ctx.fmt(ctx.get('copy.edit.empty'))}</p></div>
        <div class="printer" aria-hidden="true"><i class="slot-line"></i></div>
        <div class="receipt-clip">
          <div class="receipt" role="region" aria-label="Receipt">
            <p class="r-head">THE USUAL — ORDER Nº ${ctx.fmt('{{age}}')}</p>
            <p class="r-sub">${ctx.fmt('{{date}}')} · TABLE FOR TWO</p>
            <ol class="r-rows">${rows}</ol>
            <p class="r-rule">----------------------------------------</p>
            <ol class="r-rows r-total">${tot}</ol>
            <button class="accept" type="button"><span class="mono">STAMP TO ACCEPT</span><span class="accepted">${accepted}</span></button>
            <p class="redpen r-note" aria-live="polite"></p>
            <p class="r-thanks">thank you. come again (you will).</p>
          </div>
        </div>
      </div>`;
    this.el = el;
  },

  enter(ctx) {
    const el = this.el, R = ctx.reduced, $ = s => el.querySelector(s), m = ctx.motion;
    const mem = ctx.config.memories.slice(0, 6);
    const slots = [...el.querySelectorAll('.slot-btn')];
    const stamped = new Set();
    let printed = false, done = false;

    // reset
    slots.forEach(s => { s.classList.remove('is-stamped'); s.setAttribute('aria-pressed', 'false'); });
    gsap.set(el.querySelectorAll('.pslot-stamp'), { opacity: 0, scale: 1 });
    gsap.set(el.querySelectorAll('.pslot-picto'), { opacity: 1 });
    gsap.set($('.passport'), { scale: 1, y: 0, opacity: 1 });
    $('.memo-area').innerHTML = `<p class="caption memo-empty">${ctx.fmt(ctx.get('copy.edit.empty'))}</p>`;
    gsap.set([$('.receipt-clip'), $('.printer')], { autoAlpha: 0 });
    gsap.set($('.receipt'), { yPercent: -100 });
    gsap.set($('.accepted'), { opacity: 0 });
    $('.accept').disabled = false;
    $('.r-note').innerHTML = '';

    if (R) gsap.fromTo([$('.passport'), $('.memo-area')], { opacity: 0 }, { opacity: 1, duration: 0.2 });
    else gsap.timeline()
      .fromTo(slots, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.04 }, 0.3)
      .fromTo($('.memo-area'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.6);

    const showMemo = i => {
      const area = $('.memo-area'), memo = mem[i];
      const card = document.createElement('figure');
      card.className = 'memo';
      card.innerHTML = `<figcaption><span class="mono memo-label">${esc(ctx.fmt(memo.label))}</span><span class="redpen memo-line"></span></figcaption>`;
      // every card already there leaves (fast taps used to orphan the middle ones on top of each other)
      [...area.children].forEach(old => gsap.to(old, { y: R ? 0 : -10, opacity: 0, duration: 0.2, ease: 'power2.in', overwrite: true, onComplete: () => old.remove() }));
      area.append(card);
      gsap.fromTo(card, { y: R ? 0 : 30, opacity: 0 }, { y: 0, opacity: 1, duration: R ? 0.2 : 0.5, ease: 'expo.out', delay: 0.08 });
      m.redpen(card.querySelector('.memo-line'), ctx.fmt(memo.line), { delay: R ? 0 : 0.35, duration: 0.8 });
    };

    ctx.on($('.passport'), 'click', e => {
      const b = e.target.closest('.slot-btn'); if (!b || printed) return;
      const i = +b.dataset.i;
      if (!stamped.has(i)) {
        stamped.add(i);
        b.classList.add('is-stamped'); b.setAttribute('aria-pressed', 'true');
        const st = b.querySelector('.pslot-stamp');
        gsap.set(st, { rotation: gsap.utils.random(-12, 12) });
        gsap.fromTo(st, { opacity: 0 }, { opacity: 0.92, duration: 0.05 });
        gsap.fromTo(st, { scale: R ? 1 : 1.35 }, { scale: 1, ...m.sp('stamp') });
        gsap.to(b.querySelector('.pslot-picto'), { opacity: 0, duration: 0.15 });
        if (!R) m.shake($('.passport'), 1.5);
        ctx.sound.play('stamp'); ctx.sound.haptic();
        ctx.remember('stamps', ctx.fmt(mem[i].stampText || mem[i].label));
      }
      showMemo(i);
      if (stamped.size === mem.length && !printed) { printed = true; ctx.after(R ? 300 : 1100, printReceipt); }
    });

    const printReceipt = () => {
      el.querySelector('.edit')?.scrollTo?.({ top: 0, behavior: R ? 'auto' : 'smooth' });   // the receipt prints at the top
      ctx.quiet();   // the receipt is the call to action now: no skip chip over it
      const tl = gsap.timeline();
      tl.to($('.passport'), { scale: R ? 1 : 0.86, y: R ? 0 : -40, opacity: 0.35, duration: 0.6, ease: 'power2.inOut' }, 0)
        .to($('.memo-area'), { opacity: 0, duration: 0.3 }, 0)
        .set([$('.receipt-clip'), $('.printer')], { autoAlpha: 1 }, 0.3)
        .fromTo($('.printer'), { scaleX: 0.6 }, { scaleX: 1, duration: 0.4, ease: 'expo.out' }, 0.3)
        .to($('.receipt'), { yPercent: 0, duration: R ? 0.2 : 1.6, ease: R ? 'none' : 'steps(6)', onUpdate() { if (!R && this.progress() > 0) { const s = Math.floor(this.progress() * 6); if (s !== this._s) { this._s = s; ctx.sound.play('paper'); } } } }, 0.6)
        .add(() => $('.accept').focus({ preventScroll: true }));
    };

    ctx.on($('.accept'), 'click', () => {
      if (done) return; done = true;
      $('.accept').disabled = true;
      ctx.remember('accepted', true);
      const st = $('.accepted');
      gsap.set(st, { rotation: gsap.utils.random(-9, -4) });
      gsap.fromTo(st, { opacity: 0 }, { opacity: 1, duration: 0.05 });
      gsap.fromTo(st, { scale: R ? 1 : 1.5 }, { scale: 1, ...m.sp('stamp') });
      ctx.sound.play('stamp'); ctx.sound.haptic();
      m.shake($('.receipt-clip'), 2);
      m.redpen($('.r-note'), ctx.fmt(ctx.get('copy.edit.after')), { delay: 0.3 });
      $('.receipt').scrollTo?.({ top: 9999, behavior: R ? 'auto' : 'smooth' });
      ctx.after(R ? 300 : 900, () => ctx.complete());
    });
  },

  leave() {},
};
