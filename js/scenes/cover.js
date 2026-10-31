/* Scene 2 · cover — The Cover. Feeling: BEING SEEN. Glamour, a little embarrassed, a lot pleased. */
const gsap = window.gsap;

/* Foil barcode generated from the birthdate digits. */
function barcode(digits) {
  let x = 2, bars = '';
  for (const ch of digits) {
    const d = +ch;
    [1 + (d % 3), 1, 1 + ((d >> 1) % 3), 2].forEach((w, i) => { if (i % 2 === 0) bars += `<rect x="${x}" y="2" width="${w * 0.9}" height="32"/>`; x += w * 1.15; });
  }
  return `<svg class="barcode" viewBox="0 0 ${Math.ceil(x + 2)} 44" preserveAspectRatio="none" aria-hidden="true">${bars}<text x="2" y="42">${digits.replace(/(\d{2})(?=\d)/g, '$1 ')}</text></svg>`;
}


/* the art layer: a Matisse cut-out garden around a one-line cat in a beret (she's the art student) */
const CUT = [
  'M50 5 C58 20 70 18 66 34 C80 36 84 50 70 56 C82 66 72 80 60 74 C62 88 50 96 46 82 C36 92 26 84 32 72 C18 74 14 60 28 56 C16 46 22 34 36 38 C32 24 42 18 50 5Z',
  'M50 4 C54 26 58 34 96 40 C64 52 62 58 78 96 C58 74 42 74 22 96 C38 58 36 52 4 40 C42 34 46 26 50 4Z',
  'M30 10 C55 0 90 15 88 45 C86 75 60 95 35 88 C10 80 2 55 10 35 C14 22 20 14 30 10Z',
  'M70 8 C40 8 14 32 14 60 C14 84 34 96 56 94 C34 86 26 66 32 48 C38 30 54 16 70 8Z',
  'M50 88 C20 66 6 48 10 30 C14 14 36 10 50 28 C64 10 86 14 90 30 C94 48 80 66 50 88Z',
  'M48 2 C40 22 52 30 42 46 C32 62 50 70 40 88 L50 98 C62 80 46 70 56 54 C66 38 54 28 60 10Z',
];
const INK = ['#2F4FB0', '#B02E18', '#E8B9AE', '#E9A23B', '#F1EADD', '#B4924A'];
const cut = (i, c, cls = '') => `<svg class="cut ${cls}" viewBox="0 0 100 100" aria-hidden="true"><path d="${CUT[i % CUT.length]}" fill="${c}"/></svg>`;
const GARDEN = [ // [shape, colour, left%, top%, size%, rotate]
  [0, '#2F4FB0', -8, 18, 38, -12], [5, '#E8B9AE', 78, 14, 30, 20], [1, '#E9A23B', 74, 46, 22, 8],
  [2, '#B02E18', -10, 52, 30, 0], [3, '#F1EADD', 8, 30, 14, -30], [4, '#E8B9AE', 82, 36, 12, 14],
  [0, '#B4924A', 60, 62, 18, 40], [1, '#F1EADD', 30, 50, 9, -10], [5, '#2F4FB0', 40, 10, 14, -70],
];
const CAT = `<svg class="cat" viewBox="0 0 200 200" fill="none" aria-hidden="true">
  <circle class="sun" cx="100" cy="104" r="78" fill="#2F4FB0"/>
  <path class="ln" pathLength="1" d="M40 95 L48 38 L82 66 C94 62 106 62 118 66 L152 38 L160 95 C166 140 136 168 100 168 C64 168 34 140 40 95Z"/>
  <path class="ln" pathLength="1" d="M66 104 Q78 94 90 104 M110 104 Q122 94 134 104"/>
  <path class="ln" pathLength="1" d="M100 130 Q100 140 90 142 M100 130 Q100 140 110 142"/>
  <path class="ln" pathLength="1" d="M60 128 L24 120 M60 136 L22 140 M140 128 L176 120 M140 136 L178 140"/>
  <circle class="blush" cx="68" cy="122" r="9" fill="#E8B9AE"/><circle class="blush" cx="132" cy="122" r="9" fill="#E8B9AE"/>
  <path class="nose" d="M94 121 L106 121 L100 129Z" fill="#B02E18"/>
  <g class="beret"><path d="M62 60 C56 30 118 14 152 32 C162 40 154 52 142 56 C118 62 88 64 62 60Z" fill="#B02E18"/><path d="M104 22 L108 10" stroke="#B02E18" stroke-width="4" stroke-linecap="round"/></g>
  <g class="brush"><path d="M150 190 L184 112" stroke="#B4924A" stroke-width="5" stroke-linecap="round"/><path d="M184 112 C186 104 192 100 194 96 C196 104 192 112 186 116Z" fill="#E9A23B"/></g>
</svg>`;

export default {
  id: 'cover',
  title: 'The Cover',
  feeling: 'Being seen',
  tone: 'dark',
  fullBleed: true,
  transition: 'turn',
  nextLabel: 'Open the issue →',
  assets: () => [],
  glyph: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="8" width="24" height="32"/><path d="M15 15h18M15 33h9"/><circle cx="24" cy="24" r="4.5"/></svg>`,

  mount(el, ctx) {
    const c = ctx.config;
    const name = ctx.fmt('{{NAME}}');
    // local date, not UTC: in IST a 1 Nov birthday must print 20 26 11 01
    const bd = new Date(c.birthday), p2 = n => String(n).padStart(2, '0');
    const digits = `${bd.getFullYear()}${p2(bd.getMonth() + 1)}${p2(bd.getDate())}`;
    el.innerHTML = `
      <div class="cover">
        <div class="cover-mag" data-arrive>
          <button class="cover-shot" type="button" aria-label="Change the cover lines">
            <span class="cover-photo cover-type" aria-hidden="true"><span class="bg-num">${ctx.fmt('Nº {{age}}')}</span>${GARDEN.map(([i, c, x, y, w, r]) => `<span class="g" style="left:${x}%;top:${y}%;width:${w}%;rotate:${r}deg">${cut(i, c)}</span>`).join('')}${CAT}<span class="spawn"></span></span>
          </button>
          <div class="scrim scrim-top"></div><div class="scrim scrim-bot"></div>
          <div class="cover-top">
            <h1 class="masthead" tabindex="-1" aria-label="${ctx.fmt('{{name}}')}">${[...name].map(l => `<span class="ltr">${l === ' ' ? '&nbsp;' : l}</span>`).join('')}</h1>
            <p class="mono issue-line">${ctx.fmt('THE BIRTHDAY ISSUE · Nº {{age}} · PRINT RUN: 1')}</p>
          </div>
          <div class="lines" aria-live="polite">
            <span class="ml kicker-wrap"><span class="mono kicker"></span></span>
            <ol class="cover-lines">${[1, 2, 3].map(n => `<li><span class="ml"><span><b class="num">${n}</b><span class="cl"></span></span></span></li>`).join('')}</ol>
          </div>
          <div class="price">
            <div class="barcode-block">${barcode(digits)}<p class="mono">PRICE: PRICELESS</p></div>
            <p class="redpen price-note">${ctx.fmt(ctx.get('copy.cover.price'))}</p>
          </div>
          <svg class="arrow" aria-hidden="true"><path class="arrow-path" pathLength="1"/><path class="arrow-head" pathLength="1"/></svg>
          <p class="redpen note star-note"></p>
          <p class="redpen note return-note"></p>
          <p class="mono tap-hint" aria-hidden="true">TAP ANYWHERE TO MAKE ART</p>
          <div class="flashbulb" aria-hidden="true"></div>
        </div>
        <p class="mono slug" aria-hidden="true">PROOF 1 OF 1 — APPROVED FOR PRINT — 00:00</p>
      </div>`;
    this.el = el;
    /* masthead runs gutter to gutter. Measure at 100px with no min-width and the tightening transforms parked. */
    this.fit = () => {
      const h = el.querySelector('.masthead'), mag = el.querySelector('.cover-mag');
      const letters = [...h.querySelectorAll('.ltr')], xs = letters.map(l => gsap.getProperty(l, 'x'));
      const pad = parseFloat(getComputedStyle(h).paddingLeft) * 2;
      const target = mag.clientWidth - pad;
      gsap.set(letters, { x: 0 });
      h.style.minWidth = '0'; h.style.width = 'max-content'; h.style.fontSize = '100px';
      const w = h.scrollWidth - pad || 1;
      h.style.minWidth = ''; h.style.width = '';
      letters.forEach((l, i) => gsap.set(l, { x: xs[i] }));
      // ponytail: spec clamps 64–260px; long names may go down to 40px rather than overflow
      h.style.fontSize = `${Math.max(40, Math.min(260, (100 * target) / w)).toFixed(1)}px`;
    };
  },

  enter(ctx) {
    const el = this.el, R = ctx.reduced, $ = s => el.querySelector(s);
    const sets = ctx.get('copy.cover.lines'), kickers = ctx.get('copy.cover.kickers');
    let set = 0, flashes = 0, done = false;

    const fill = i => {
      $('.kicker').textContent = kickers[i % kickers.length];
      el.querySelectorAll('.cl').forEach((n, j) => { n.textContent = ctx.fmt(sets[i][j]); ctx.remember('coverLines', sets[i][j]); });
    };
    fill(0);
    requestAnimationFrame(this.fit);
    document.fonts?.load('900 100px "Bodoni Moda"').then(() => this.fit()).catch(() => {});
    this.onResize = () => this.fit();
    ctx.on(window, 'resize', this.onResize);
    gsap.set([$('.arrow-path'), $('.arrow-head')], { strokeDasharray: 1, strokeDashoffset: 1 });
    $('.star-note').innerHTML = ''; $('.return-note').innerHTML = '';

    const lineEls = () => el.querySelectorAll('.lines .ml > span');
    const letters = el.querySelectorAll('.ltr'), c = (letters.length - 1) / 2;

    /* entrance */
    const tl = gsap.timeline();
    if (R) {
      tl.fromTo([$('.cover-photo'), $('.masthead'), $('.issue-line'), $('.lines'), $('.price'), $('.tap-hint')], { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.set(lineEls(), { yPercent: 0 });
      gsap.set(letters, { x: 0, opacity: 1 });
    } else {
      tl.fromTo($('.cover-photo'), { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' }, 0)
        .fromTo(letters, { x: i => (i - c) * 14, opacity: 0 }, { x: 0, duration: 1.4, ease: 'expo.out' }, 0.3)
        .to(letters, { opacity: 1, duration: 0.3, ease: 'none' }, 0.3)
        .fromTo($('.issue-line'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.9)
        .add(ctx.motion.maskReveal(lineEls(), { duration: 0.8 }), 1.1)
        .fromTo($('.price'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 1.5)
        .fromTo($('.tap-hint'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 2.2);
    }
    /* the art comes alive: cat draws itself, cut-outs pop in, then everything drifts like it's underwater */
    const gs = el.querySelectorAll('.g'), lns = el.querySelectorAll('.cat .ln');
    this.loops = [];
    if (R) { gsap.set(lns, { strokeDasharray: 1, strokeDashoffset: 0 }); }
    else {
      gsap.set(lns, { strokeDasharray: 1, strokeDashoffset: 1 });
      tl.fromTo($('.cat .sun'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 1.1, ease: 'expo.out' }, 0.2)
        .to(lns, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.25 }, 0.5)
        .fromTo([...el.querySelectorAll('.cat .blush, .cat .nose')], { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(3)', stagger: 0.08 }, 1.4)
        .fromTo($('.cat .beret'), { y: -120, rotation: -40, transformOrigin: '50% 100%' }, { y: 0, rotation: 0, duration: 0.9, ease: 'bounce.out' }, 1.6)
        .fromTo($('.cat .brush'), { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'back.out(2)' }, 1.9)
        .fromTo(gs, { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(2.2)', stagger: 0.07 }, 0.4)
        .to(letters, { rotation: i => [-5, 4, -3, 6, -4, 3][i % 6], y: i => [-6, 4, -2, 6, -4, 2][i % 6], duration: 0.6, ease: 'back.out(3)', stagger: 0.04 }, 1.7);
      gs.forEach((g, i) => this.loops.push(gsap.to(g, { y: (i % 2 ? 14 : -14), rotation: (i % 2 ? 8 : -8), duration: 3 + (i % 4) * 0.7, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 + i * 0.1 })));
      this.loops.push(gsap.to($('.cat'), { rotation: 3, y: -6, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.4 }));
      this.loops.push(gsap.to($('.cat .brush'), { rotation: -14, transformOrigin: '30% 100%', duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.6 }));
    }
    /* every tap paints a new cut-out where her finger lands */
    const spawn = (x, y) => {
      const layer = $('.spawn');
      if (layer.children.length > 36) layer.firstElementChild.remove();
      const n = layer.children.length + flashes;
      const w = 44 + (n * 17) % 60;
      const s = document.createElement('span');
      s.className = 'g s'; s.style.cssText = `left:${x - w / 2}px;top:${y - w / 2}px;width:${w}px`;
      s.innerHTML = cut(n * 7 + 3, INK[n % INK.length]);
      layer.appendChild(s);
      if (!R) gsap.fromTo(s, { scale: 0, rotation: -180 + (n * 53) % 360 }, { scale: 1, rotation: (n * 37) % 60 - 30, duration: 0.7, ease: 'back.out(2.6)' });
    };
    gsap.set($('.flashbulb'), { opacity: 0 });
    $('.tap-hint').hidden = false;

    if (ctx.returnVisit) ctx.motion.redpen($('.return-note'), ctx.fmt(ctx.get('copy.cover.returnNote')), { delay: 0.6 });

    /* the arrow points at her (≈ the focus point) */
    const drawArrow = () => {
      const mag = $('.cover-mag'), W = mag.clientWidth, H = mag.clientHeight;
      const [fx, fy] = '50% 30%'.split(' ').map(v => parseFloat(v) / 100);
      const tx = W * fx + W * 0.12, ty = H * fy + H * 0.03;
      const sx = W - 22, sy = Math.min(H * 0.6, H * fy + H * 0.12);   // the note stays clear of the barcode
      const svg = $('.arrow');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      $('.arrow-path').setAttribute('d', `M${sx} ${sy} C${sx - 10} ${sy - 50}, ${tx + 70} ${ty + 80}, ${tx + 34} ${ty + 30} S${tx + 8} ${ty + 6}, ${tx} ${ty}`);
      $('.arrow-head').setAttribute('d', `M${tx + 3} ${ty + 22} L${tx} ${ty} L${tx + 21} ${ty + 6}`);
      const note = $('.star-note');
      note.style.top = `${(sy / H) * 100 + 2}%`;
      const t = gsap.timeline();
      t.to($('.arrow-path'), { strokeDashoffset: 0, duration: R ? 0 : 0.5, ease: 'power1.inOut' })
        .to($('.arrow-head'), { strokeDashoffset: 0, duration: R ? 0 : 0.18, ease: 'power1.out' });
      ctx.motion.redpen(note, ctx.fmt(ctx.get('copy.cover.starNote')), { delay: R ? 0 : 0.45 });
    };

    /* flashbulb */
    ctx.on($('.cover-shot'), 'click', e => {
      const mag = $('.cover-mag').getBoundingClientRect();
      const x = e.clientX ? e.clientX - mag.left : mag.width / 2, y = e.clientY ? e.clientY - mag.top : mag.height * 0.4;
      ctx.sound.play('shutter');
      flashes++;
      spawn(x, y);
      if (!R) {
        const fb = $('.flashbulb');
        gsap.set(fb, { x: x - fb.offsetWidth / 2, y: y - fb.offsetHeight / 2 });
        gsap.fromTo(fb, { opacity: 0 }, { keyframes: { opacity: [0, 0.9, 0] }, duration: 0.18, ease: 'none', overwrite: 'auto' });
        gsap.timeline()
          .to($('.cover-photo'), { scale: 1.012, duration: 0.05, ease: 'none', overwrite: 'auto' })
          .to($('.cover-photo'), { scale: 1, ...ctx.motion.presets.stamp });
      }
      if (flashes === 1) gsap.to($('.tap-hint'), { opacity: 0, duration: 0.3, onComplete: () => { $('.tap-hint').hidden = true; } });

      // swap cover lines: out fast, in composed. Rapid taps: the newest swap wins, the set it shows is captured.
      set = (set + 1) % sets.length;
      const nextSet = set, out = lineEls();
      this.swap?.kill();
      this.swap = gsap.timeline()
        .to(out, { yPercent: R ? 0 : -105, opacity: R ? 0 : 1, duration: R ? 0.1 : 0.2, ease: 'power2.in', overwrite: 'auto' })
        .add(() => fill(nextSet))
        .fromTo(out, { yPercent: R ? 0 : 105, opacity: R ? 0 : 1 }, { yPercent: 0, opacity: 1, duration: R ? 0.2 : 0.5, ease: 'expo.out', stagger: R ? 0 : 0.05, overwrite: 'auto' });

      if (flashes === 3 && !done) { done = true; drawArrow(); ctx.after(R ? 300 : 900, () => ctx.complete()); }
    });
  },

  leave() { this.loops?.forEach(t => t.kill()); },
};
