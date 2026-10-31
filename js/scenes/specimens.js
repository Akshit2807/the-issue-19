/* Scene 7 · specimens → The Night Garden. Feeling: WONDER, then pure JOY.
   Tap anywhere: a flower shoots up from the ground and blooms, and hides a reason she's loved.
   19 flowers for 19 years; at 19 the whole garden throws a petal storm. */
const gsap = window.gsap;
const COLS = ['#FF7AA8', '#FFC23D', '#7FA6FF', '#FF5A3C', '#F5E4DC', '#C79BFF', '#7FE0B5'];
const NS = 'http://www.w3.org/2000/svg';

/* four bloom shapes, drawn around (0,0) */
function bloom(kind, c) {
  if (kind === 0) return `${[...Array(10)].map((_, i) => `<ellipse class="pt" cx="0" cy="-15" rx="5.5" ry="13" fill="${c}" transform="rotate(${i * 36})"/>`).join('')}<circle r="7" fill="#FFC23D"/><circle r="3" fill="#B4724A"/>`;
  if (kind === 1) return `${[...Array(5)].map((_, i) => `<circle class="pt" cx="0" cy="-12" r="11" fill="${c}" transform="rotate(${i * 72})"/>`).join('')}<circle r="6" fill="#141210" opacity=".75"/>`;
  if (kind === 2) return `<path class="pt" d="M-14 4 C-16 -14 -8 -26 0 -28 C8 -26 16 -14 14 4 C8 10 -8 10 -14 4Z" fill="${c}"/><path class="pt" d="M0 -28 C-4 -16 -4 -4 0 6 C4 -4 4 -16 0 -28Z" fill="#141210" opacity=".18"/>`;
  return `${[...Array(8)].map((_, i) => `<path class="pt" d="M0 0 C-6 -10 -4 -22 0 -26 C4 -22 6 -10 0 0Z" fill="${c}" transform="rotate(${i * 45})"/>`).join('')}<circle r="5" fill="#F5E4DC"/>`;
}

export default {
  id: 'specimens',
  title: 'The Night Garden',
  feeling: 'Wonder',
  tone: 'dark',
  fullBleed: true,
  transition: 'turn',
  nextLabel: 'Open the envelope →',
  assets: () => [],
  glyph: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M24 42V18M24 26c-6-1-9-5-9-10 5 0 9 4 9 10zM24 22c5-1 8-4 8-9-5 0-8 4-8 9z"/></svg>`,

  verso(ctx) {
    return `<div class="plate">
      <p class="mono plate-folio"><span>P. 07</span><span>THE NIGHT GARDEN</span></p>
      <h2 class="h2 plate-title"><i>Plant a garden.</i></h2>
      <p class="mono plate-feeling">FEELING — WONDER</p>
    </div>`;
  },

  mount(el, ctx) {
    el.innerHTML = `
      <div class="garden">
        <div class="sky" aria-hidden="true">${[...Array(40)].map((_, i) => `<i class="star" style="left:${(i * 37) % 100}%;top:${(i * 53) % 62}%;--d:${1.5 + (i % 5) * 0.6}s;--s:${1 + (i % 3)}px"></i>`).join('')}<i class="moon"></i></div>
        <header class="g-head">
          <h2 class="h2 g-title" tabindex="-1"><span class="ml"><span class="t">${ctx.fmt(ctx.get('copy.specimens.title'))}</span></span></h2>
          <p class="deck g-deck"><span class="ml"><span class="t">${ctx.fmt(ctx.get('copy.specimens.deck'))}</span></span></p>
        </header>
        <div class="g-count" aria-hidden="true"><b>0</b><span>/ 19</span></div>
        <p class="g-reason" aria-live="polite"></p>
        <svg class="bed" aria-hidden="true"></svg>
        <svg class="wrap" viewBox="0 0 220 260" aria-hidden="true">
          <g class="stems-out" stroke="#4E9C70" stroke-width="3.2" stroke-linecap="round"><path d="M104 176 L94 252"/><path d="M108 176 L104 256"/><path d="M112 176 L114 256"/><path d="M116 176 L124 250"/><path d="M110 176 L109 248"/></g>
          <path d="M2 34 C22 10 44 26 62 8 C80 24 96 4 112 18 C128 4 146 22 162 6 C180 24 200 10 218 32 L130 172 L90 172 Z" fill="#C9AE85"/>
          <path d="M6 58 C30 44 54 62 80 44 C92 70 104 120 112 174 L92 174 Z" fill="#E2CFAE"/>
          <path d="M214 56 C190 42 168 60 142 42 C130 70 118 120 110 174 L128 174 Z" fill="#D8C29C"/>
          <path d="M34 84 C64 70 96 88 112 76 C126 88 158 70 186 84 L124 174 L96 174 Z" fill="#F1E4CC"/>
          <path d="M34 84 C64 70 96 88 112 76 C126 88 158 70 186 84" fill="none" stroke="#141210" stroke-opacity=".12" stroke-width="1.5"/>
          <path d="M88 166 L132 166 L130 182 L90 182 Z" fill="#B02E18"/>
          <path d="M110 172 C92 150 68 152 70 166 C72 182 96 180 110 172 C124 164 148 158 150 172 C152 188 126 186 110 172Z" fill="#C93A22"/>
          <circle cx="110" cy="172" r="6" fill="#9E2814"/>
          <path d="M106 176 C98 198 88 212 80 224 M114 176 C122 198 134 210 142 220" stroke="#B02E18" stroke-width="5" stroke-linecap="round" fill="none"/>
          <g transform="rotate(-8 150 214)"><path d="M136 200 L176 200 L182 212 L176 224 L136 224 Z" fill="#F5E4DC" stroke="#141210" stroke-opacity=".3"/><circle cx="174" cy="212" r="2.4" fill="#141210" opacity=".4"/><text x="155" y="216" text-anchor="middle" font-family="Nanum Pen Script, cursive" font-size="13" fill="#4A2E22">billuu</text></g>
        </svg>
        <p class="g-tap" aria-hidden="true">tap anywhere ✿</p>
        <div class="petals" aria-hidden="true"></div>
        <button class="sr-only g-plant" type="button">Plant a flower</button>
      </div>`;
    this.el = el;
  },

  enter(ctx) {
    const el = this.el, R = ctx.reduced, $ = s => el.querySelector(s);
    const reasons = ctx.get('copy.specimens.reasons'), N = reasons.length;
    const bed = $('.bed'), host = $('.garden');
    let n = 0, done = false;
    bed.innerHTML = ''; $('.petals').innerHTML = ''; $('.g-reason').textContent = ''; $('.g-count b').textContent = '0';
    const ts = el.querySelectorAll('.g-head .t');
    ts[0].textContent = ctx.fmt(ctx.get('copy.specimens.title')); ts[1].textContent = ctx.fmt(ctx.get('copy.specimens.deck'));
    gsap.set($('.g-tap'), { opacity: 1 });
    this.loops = [];
    if (!R) gsap.fromTo([$('.g-head'), $('.g-count')], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12 });

    const plant = (x, y) => {
      if (n >= N) return;
      const W = host.clientWidth, H = host.clientHeight;
      bed.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const cx = W / 2, tieY = H * 0.72, sc = Math.min(W * 0.44, H * 0.3);
      const i = n++, c = COLS[i % COLS.length], kind = i % 4;
      // fan the heads into a dome: a few rings, each flower in its own slot
      const ring = i < 5 ? 0 : i < 11 ? 1 : 2, slots = [5, 6, 8][ring], k = i - [0, 5, 11][ring];
      const ang = (-62 + (124 * (k + 0.5)) / slots + (ring % 2 ? 6 : -4)) * Math.PI / 180;
      const rad = sc * [1.0, 0.78, 0.55][ring] + (i % 3) * 6;
      const hx = cx + Math.sin(ang) * rad, hy = tieY - Math.cos(ang) * rad * 1.05 - 20;
      const bx = cx + (i % 5 - 2) * 3;
      const g = document.createElementNS(NS, 'g');
      g.innerHTML = `<path class="stem" d="M${bx} ${tieY + 40} C${bx} ${tieY - 30}, ${hx} ${hy + (tieY - hy) * 0.45}, ${hx} ${hy}" pathLength="1"/>
        <path class="leaf" d="M0 0 C10 -10 24 -8 30 0 C24 8 10 10 0 0Z" transform="translate(${(bx + hx) / 2} ${(tieY + hy) / 2 + 10}) rotate(${hx > cx ? -40 : 220})"/>
        <g class="bl" transform="translate(${hx} ${hy})"><g class="bl-in">${bloom(kind, c)}</g></g>`;
      ring === 2 ? bed.appendChild(g) : bed.insertBefore(g, bed.firstChild);   // inner ring sits in front
      const stem = g.querySelector('.stem'), bl = g.querySelector('.bl-in'), leaf = g.querySelector('.leaf');
      $('.g-count b').textContent = String(n);
      if (n === 1) gsap.to($('.g-tap'), { opacity: 0, duration: 0.4 });
      ctx.sound.play('tick');
      if (R) gsap.set(stem, { strokeDasharray: 1, strokeDashoffset: 0 });
      else {
        // the flower is born under her finger and flies into the bouquet
        gsap.timeline()
          .fromTo(bl, { x: x - hx, y: y - hy, scale: 0.2, rotation: -200 }, { x: 0, y: 0, scale: 1.1 + (i % 3) * 0.15, rotation: 0, duration: 0.75, ease: 'back.out(1.6)' })
          .fromTo(bl.querySelectorAll('.pt'), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.02 }, 0)
          .fromTo(stem, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, 0.35)
          .fromTo(leaf, { scale: 0, transformOrigin: '0% 50%' }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, 0.6)
          .fromTo($('.wrap'), { scaleX: 1.06, scaleY: 0.96 }, { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }, 0.7);
        this.loops.push(gsap.to(g.querySelector('.bl'), { rotation: hx > cx ? 4 : -4, svgOrigin: `${cx} ${tieY}`, duration: 2 + (i % 4) * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.2 }));
        gsap.fromTo($('.g-count b'), { scale: 1.5 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
      }
      const r = $('.g-reason');
      r.textContent = `${i + 1}. ${ctx.fmt(reasons[i])}`;
      if (!R) gsap.fromTo(r, { opacity: 0, y: 16, scale: 0.92, rotation: (i % 2 ? 2 : -2) }, { opacity: 1, y: 0, scale: 1, rotation: (i % 2 ? 1 : -1), duration: 0.6, ease: 'back.out(2)', overwrite: 'auto' });
      if (n === N && !done) { done = true; ctx.after(R ? 300 : 1000, finale); }
    };

    const finale = () => {
      const fin = ctx.get('copy.specimens.finale');
      ctx.sound.play('stamp');
      gsap.timeline()
        .to(ts, { yPercent: R ? 0 : -105, opacity: R ? 0 : 1, duration: 0.2, ease: 'power2.in' })
        .add(() => { ts[0].textContent = ctx.fmt(fin[0]); ts[1].textContent = ctx.fmt(fin[1]); })
        .fromTo(ts, { yPercent: R ? 0 : 105, opacity: R ? 0 : 1 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.06 });
      $('.g-reason').textContent = ctx.fmt(fin[2]);
      if (!R) {
        const P = $('.petals'), W = host.clientWidth, H = host.clientHeight;
        for (let k = 0; k < 60; k++) {
          const p = document.createElement('i'); p.className = 'petal'; p.style.background = COLS[k % COLS.length]; p.style.left = `${(k * 61) % 100}%`;
          P.appendChild(p);
          gsap.fromTo(p, { y: -40, x: 0, rotation: k * 30, opacity: 1 }, { y: H + 40, x: ((k % 7) - 3) * 30, rotation: k * 30 + 540, duration: 2.6 + (k % 5) * 0.5, delay: (k % 12) * 0.12, ease: 'none', onComplete: () => p.remove() });
        }
        gsap.fromTo(bed.querySelectorAll('.bl-in'), { scale: '+=0' }, { keyframes: { scale: [null, 1.6, 1.25] }, duration: 0.9, ease: 'power2.out', stagger: 0.03 });
      }
      ctx.complete();
    };

    ctx.on(host, 'pointerdown', e => {
      if (e.target.closest('button, a')) return;
      const hr = host.getBoundingClientRect();
      plant(e.clientX - hr.left, e.clientY - hr.top);
    });
    ctx.on($('.g-plant'), 'click', () => { const W = host.clientWidth; plant(W * (0.1 + ((n * 0.37) % 0.8)), host.clientHeight * 0.6); });
  },

  leave() { this.loops?.forEach(t => t.kill()); },
};
