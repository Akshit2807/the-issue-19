/* Scene 4 · cake — Still Life with Cake. Feeling: HUSH / WONDER, the room going quiet before a wish. */
const gsap = window.gsap;

/* bottom-tier front arc: x = 150 - 99.6cos t, y = cy + 13 sin t, t in [0, π] */
const arc = (t, cy) => [150 - 99.6 * Math.cos(t), cy + 13 * Math.sin(t)];
function drips() {
  return [0.18, 0.42, 0.7, 1.05, 1.45, 1.8, 2.15, 2.45, 2.85].map((t, i) => {
    const [x, y] = arc(t, 197), len = [9, 14, 7, 17, 11, 15, 8, 13, 10][i];
    return `M${(x - 3).toFixed(1)} ${(y + 1).toFixed(1)} C${(x - 3).toFixed(1)} ${(y + len * 0.6).toFixed(1)} ${(x - 2.6).toFixed(1)} ${(y + len).toFixed(1)} ${x.toFixed(1)} ${(y + len).toFixed(1)} C${(x + 2.8).toFixed(1)} ${(y + len).toFixed(1)} ${(x + 3).toFixed(1)} ${(y + len * 0.6).toFixed(1)} ${(x + 3).toFixed(1)} ${(y + 1.5).toFixed(1)}`;
  }).join(' ');
}
function piping() {
  let d = '';
  for (let i = 0; i <= 26; i++) {
    const t = (i / 26) * Math.PI, [x, y] = arc(t, 257);
    d += `M${(x - 3.6).toFixed(1)} ${(y + 0.3).toFixed(1)} C${(x - 3.4).toFixed(1)} ${(y - 4.2).toFixed(1)} ${(x + 3.4).toFixed(1)} ${(y - 4.4).toFixed(1)} ${(x + 3.6).toFixed(1)} ${(y + 0.2).toFixed(1)} `;
  }
  return d;
}

/* The museum wall label: italic title, mono small print in sentence case, an accession number. */
const wallLabel = (ctx, extra = '') => {
  const L = ctx.get('copy.cake.label');
  if (typeof L === 'string') return `<div class="wall-label ${extra}">${ctx.fmt(L)}</div>`;
  return `<div class="wall-label ${extra}"><p class="wl-title"><i>${ctx.fmt(L.title)}</i>, ${ctx.fmt(L.year)}</p><p class="wl-body">${ctx.fmt(L.medium)}</p><p class="wl-body">${ctx.fmt(L.credit)}</p><p class="wl-acc">${ctx.fmt(L.acc)}</p></div>`;
};

/* A half-peeled lemon in the cake's own ink line (after Heda, whose peel always hangs off the table). */
const LEMON = `
  <g class="lemon" aria-hidden="true">
    <path class="fill" d="M6 270 C8 258 26 250 42 250 C58 250 72 258 76 268 C74 280 58 288 42 288 C26 288 8 282 6 270Z"/>
    <path class="lemon-lit" d="M52 251 C64 254 74 260 76 268 C74 278 66 285 56 287 C60 276 59 262 52 251Z"/>
    <path d="M6 270 C2 270 0 268 1 265.5 M76 268 C80 267 81 264 79 261.5"/>
    <path class="thin" d="M52 251 C59 262 60 276 56 287 M60 262 L72 264 M61 270 L75 270 M60 278 L71 279"/>
    <path d="M12 279 C2 286 12 294 3 301 C-4 307 5 313 -2 320"/>
  </g>`;

function candles(n) {
  const sp = n > 1 ? Math.min(22, 104 / (n - 1)) : 0;
  return Array.from({ length: n }, (_, i) => {
    const x = 150 + (i - (n - 1) / 2) * sp, base = 137 + (i % 2 ? -4 : 3), top = base - 34;
    return { x, base, top };
  });
}

export default {
  id: 'cake',
  title: 'Still Life with Cake',
  feeling: 'Hush',
  tone: 'dark',
  transition: 'hush',
  hushLine: 'copy.hush.cake',
  nextLabel: 'I wished. Turn the page →',
  assets: () => [],
  glyph: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 40V22h6v18M24 18c-3-3-2-6 0-9 2 3 3 6 0 9z"/></svg>`,

  verso(ctx) {
    return `<div class="plate plate--dark">
      <p class="mono plate-folio"><span>P. 04</span><span>STILL LIFE</span></p>
      <h2 class="h2 plate-title">Still Life with Cake</h2>
      <p class="mono plate-feeling">FEELING — HUSH</p>
      <p class="deck plate-deck">The room goes quiet before a wish.</p>
      ${wallLabel(ctx, 'wall-label--verso')}
    </div>`;
  },

  mount(el, ctx) {
    const cs = candles(ctx.config.candles || 5);
    this.cs = cs;
    const mic = ctx.config.features?.micBlow && window.isSecureContext && navigator.mediaDevices?.getUserMedia;
    el.innerHTML = `
      <div class="cake" data-gesture>
        <div class="glow" aria-hidden="true" data-arrive></div>
        <figure class="still" data-arrive>
          <svg class="cake-svg" viewBox="0 0 300 300" role="img" aria-label="A two-tier cake on a pewter plate with ${cs.length} lit candles">
            <g class="ln">
              <path class="fill" d="M18 266 C18 254 80 249 150 249 C222 249 283 255 282 266 C281 277 220 283 150 283 C80 283 18 278 18 266Z"/>
              <path d="M46 263 C50 257 98 255 150 255 C204 255 250 257 254 263"/>
              <path d="M118 283 C121 290 179 290 182 283"/>
              <path class="fill" d="M50 196 L50.6 257 C52 266 100 270 150 270 C202 270 248 265 249.4 257 L250 196 C248 187 203 183 150 183 C98 183 52 187 50 196Z"/>
              <path d="M50 196 C52 205 98 209 150 209 C203 209 248 205 250 196"/>
              <path class="thin" d="${drips()}"/>
              <path d="M50.4 229 C52 238 100 242 150 242 C202 242 248 238 249.6 229" class="thin"/>
              <path class="thin" d="${piping()}"/>
              <path class="fill" d="M86 136 L86.5 192 C88 199 116 201 150 201 C184 201 212 199 213.5 192 L214 136 Z"/>
              <path class="fill" d="M86 136 C88 129 116 127 150 127 C184 127 212 129 214 136 C212 143 184 145 150 145 C116 145 88 143 86 136Z"/>
              <path class="thin" d="M87 170 C92 176 118 178 150 178 C182 178 208 176 213 170"/>
              ${cs.map(c => `<g class="candle"><path class="fill" d="M${c.x - 2.6} ${c.base} L${c.x - 2.4} ${c.top} L${c.x + 2.5} ${c.top} L${c.x + 2.6} ${c.base}Z"/><path class="thin" d="M${c.x - 2.4} ${c.top + 9} L${c.x + 2.5} ${c.top + 5} M${c.x - 2.5} ${c.top + 19} L${c.x + 2.5} ${c.top + 15} M${c.x - 2.5} ${c.top + 29} L${c.x + 2.5} ${c.top + 25}"/><path d="M${c.x} ${c.top} L${c.x + 0.4} ${c.top - 3.5}"/></g>`).join('')}
              ${LEMON}
              <!-- candlelight on the cake: front rims and candle tops catch the flames; it goes out with them -->
              <g class="rimlight">
                <path d="M86 136 C88 143 116 145 150 145 C184 145 212 143 214 136"/>
                <path d="M50 196 C52 205 98 209 150 209 C203 209 248 205 250 196"/>
                ${cs.map(c => `<path d="M${c.x - 2.4} ${c.top + 0.5} L${c.x + 2.5} ${c.top + 0.5}"/>`).join('')}
              </g>
            </g>
            <path class="petal" d="M262 280 C270 272 284 272 288 279 C284 287 270 289 262 280Z"/>
            <path class="petal-vein" d="M265 280 C272 279 279 279 286 279"/>
          </svg>
          <!-- flames + smoke in their own SVG: the sway repaints this small layer, never the cake -->
          <svg class="flame-svg" viewBox="0 0 300 300" aria-hidden="true">
            ${cs.map((c, i) => `
              <g transform="translate(${c.x + 0.4} ${c.top - 3})">
                <path class="smoke" pathLength="1" d="M0 -2 C-7 -12 6 -20 0 -31 C-6 -41 5 -49 -1 -60 C-5 -67 0 -72 3 -76"/>
                <g class="flame" data-i="${i}"><g class="sway">
                  <path class="fl-out" d="M0 0 C-5.2 -2.5 -6.4 -10 -0.6 -23 C5.8 -11 5.4 -3 0 0Z"/>
                  <path class="fl-core" d="M0 -1 C-2.4 -2.6 -2.9 -6.5 -0.2 -12 C2.7 -6.8 2.4 -2.8 0 -1Z"/>
                </g></g>
              </g>`).join('')}
          </svg>
        </figure>
        <div class="dim" aria-hidden="true"></div>
        <p class="instruction" data-arrive>${ctx.fmt(ctx.get('copy.cake.instruction'))}</p>
        ${mic ? `<button class="mic chip" type="button">${ctx.fmt(ctx.get('copy.cake.mic'))}</button>` : ''}
        <p class="redpen note dramatic" aria-live="polite"></p>
        ${wallLabel(ctx).replace('<div class="wall-label ', '<div data-arrive class="wall-label ')}
        <p class="age" aria-hidden="true">${ctx.fmt('{{age}}')}</p>
        <p class="subtitle" aria-live="polite"></p>
        <div class="overthink mono" aria-hidden="true"><span>wish coming true… 87%</span><i><b></b></i></div>
        <h2 class="sr-only" tabindex="-1" data-focus>Still Life with Cake. Press and hold anywhere, or hold Space, to blow out the candles.</h2>
      </div>`;
    this.el = el;
  },

  enter(ctx) {
    const el = this.el, R = ctx.reduced, $ = s => el.querySelector(s), m = ctx.motion;
    const flames = [...el.querySelectorAll('.flame')];
    const smokes = [...el.querySelectorAll('.smoke')];
    const lit = new Set(flames.map((_, i) => i));
    let holding = false, holdTimer = 0, thumbX = 0, finished = false, outThisHold = 0;

    // reset
    gsap.set(flames, { opacity: 1, scaleY: 1, skewX: 0, transformOrigin: '50% 100%' });
    gsap.set(smokes, { opacity: 0, y: 0, strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set([$('.dim'), $('.age'), $('.subtitle'), $('.overthink')], { opacity: 0 });
    gsap.set($('.glow'), { opacity: 0.62 });
    $('.dramatic').innerHTML = ''; $('.subtitle').textContent = '';
    gsap.set([$('.instruction'), $('.mic'), $('.wall-label')].filter(Boolean), { opacity: 1 });

    /* entrance: the lights come up slowly */
    gsap.set($('.rimlight'), { opacity: 1 });
    if (R) gsap.fromTo([$('.still'), $('.instruction'), $('.wall-label')], { opacity: 0 }, { opacity: 1, duration: 0.2 });
    else gsap.timeline()
      .fromTo($('.glow'), { opacity: 0 }, { opacity: 0.62, duration: 2.2, ease: 'sine.inOut' }, 0)
      .fromTo($('.still'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1.6, ease: 'expo.out' }, 0.2)
      .fromTo($('.rimlight'), { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'sine.inOut' }, 0.9)
      .fromTo(flames, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.12 }, 0.8)
      .fromTo($('.wall-label'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 1.2)
      .fromTo([$('.instruction'), $('.mic')].filter(Boolean), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.6);

    /* idle: glow flicker + flame sway (static under reduced motion) */
    if (!R) {
      const flick = () => gsap.to($('.glow'), { opacity: gsap.utils.random(0.55, 0.7), duration: gsap.utils.random(0.9, 1.4), ease: 'sine.inOut', onComplete: () => !finished && flick() });
      ctx.after(2200, flick);
      el.querySelectorAll('.sway').forEach(s => gsap.to(s, { rotation: gsap.utils.random(-3, 3), scaleY: gsap.utils.random(0.94, 1.05), duration: gsap.utils.random(0.5, 0.9), ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 100%', delay: Math.random() * 0.5 }));
    }

    const lean = flames.map(f => ({ skew: gsap.quickTo(f, 'skewX', { duration: 0.25, ease: 'power2.out' }), sy: gsap.quickTo(f, 'scaleY', { duration: 0.6, ease: 'power2.out' }) }));
    const fx = () => flames.map(f => { const r = f.getBoundingClientRect(); return r.left + r.width / 2; });

    const blowOut = i => {
      if (!lit.has(i)) return;
      lit.delete(i); outThisHold++;
      // a flame squashes flat for a frame before it goes (it fights a little)
      if (R) gsap.to(flames[i], { opacity: 0, duration: 0.15, overwrite: 'auto' });
      else gsap.timeline()
        .to(flames[i], { scaleX: 1.3, scaleY: 0.4, skewX: 0, duration: 0.08, ease: 'power2.out', overwrite: 'auto' })
        .to(flames[i], { scaleY: 0, scaleX: 0.6, opacity: 0, duration: 0.14, ease: 'power2.in' });
      const s = smokes[i];
      if (R) gsap.fromTo(s, { opacity: 0.7, strokeDashoffset: 0 }, { opacity: 0, duration: 1.2, delay: 0.3 });
      else gsap.timeline()
        .set(s, { opacity: 0.8 })
        .fromTo(s, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power1.out' }, 0)
        .fromTo(s, { y: 0 }, { y: -40, duration: 1.6, ease: 'power1.out' }, 0)
        .fromTo(s, { x: 0 }, { x: gsap.utils.random([-6, 6]), duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0)
        .to(s, { opacity: 0, duration: 1.0, ease: 'power1.in' }, 0.6);
      ctx.sound.play('paper');
      if (!lit.size) allOut();
    };
    const nearest = x => {
      const xs = fx(); let best = -1, bd = Infinity;
      lit.forEach(i => { const d = Math.abs(xs[i] - x); if (d < bd) { bd = d; best = i; } });
      return best;
    };

    const startHold = x => {
      if (finished || holding) return;
      holding = true; thumbX = x; outThisHold = 0;
      gsap.to($('.instruction'), { opacity: 0.35, duration: 0.3 });
      const xs = fx();
      flames.forEach((f, i) => { if (!lit.has(i)) return; lean[i].skew(-gsap.utils.clamp(-18, 18, ((xs[i] - thumbX) / 200) * 18 + (xs[i] >= thumbX ? 4 : -4))); lean[i].sy(0.75); });
      holdTimer = ctx.every(550, () => { const i = nearest(thumbX); if (i >= 0) blowOut(i); });
    };
    const moveHold = x => {
      if (!holding) return; thumbX = x;
      const xs = fx();
      flames.forEach((f, i) => lit.has(i) && lean[i].skew(-gsap.utils.clamp(-18, 18, ((xs[i] - thumbX) / 200) * 18 + (xs[i] >= thumbX ? 4 : -4))));
    };
    const endHold = () => {
      if (!holding) return; holding = false;
      ctx.clear(holdTimer);
      if (finished) return;
      gsap.to($('.instruction'), { opacity: 1, duration: 0.4 });
      flames.forEach((f, i) => lit.has(i) && gsap.to(f, { skewX: 0, scaleY: 1, ...m.sp('wobble') }));
      if (outThisHold > 0 && lit.size) m.redpen($('.dramatic'), ctx.fmt(ctx.get('copy.cake.dramatic')));
    };

    const scene = $('.cake');
    ctx.on(scene, 'pointerdown', e => {
      if (e.target.closest('button, a')) return;
      try { scene.setPointerCapture(e.pointerId); } catch {}
      startHold(e.clientX);
    });
    ctx.on(scene, 'pointermove', e => moveHold(e.clientX));
    ctx.on(scene, 'pointerup', endHold);
    ctx.on(scene, 'pointercancel', endHold);
    ctx.on(scene, 'contextmenu', e => e.preventDefault());

    /* keyboard: Space/Enter held = hold, thumb at centre */
    ctx.on(window, 'keydown', e => {
      if ((e.key !== ' ' && e.key !== 'Enter') || e.target.closest?.('button, a')) return;
      e.preventDefault();
      if (!e.repeat) { const r = $('.still').getBoundingClientRect(); startHold(r.left + r.width / 2); }
    });
    ctx.on(window, 'keyup', e => { if (e.key === ' ' || e.key === 'Enter') endHold(); });

    /* mic (opt-in) */
    const micBtn = $('.mic');
    if (micBtn) ctx.on(micBtn, 'click', async () => {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        this.ac = ac;
        const an = ac.createAnalyser(); an.fftSize = 512;
        ac.createMediaStreamSource(this.stream).connect(an);
        const buf = new Float32Array(an.fftSize);
        let since = 0;
        micBtn.textContent = 'listening… blow.';
        const loop = now => {
          if (!this.stream) return;
          an.getFloatTimeDomainData(buf);
          const rms = Math.sqrt(buf.reduce((a, v) => a + v * v, 0) / buf.length);
          if (rms > 0.12) { since ||= now; if (now - since > 150) { since = 0; const r = $('.still').getBoundingClientRect(); blowOut(nearest(r.left + r.width / 2)); } }
          else since = 0;
          this.raf = requestAnimationFrame(loop);
        };
        this.raf = requestAnimationFrame(loop);
      } catch { micBtn.hidden = true; }
    });

    /* all out: the Hush (input locked, ~9s) */
    let hushTl = null, hurryAt = Infinity;
    // after the subtitles start, a tap hurries the quiet along (x3) without breaking it
    ctx.on(scene, 'pointerdown', () => { if (hushTl && hushTl.time() >= hurryAt) hushTl.timeScale(3); });
    const allOut = () => {
      finished = true; holding = false;
      ctx.clear(holdTimer);
      ctx.quiet();
      this.stopMic();
      const sub = $('.subtitle');
      const tl = hushTl = gsap.timeline();
      tl.to($('.glow'), { opacity: 0, duration: R ? 0.2 : 0.9, ease: 'power2.in', overwrite: true }, 0)
        .to($('.rimlight'), { opacity: 0, duration: R ? 0.2 : 0.9, ease: 'power2.in' }, 0)
        .to($('.dim'), { opacity: 0.82, duration: R ? 0.2 : 1.4, ease: 'sine.inOut' }, 0)
        .to([$('.instruction'), $('.mic'), $('.dramatic'), $('.wall-label')].filter(Boolean), { opacity: 0, duration: 0.6 }, 0)
        .fromTo($('.age'), { opacity: 0, y: R ? 0 : 16, scale: R ? 1 : 0.96 }, { opacity: 0.9, y: 0, scale: 1, duration: R ? 0.4 : 1.6, ease: 'expo.out' }, 1.2)
        .to($('.age'), { opacity: 0, duration: 0.9, ease: 'sine.inOut' }, 4.2)
        .addLabel('subs', 3.0);
      hurryAt = 3.0;
      ctx.get('copy.cake.subtitles').forEach((line, i, all) => {
        const text = ctx.fmt(line), last = i === all.length - 1;
        tl.add(() => { sub.textContent = text; }, i ? '>' : 'subs')
          .fromTo(sub, { opacity: 0, y: R ? 0 : 8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, '<');
        if (last) tl.fromTo($('.overthink'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, '<0.3')
          .fromTo($('.overthink b'), { scaleX: 0 }, { scaleX: 0.87, duration: R ? 0.2 : 1.6, ease: 'expo.out' }, '<');
        else tl.to(sub, { opacity: 0, duration: 0.3, ease: 'power2.in' }, `+=${m.hold(text)}`);
      });
      tl.add(() => ctx.complete(), '+=1.2');
    };
  },

  stopMic() {
    cancelAnimationFrame(this.raf);
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.ac?.close?.(); this.ac = null;
  },
  leave() { this.stopMic(); },
};
