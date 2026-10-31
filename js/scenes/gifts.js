/* Scene 6 · gifts — The Gift Edit, guest-edited by Espresso. Feeling: CHAOTIC DELIGHT. */
const gsap = window.gsap;

/* Espresso (she/her). One SVG, groups: body, head, pupils, lids, paw, tail. Poses are transforms only. */
export function espresso(k, { paw = true } = {}) {
  const eye = (cx, rot, side) => `
    <g transform="rotate(${rot} ${cx} 44.5)">
      <path class="eye-white" d="M${cx - 7} 44.5 C${cx - 5} 40 ${cx + 5} 40 ${cx + 7} 44.5 C${cx + 5} 48.6 ${cx - 5} 48.6 ${cx - 7} 44.5Z"/>
      <g clip-path="url(#eye-${side}-${k})"><ellipse class="pupil" cx="${cx}" cy="44.6" rx="1.8" ry="3.9"/></g>
      <path class="lid lid-${side}" d="M${cx - 7.6} 44.5 C${cx - 5} 39.4 ${cx + 5} 39.4 ${cx + 7.6} 44.5 C${cx + 5} 49.2 ${cx - 5} 49.2 ${cx - 7.6} 44.5Z"/>
    </g>`;
  return `
  <svg class="cat-svg" viewBox="0 0 120 140" aria-hidden="true" overflow="visible">
    <defs>
      <clipPath id="eye-l-${k}"><path d="M43 44.5 C45 40 55 40 57 44.5 C55 48.6 45 48.6 43 44.5Z" transform="rotate(8 50 44.5)"/></clipPath>
      <clipPath id="eye-r-${k}"><path d="M63 44.5 C65 40 75 40 77 44.5 C75 48.6 65 48.6 63 44.5Z" transform="rotate(-8 70 44.5)"/></clipPath>
    </defs>
    <g class="tail"><path d="M86 130 C104 132 115 121 112 106 C110 96 103 92 105.5 84 C107 78.5 112.5 77.5 114.5 81.5" fill="none" stroke="var(--ink)" stroke-width="8.5" stroke-linecap="round"/></g>
    ${paw ? `<g class="paw">
      <!-- a short tapered foreleg, drawn pointing left from the shoulder; it hangs down along her body at rest -->
      <path d="M50 92 C38 92 22 95 6 100 C2 101.5 2 108 6 109 C22 108 38 104 50 104 Z" fill="var(--ink)"/>
      <ellipse cx="2" cy="104.5" rx="8.5" ry="7.5" fill="var(--ink)"/>
      <ellipse cx="-5" cy="99.5" rx="3" ry="2.6" fill="var(--ink)"/><ellipse cx="-7" cy="105" rx="3" ry="2.6" fill="var(--ink)"/><ellipse cx="-4.5" cy="110" rx="2.8" ry="2.4" fill="var(--ink)"/>
      <ellipse cx="3" cy="106" rx="3.2" ry="2.6" fill="var(--petal)" opacity=".9"/>
    </g>` : ''}
    <g class="body">
      <path d="M44 60 C36 70 30 86 29 104 C28 120 33 133 44 136 L76 136 C88 133 93 120 92 104 C91 86 84 70 76 60 Z" fill="var(--ink)"/>
      <ellipse cx="49" cy="136" rx="8.5" ry="4" fill="var(--ink)"/><ellipse cx="71" cy="136" rx="8.5" ry="4" fill="var(--ink)"/>
      <path d="M52.5 106 C52.5 119 51.5 128 50.5 134.5 M67.5 106 C67.5 119 68.5 128 69.5 134.5" fill="none" stroke="var(--paper-dim)" stroke-width=".9" stroke-linecap="round" opacity=".35"/>
    </g>
    <g class="head">
      <path d="M36 44 C35 36 37 30 39 26 L40.5 10.5 C41 9 42 9 43 10 L54 22.5 C57.5 21.5 62.5 21.5 66 22.5 L77.5 10 C78.5 9 79.5 9.2 80 10.5 L81.5 26 C84 30 85.5 36 85 44 C84.5 58 74 67 60 67 C46 67 36.5 58 36 44 Z" fill="var(--ink)"/>
      ${eye(50, 8, 'l')}${eye(70, -8, 'r')}
      <path d="M58.2 52.2 L61.8 52.2 L60 54.4 Z" fill="var(--paper-dim)" opacity=".55"/>
      <path d="M56 56 C57.6 57.8 59.4 57.6 60 55.4 C60.6 57.6 62.4 57.8 64 56" fill="none" stroke="var(--paper-dim)" stroke-width=".9" stroke-linecap="round" opacity=".5"/>
      <path d="M45 53 L24 50.5 M45 55.5 L23.5 57 M46 58 L26 63.5 M75 53 L96 50.5 M75 55.5 L96.5 57 M74 58 L94 63.5" stroke="var(--paper-dim)" stroke-width=".7" stroke-linecap="round" opacity=".4"/>
      <path class="collar" d="M42.5 63.5 C50 69.5 70 69.5 77.5 63.5" fill="none" stroke="var(--red)" stroke-width="2.6" stroke-linecap="round"/>
    </g>
  </svg>`;
}

const GIFTS = [
  { key: 'envelope', label: 'Choose the envelope', cap: ['THE ENVELOPE', 'sealed with sprinkles'], tag: 'ENVELOPE → P. 08', svg: `
    <svg viewBox="0 0 100 100" aria-hidden="true"><defs><pattern id="dots-g" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="var(--cobalt)"/><circle cx="3" cy="3" r="1.15" fill="var(--paper)"/></pattern></defs>
      <g transform="rotate(-6 50 70)">
        <path d="M14 40 L86 38 L87 92 L13 93 Z" class="g-fill"/>
        <path d="M14 40 L50 22 L86 38 Z" fill="url(#dots-g)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M14 40 L50 64 L86 38" class="g-fill"/>
        <path d="M13 93 L44 66 M87 92 L57 66" class="g-line"/>
        <path d="M46 63 C44 59 47 55 51 56 C55 55 58 59 55 63 C54 67 48 68 46 63Z" fill="var(--red)"/>
      </g></svg>` },
  { key: 'bouquet', label: 'Choose the bouquet', cap: ['THE BOUQUET', 'fresh, just for you'], tag: 'BOUQUET → P. 07', svg: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 64 C46 46 38 34 30 24 M50 64 C50 44 51 30 52 14 M50 64 C55 48 62 36 72 26 M50 64 C44 52 26 46 18 42 M50 64 C58 54 74 50 84 46" class="g-line"/>
      <path d="M36 40 C30 36 26 37 24 40 C28 42 32 42 36 40Z M64 38 C70 33 75 34 77 37 C73 40 68 40 64 38Z M51 34 C46 30 45 26 47 23 C51 26 52 30 51 34Z" class="g-fill"/>
      ${[[30, 22, 7], [72, 24, 6], [18, 41, 5]].map(([x, y, r]) => `<g>${Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<ellipse cx="${(x + Math.cos(a) * r * 0.75).toFixed(1)}" cy="${(y + Math.sin(a) * r * 0.75).toFixed(1)}" rx="${(r * 0.42).toFixed(1)}" ry="${(r * 0.22).toFixed(1)}" transform="rotate(${(a * 180) / Math.PI} ${(x + Math.cos(a) * r * 0.75).toFixed(1)} ${(y + Math.sin(a) * r * 0.75).toFixed(1)})" class="g-fill"/>`; }).join('')}<circle cx="${x}" cy="${y}" r="${(r * 0.32).toFixed(1)}" fill="var(--ink)"/></g>`).join('')}
      <path d="M44 14 C44 6 52 3 56 7 C60 3 66 9 61 14 C64 19 58 23 52 21 C46 23 41 19 44 14Z" fill="var(--red)" stroke="var(--ink)" stroke-width="1.5"/>
      <circle cx="52.5" cy="13.5" r="2.2" fill="var(--ink)"/>
      <path d="M84 46 C86 41 90 41 90 45 C92 47 88 51 84 46Z" class="g-fill"/>
      <path d="M30 56 L70 56 L56 97 L45 97 Z" class="g-fill"/>
      <path d="M30 56 L48 72 L70 56" class="g-line"/>
      <path d="M38 63 L47 63 M40 67 L49 67 M54 64 L62 62 M52 70 L60 68 M47 80 L54 80 M48 85 L53 85" stroke="var(--ink)" stroke-width=".8" opacity=".45" stroke-linecap="round"/>
    </svg>` },
  { key: 'box', label: 'Choose the box', cap: ['THE BOX', 'small, full of surprises'], tag: 'BOX → P. 09', svg: `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M26 58 L70 58 L70 95 L26 95 Z" class="g-fill"/>
      <path d="M26 58 L38 48 L82 48 L70 58 Z M70 58 L82 48 L82 85 L70 95 Z" class="g-fill"/>
      <path d="M46 58 L46 95 M46 58 L58 48" stroke="var(--red)" stroke-width="4" stroke-linecap="square"/>
      <path d="M76 53 L76 90" stroke="var(--red)" stroke-width="3.2"/>
      <path d="M52 52 C42 40 36 44 40 49 C43 53 50 53 52 52 C54 53 61 54 64 49 C67 44 61 40 52 52Z" fill="var(--red)" stroke="var(--ink)" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M52 52 C50 58 47 62 44 64 M52 52 C55 58 58 61 61 62" fill="none" stroke="var(--red)" stroke-width="2.4" stroke-linecap="round"/>
      <text x="48" y="80" text-anchor="middle" font-size="9" font-family="var(--f-mono)" fill="var(--ink)" opacity=".55">?</text>
    </svg>` },
];

const SHIP = `
  <svg class="sbox-svg" viewBox="0 0 120 80" preserveAspectRatio="none" aria-hidden="true">
    <path d="M3 4 L117 4 L116 79 L4 79 Z" fill="var(--newsprint)" stroke="var(--ink)" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
    <path d="M3 4 L117 4 L116 14 L4 14 Z" fill="#D8CCB8" stroke="var(--ink)" stroke-width="1.5" vector-effect="non-scaling-stroke"/>
    <path d="M52 4 L68 4 L68 40 L52 40 Z" fill="var(--paper)" opacity=".75"/>
    <path d="M14 60 L40 60 M14 66 L34 66" stroke="var(--ink)" stroke-width="1" vector-effect="non-scaling-stroke" opacity=".5"/>
    <path d="M92 58 L104 58 L98 50 Z M98 58 L98 70" fill="none" stroke="var(--ink)" stroke-width="1.2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
  </svg>`;

export default {
  id: 'gifts',
  title: 'The Gift Edit',
  feeling: 'Chaotic delight',
  tone: 'paper',
  transition: 'paw',
  nextLabel: 'Open the bouquet →',
  assets: () => ['assets/textures/marble.webp'],
  glyph: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 38c0-10 3-17 7-20l1-8 5 6h0l5-6 1 8c4 3 7 10 7 20z"/></svg>`,

  verso(ctx) {
    return `<div class="plate">
      <p class="mono plate-folio"><span>P. 06</span><span>THE GIFT EDIT</span></p>
      <h2 class="h2 plate-title">The Gift Edit</h2>
      <p class="mono plate-feeling">FEELING — CHAOTIC DELIGHT</p>
      <div class="byline-card"><p class="mono">THIS ISSUE’S MASTHEAD</p><p class="deck">${ctx.fmt(ctx.get('copy.gifts.byline'))}</p></div>
      <div class="verso-cat">${espresso('v', { paw: false })}</div>
    </div>`;
  },

  mount(el, ctx) {
    el.innerHTML = `
      <div class="gifts">
        <div class="stock stock--paper"></div>
        <header class="gifts-head">
          <h2 class="h2 gifts-title" tabindex="-1"><span class="ml"><span class="t">${ctx.fmt(ctx.get('copy.gifts.title'))}</span></span></h2>
          <p class="deck gifts-deck"><span class="ml"><span class="t">${ctx.fmt(ctx.get('copy.gifts.deck'))}</span></span></p>
        </header>
        <div class="gift-card" aria-live="polite" hidden>
          <p class="mono gc-no"></p>
          <p class="gc-emoji" aria-hidden="true"></p>
          <h3 class="gc-title"></h3>
          <p class="gc-line"></p>
          <p class="mono gc-foot"></p>
        </div>
        <p class="redpen note blink-note" aria-live="polite"></p>
        <div class="plinth"><img src="assets/textures/marble.webp" alt="" width="1200" height="600"></div>
        <div data-arrive class="stage-row">
          ${GIFTS.map((g, i) => `<button class="gift gift-${g.key}" type="button" data-i="${i}" aria-label="Open gift ${i + 1}">${g.svg}<span class="gift-tap" aria-hidden="true">tap me</span></button>`).join('')}
          <button class="cat" type="button" aria-label="Espresso the cat. Pet her.">${espresso('m')}<span class="heart" aria-hidden="true">♥</span></button>
        </div>
        <div data-arrive class="plinth-face">
          ${GIFTS.map((g, i) => `<div class="cap" data-i="${i}"><p class="cap-t"><span class="mono">GIFT ${i + 1}</span><i class="cap-state">tap to open</i></p></div>`).join('')}
          <p class="mono cat-byline">ESPRESSO<br>(gift wrapper)</p>
          <p class="mono gifts-count"></p>
        </div>
      </div>`;
    this.el = el;
  },

  enter(ctx) {
    const el = this.el, R = ctx.reduced, $ = s => el.querySelector(s), m = ctx.motion;
    const gifts = [...el.querySelectorAll('.gift')], items = ctx.get('copy.gifts.items');
    const cat = $('.cat'), lids = [...el.querySelectorAll('.cat .lid')], heart = $('.cat .heart');
    const card = $('.gift-card'), opened = new Set();
    let done = false;

    gsap.set(gifts, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 });
    gsap.set(el.querySelector('.cat .paw'), { svgOrigin: '50 98', rotation: 95 });
    gsap.set(lids, { scaleY: 0.42, transformOrigin: '50% 0%' });
    gsap.set(heart, { opacity: 0, y: 0, scale: 0.5 });
    gifts.forEach(g => g.classList.remove('is-open'));
    el.querySelectorAll('.cap-state').forEach(c => { c.textContent = 'tap to open'; c.classList.remove('is-open'); });
    card.hidden = true;
    const ts = el.querySelectorAll('.gifts-head .t');
    ts[0].textContent = ctx.fmt(ctx.get('copy.gifts.title')); ts[1].textContent = ctx.fmt(ctx.get('copy.gifts.deck'));
    $('.blink-note').innerHTML = '';
    const count = () => { $('.gifts-count').textContent = `${opened.size} / ${gifts.length} OPENED`; };
    count();

    if (R) gsap.fromTo([$('.stage-row'), $('.plinth-face')], { opacity: 0 }, { opacity: 1, duration: 0.2 });
    else {
      gsap.timeline()
        .fromTo(gifts, { y: -40, opacity: 0, rotation: -10 }, { y: 0, opacity: 1, rotation: 0, ...m.presets.stamp, stagger: 0.1 }, 0.15)
        .fromTo(cat, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0.4)
        .fromTo(el.querySelectorAll('.plinth-face > *'), { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.05 }, 0.5);
      // unopened gifts breathe and wiggle so they beg to be tapped
      this.loops = gifts.map((g, i) => gsap.to(g, { rotation: i % 2 ? 3 : -3, y: -4, duration: 0.9 + i * 0.15, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 + i * 0.2, transformOrigin: '50% 100%' }));
    }

    /* cat: happy hop + a heart */
    const purr = () => {
      if (R) return;
      gsap.timeline()
        .to(cat, { y: -18, duration: 0.18, ease: 'power2.out' }).to(cat, { y: 0, duration: 0.3, ease: 'bounce.out' });
      gsap.fromTo(heart, { opacity: 0, y: 0, scale: 0.5 }, { keyframes: { opacity: [0, 1, 1, 0] }, y: -40, scale: 1.2, duration: 1.2, ease: 'power1.out' });
      gsap.timeline().to(lids, { scaleY: 1, duration: 0.2 }).to(lids, { scaleY: 0.42, duration: 0.3 }, '+=0.2');
    };

    /* confetti of tiny paper bits from the gift */
    const burst = g => {
      if (R) return;
      const host = $('.gifts'), hr = host.getBoundingClientRect(), r = g.getBoundingClientRect();
      const cols = ['#B02E18', '#2F4FB0', '#E8B9AE', '#E9A23B', '#B4924A'];
      for (let k = 0; k < 18; k++) {
        const d = document.createElement('i'); d.className = 'confetti';
        d.style.cssText = `left:${r.left - hr.left + r.width / 2}px;top:${r.top - hr.top + r.height * 0.3}px;background:${cols[k % cols.length]}`;
        host.appendChild(d);
        const ang = (k / 18) * Math.PI * 2, dist = 50 + (k * 23) % 70;
        gsap.fromTo(d, { x: 0, y: 0, rotation: 0, opacity: 1 }, { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist - 60, rotation: 360 + k * 40, opacity: 0, duration: 1.1, ease: 'power2.out', onComplete: () => d.remove() });
      }
    };

    const showCard = i => {
      const it = items[i];
      $('.gc-no').textContent = `GIFT ${i + 1} OF ${gifts.length}`;
      $('.gc-emoji').textContent = it.emoji;
      $('.gc-title').textContent = ctx.fmt(it.title);
      $('.gc-line').textContent = ctx.fmt(it.line);
      $('.gc-foot').textContent = ctx.fmt(it.foot || 'REDEEMABLE: ANYTIME · ISSUED BY {{SENDER}}');
      card.hidden = false;
      if (R) gsap.fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      else gsap.fromTo(card, { opacity: 0, y: 40, scale: 0.85, rotation: (i - 1) * 4 }, { opacity: 1, y: 0, scale: 1, rotation: (i - 1) * 1.5, duration: 0.7, ease: 'back.out(1.8)', overwrite: 'auto' });
    };

    const open = i => {
      const g = gifts[i];
      ctx.sound.play('paper'); ctx.sound.haptic();
      $('.blink-note').innerHTML = '';
      showCard(i);
      if (opened.has(i)) return;
      opened.add(i); count();
      g.classList.add('is-open');
      this.loops?.[i]?.kill();
      const st = el.querySelector(`.cap[data-i="${i}"] .cap-state`); st.textContent = 'opened ♥'; st.classList.add('is-open');
      if (!R) gsap.timeline()
        .to(g, { y: -30, scale: 1.18, rotation: 0, duration: 0.25, ease: 'power2.out', overwrite: 'auto' })
        .add(() => burst(g))
        .to(g, { y: 0, scale: 1, duration: 0.6, ease: 'bounce.out' });
      purr();
      if (opened.size === gifts.length && !done) {
        done = true;
        const rv = ctx.get('copy.gifts.reveal');
        ctx.after(R ? 300 : 1400, () => {
          gsap.timeline()
            .to(ts, { yPercent: R ? 0 : -105, opacity: R ? 0 : 1, duration: 0.2, ease: 'power2.in' })
            .add(() => { ts[0].textContent = ctx.fmt(rv[0]); ts[1].textContent = ctx.fmt(rv[1]); })
            .fromTo(ts, { yPercent: R ? 0 : 105, opacity: R ? 0 : 1 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.05 });
          ctx.complete();
        });
      }
    };

    ctx.on($('.stage-row'), 'click', e => {
      const g = e.target.closest('.gift');
      if (g) return open(+g.dataset.i);
      if (e.target.closest('.cat')) { card.hidden = true; purr(); m.redpen($('.blink-note'), ctx.fmt(ctx.get('copy.gifts.blink'))); }
    });
    ctx.on(card, 'click', () => {});
  },

  leave() { this.loops?.forEach(t => t.kill()); },

};
