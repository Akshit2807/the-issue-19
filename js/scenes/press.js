/* Scene 1 · press — Press Check. Feeling: ANTICIPATION, the held breath. */
import { isUnlocked } from '../manager.js';
import { openVault, normalize } from '../vault.js';

const gsap = window.gsap;

/* A hand-nudged closed ring: points around a circle with seeded wobble, smoothed (Catmull-Rom -> cubic). */
export function ringPath(cx, cy, r, amp, seed, n = 22) {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280) - 0.5;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2, rr = r + rnd() * amp * 2;
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  });
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

const two = n => String(n).padStart(2, '0');

export default {
  id: 'press',
  title: 'Press Check',
  feeling: 'Anticipation',
  tone: 'dark',
  fullBleed: true,
  transition: 'turn',
  nextLabel: 'Open your copy →',
  noSkip: true,
  glyph: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="${ringPath(24, 24, 17, 1.2, 4, 12)}"/><path d="M24 24 L24 11"/></svg>`,

  mount(el, ctx) {
    el.innerHTML = `
      <div class="press">
        <div class="press-stack" data-arrive>
          <p class="mono press-label">${ctx.fmt(ctx.get('copy.press.label'))}</p>
          <div class="dial">
            <svg class="dial-svg" viewBox="0 0 300 300" aria-hidden="true">
              <path class="ring-tint" d="${ringPath(150, 150, 118, 2.4, 3)}" />
              <g filter="url(#stain)">
                <path class="ring ring-bleed" pathLength="1" d="${ringPath(150, 150, 121, 2.2, 7)}" />
                <path class="ring ring-edge" pathLength="1" d="${ringPath(150, 150, 120, 2.6, 11)}" />
                <path class="ring ring-echo" pathLength="1" d="${ringPath(157, 145, 111, 3, 19)}" />
                <path class="ring ring-drip" pathLength="1" d="M226 214 C232 222 236 230 233 238 C230 244 222 242 222 235 C222 228 226 222 226 214Z" />
              </g>
              <g class="ticks">${Array.from({ length: 12 }, (_, i) => `<line x1="150" y1="40" x2="150" y2="${i % 3 ? 46 : 52}" transform="rotate(${i * 30} 150 150)"/>`).join('')}</g>
            </svg>
            <!-- the sweep hand lives in its own SVG and turns by CSS: a compositor-only layer, the dial never repaints -->
            <svg class="hand-svg" viewBox="0 0 300 300" aria-hidden="true"><g class="hand"><line x1="150" y1="158" x2="150" y2="44"/><circle cx="150" cy="150" r="3.2"/></g></svg>
            <div class="clock" role="timer" aria-live="off"></div>
          </div>
          <p class="redpen press-note" aria-live="polite"></p>
        </div>
        <div class="strike" hidden>
          <svg class="marks" aria-hidden="true">${['tl', 'tr', 'bl', 'br'].map(c => `<path class="crop crop-${c}" pathLength="1" d=""/>`).join('')}${['l', 'r'].map(c => `<g class="reg reg-${c}"><circle r="6" pathLength="1"/><path d="M-10 0H10M0 -10V10" pathLength="1"/></g>`).join('')}</svg>
          <div class="strike-hwrap">
            <h1 class="h1 strike-h" tabindex="-1">${ctx.get('copy.press.headline').map(l => `<span class="ml"><span>${ctx.fmt(l)}</span></span>`).join('')}</h1>
            <p class="h1 strike-h strike-ghost" aria-hidden="true">${ctx.get('copy.press.headline').map(l => `<span class="ml"><span>${ctx.fmt(l)}</span></span>`).join('')}</p>
          </div>
          <p class="deck strike-deck"></p>
          <button class="btn strike-btn" type="button">[ ${ctx.fmt(ctx.get('copy.press.button'))} ]</button>
        </div>
        <div class="lock" hidden>
          <svg class="padlock" viewBox="0 0 80 96" aria-hidden="true"><path class="shackle" d="M20 44 V28 C20 14 30 6 40 6 C50 6 60 14 60 28 V44" fill="none" stroke="var(--paper)" stroke-width="7" stroke-linecap="round"/><rect x="8" y="42" width="64" height="50" rx="10" fill="var(--red)"/><circle cx="40" cy="62" r="6" fill="var(--ink)"/><path d="M40 64 L40 78" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/></svg>
          <h2 class="h2 lock-title">${ctx.fmt(ctx.get('copy.lock.title'))}</h2>
          <p class="deck lock-sub">${ctx.fmt(ctx.get('copy.lock.sub'))}</p>
          <label class="lock-field">
            <span class="sr-only">Password</span>
            <input class="lock-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="12" enterkeyhint="go">
            <span class="lock-slots" aria-hidden="true"></span>
          </label>
          <p class="mono lock-count"></p>
          <p class="redpen lock-msg" aria-live="polite"></p>
          <button class="btn strike-btn lock-btn" type="button">[ ${ctx.fmt(ctx.get('copy.lock.button'))} ]</button>
          <button class="lock-hint-btn" type="button">${ctx.fmt(ctx.get('copy.lock.hintButton'))}</button>
        </div>
        <div class="flash" aria-hidden="true"></div>
      </div>`;
    this.el = el;
  },

  enter(ctx) {
    const el = this.el, R = ctx.reduced;
    const $ = s => el.querySelector(s);
    const stack = $('.press-stack'), strike = $('.strike'), clock = $('.clock'), note = $('.press-note');
    const bday = new Date(ctx.config.birthday);
    let noteI = 0, struck = false;

    // reset
    strike.hidden = true; note.innerHTML = '';
    gsap.set($('.strike-ghost'), { opacity: 0 });
    gsap.set(stack, { opacity: 1, y: 0 });
    gsap.set($('.flash'), { opacity: 0 });
    clock.innerHTML = '';

    const remaining = () => Math.max(0, bday - ctx.now());
    const parts = ms => { const s = Math.ceil(ms / 1000); return [two(Math.floor(s / 3600)), two(Math.floor(s / 60) % 60), two(s % 60)]; };

    /* slots */
    const build = ([h, m, s]) => {
      clock.innerHTML = [h, m, s].map((g, gi) => [...g].map(d => `<span class="slot"><span class="dg">${d}</span></span>`).join('') + (gi < 2 ? '<span class="colon">:</span>' : '')).join('');
      clock.setAttribute('aria-label', `${+h} hours, ${+m} minutes, ${+s} seconds until print`);
    };
    const roll = str => {
      const chars = str.join('').split('');
      const slots = clock.querySelectorAll('.slot');
      if (slots.length !== chars.length) return build(str);
      slots.forEach((slot, i) => {
        const curEl = slot.lastElementChild;
        if (curEl.textContent === chars[i]) return;
        if (R) { curEl.textContent = chars[i]; return; }
        const nx = document.createElement('span'); nx.className = 'dg'; nx.textContent = chars[i];
        slot.append(nx);
        gsap.fromTo(nx, { yPercent: 100 }, { yPercent: 0, duration: 0.24, ease: 'expo.out' });
        gsap.to(curEl, { yPercent: -100, duration: 0.24, ease: 'expo.out', onComplete: () => curEl.remove() });
      });
      clock.setAttribute('aria-label', `${+str[0]} hours, ${+str[1]} minutes, ${+str[2]} seconds until print`);
    };

    /* crop marks hug the frame corners, registration targets sit mid-edge */
    const placeMarks = () => {
      const svg = $('.marks'), W = el.clientWidth, H = el.clientHeight;
      const g = W >= 1024 ? 40 : 14, top = g + 34, bot = H - g - 20, L = 14, o = 6;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const d = { tl: `M${g - o} ${top}H${g - o - L}M${g} ${top - o}V${top - o - L}`, tr: `M${W - g + o} ${top}H${W - g + o + L}M${W - g} ${top - o}V${top - o - L}`,
        bl: `M${g - o} ${bot}H${g - o - L}M${g} ${bot + o}V${bot + o + L}`, br: `M${W - g + o} ${bot}H${W - g + o + L}M${W - g} ${bot + o}V${bot + o + L}` };
      Object.entries(d).forEach(([k, v]) => $(`.crop-${k}`).setAttribute('d', v));
      $('.reg-l').setAttribute('transform', `translate(${g - 2} ${H / 2})`);
      $('.reg-r').setAttribute('transform', `translate(${W - g + 2} ${H / 2})`);
    };

    const pastAtLoad = remaining() === 0;
    // When she opens it late, the dial still "counts down" the last beat: it lands on 00:00:00, then strikes.
    build(pastAtLoad ? ['00', '00', '03'] : parts(remaining()));

    /* load choreography */
    const tl = gsap.timeline();
    if (R) {
      tl.fromTo([$('.press-label'), $('.dial')], { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.set(el.querySelectorAll('.ring'), { strokeDashoffset: 0 });
    } else {
      tl.fromTo($('.press-label'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0.2)
        .fromTo($('.dial'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.4)
        .fromTo(el.querySelectorAll('.ring'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'expo.out', stagger: 0.35 }, 0.4)
        .fromTo($('.ring-tint'), { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0.9)
        .fromTo($('.ticks'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.1)
        .fromTo(clock.querySelectorAll('.dg'), { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: 'expo.out', stagger: 0.04 }, 0.9);
    }
    // sweep hand: one revolution per minute, aligned to the real second hand
    // static start angle on `rotate`; the CSS animation adds its turn on `transform` (they compose)
    const sec = ctx.now().getSeconds() + ctx.now().getMilliseconds() / 1000;
    const hand = $('.hand-svg');
    hand.style.animation = 'none'; void hand.offsetWidth; hand.style.animation = '';   // restart the minute
    hand.style.rotate = `${(sec * 6).toFixed(2)}deg`;
    gsap.fromTo(hand, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: R ? 0 : 1.2 });

    /* the strike */
    const doStrike = () => {
      if (struck) return; struck = true;
      ctx.quiet();
      const late = ctx.now() - bday > 60 * 60 * 1000;
      $('.strike-deck').textContent = ctx.fmt(ctx.get(late ? 'copy.press.late' : 'copy.press.deck'));
      ctx.sound.play('stamp');
      const t = gsap.timeline();
      if (!R) t.fromTo($('.flash'), { opacity: 0 }, { keyframes: { opacity: [0, 0.85, 0] }, duration: 0.12, ease: 'none' });
      t.to(stack, { opacity: 0, y: R ? 0 : -12, duration: 0.36, ease: 'power2.in' })
        .add(() => { strike.hidden = false; placeMarks(); $('.strike-h').focus({ preventScroll: true }); })
        .addLabel('print')
        .add(ctx.motion.maskReveal(el.querySelectorAll('.strike-h:not(.strike-ghost) .ml > span')), 'print');
      if (!R) {
        // a print event: crop marks and registration targets draw in, the plate lands, one frame of red off-register
        t.fromTo(el.querySelectorAll('.marks path, .marks circle'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3, ease: 'power2.out', stagger: 0.04 }, 'print')
          .fromTo($('.strike-hwrap'), { scale: 1.03 }, { scale: 1, ...ctx.motion.presets.stamp }, 'print+=0.22')
          .fromTo($('.strike-ghost'), { opacity: 0.6, x: 3 }, { opacity: 0, x: 0, duration: 0.22, ease: 'power2.out' }, 'print+=0.26');
      } else gsap.set(el.querySelectorAll('.marks path, .marks circle'), { strokeDashoffset: 0 });
      t
        .fromTo($('.strike-deck'), { opacity: 0, y: R ? 0 : 10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 'print+=0.6')
        .fromTo($('.strike-btn'), { opacity: 0, y: R ? 0 : 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)' }, '>+0.6');
    };

    const tick = () => {
      if (struck) return;
      const ms = remaining();
      roll(parts(ms));
      if (ms <= 0) ctx.after(400, doStrike);
    };

    if (pastAtLoad) {
      // three last seconds, then STOP THE PRESSES (2.4s after the dial lands)
      let n = 3;
      ctx.after(R ? 600 : 1500, () => {
        const id = ctx.every(800, () => { n--; roll(['00', '00', two(n)]); if (n <= 0) { ctx.clear(id); ctx.after(500, doStrike); } });
      });
    } else {
      ctx.after(1000 - (ctx.now().getMilliseconds()), () => { tick(); ctx.every(1000, tick); });
    }

    /* waiting notes: tap anywhere before midnight */
    ctx.on(el, 'pointerdown', e => {
      if (struck || e.target.closest('button')) return;
      const notes = ctx.get('copy.press.waiting');
      ctx.motion.redpen(note, ctx.fmt(notes[noteI++ % notes.length]));
    });

    /* the lock: after OPEN YOUR COPY, she has to say the magic word (her nickname) */
    const L = ctx.get('copy.lock'), pass = { length: L.length || 5 };
    let checking = false;
    const lock = $('.lock'), input = $('.lock-input'), slots = $('.lock-slots'), msg = $('.lock-msg');
    let wrongN = 0, opened = false;
    lock.hidden = true; input.value = ''; msg.textContent = '';
    slots.innerHTML = Array.from({ length: pass.length }, () => '<i></i>').join('');
    $('.lock-count').textContent = ctx.fmt(L.count).replace('{n}', pass.length);
    const paint = () => {
      const v = input.value.toLowerCase();
      [...slots.children].forEach((b, i) => { b.textContent = v[i] || ''; b.classList.toggle('is-on', !!v[i]); b.classList.toggle('is-cursor', i === Math.min(v.length, pass.length - 1) && v.length < pass.length); });
    };
    paint();
    const tryOpen = async () => {
      const v = input.value.trim().toLowerCase();
      if (!v) { input.focus(); return; }
      if (checking || opened) return;
      checking = true;
      const sec = await openVault(v);
      checking = false;
      if (sec) {
        opened = true; input.blur(); msg.textContent = '';
        try { localStorage.setItem('billuu-key', normalize(v)); } catch {}
        window.__issueUnlocked = true;
        ctx.sound.play('stamp'); ctx.sound.haptic();
        const t = gsap.timeline({ onComplete: () => location.replace(`${location.pathname}?scene=cover`) });   // reload: boot decrypts with the saved key
        slots.querySelectorAll('i').forEach(b => b.classList.add('is-ok'));
        if (R) t.to(lock, { opacity: 0, duration: 0.3 });
        else t.to($('.shackle'), { y: -16, duration: 0.35, ease: 'back.out(3)' })
          .to($('.padlock'), { rotation: 12, scale: 1.15, duration: 0.3, ease: 'back.out(2)' }, '<')
          .add(() => ctx.motion.redpen(msg, ctx.fmt(L.right)), '<')
          .fromTo($('.flash'), { opacity: 0 }, { keyframes: { opacity: [0, 0.8, 0] }, duration: 0.5, ease: 'none' }, '+=0.6')
          .to(lock, { opacity: 0, scale: 1.05, duration: 0.4, ease: 'power2.in' }, '<0.1');
      } else {
        ctx.sound.play('tick');
        ctx.motion.redpen(msg, ctx.fmt(L.wrong[wrongN++ % L.wrong.length]));
        if (!R) gsap.fromTo(slots, { x: 0 }, { keyframes: { x: [0, -12, 12, -8, 8, 0] }, duration: 0.45, ease: 'none' });
        if (wrongN === 2) showHint();
        ctx.after(500, () => { input.value = ''; paint(); input.focus(); });
      }
    };
    const showHint = () => { const h = $('.lock-hint-btn'); h.textContent = ctx.fmt(L.hint).replace('{n}', pass.length); h.classList.add('is-shown'); };
    ctx.on(input, 'input', () => { input.value = input.value.replace(/\s/g, '').slice(0, 12); paint(); if (input.value.length === pass.length) tryOpen(); });
    ctx.on(input, 'keydown', e => { if (e.key === 'Enter') { e.preventDefault(); tryOpen(); } });
    ctx.on($('.lock-btn'), 'click', () => !opened && tryOpen());
    ctx.on($('.lock-hint-btn'), 'click', showHint);
    ctx.on(slots, 'click', () => input.focus());

    ctx.on($('.strike-btn'), 'click', e => {
      if (e.currentTarget.classList.contains('lock-btn')) return;
      // ask for sound + mic right at the start (this tap is the user gesture browsers need)
      if (!ctx.sound.on) ctx.sound.toggle(); else ctx.sound.unlock();
      document.dispatchEvent(new Event('soundchange'));
      if (isUnlocked()) { ctx.complete(); ctx.next(); return; }   // she already said the magic word on this device
      gsap.to(strike, { opacity: 0, duration: R ? 0.1 : 0.35, ease: 'power2.in', onComplete: () => {
        strike.hidden = true; lock.hidden = false;
        if (!R) gsap.fromTo(lock.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.07 });
        input.focus({ preventScroll: true });
      } });
    });
  },

  leave() {},
};
