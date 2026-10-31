/* Motion system (DESIGN.md §2). GSAP native eases stand in for the CSS beziers. */
const gsap = window.gsap;

export const ease = {
  couture: 'expo.out',
  turn: 'power2.inOut',
  exit: 'power2.in',
  snap: 'back.out(1.6)',
  fall: 'power3.in',
  breathe: 'sine.inOut',
  stepPrint: 'steps(6)',
};

export const dur = { tap: 0.12, xs: 0.2, s: 0.36, m: 0.6, l: 0.9, xl: 1.4 };

// Damped harmonic spring -> { ease, duration } usable in gsap.to(..., { ease, duration })
export function spring({ stiffness = 170, damping = 26, mass = 1 } = {}) {
  const w0 = Math.sqrt(stiffness / mass);
  const z = damping / (2 * Math.sqrt(stiffness * mass));
  const wd = w0 * Math.sqrt(Math.max(1e-6, 1 - z * z));
  const x = t => z < 1
    ? 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t))
    : 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  let T = 0;
  for (let t = 0; t < 4; t += 1 / 240) if (Math.abs(1 - x(t)) > 0.004) T = t;
  T += 1 / 240;
  return { ease: p => (p >= 1 ? 1 : x(p * T)), duration: +T.toFixed(3) };
}

export const presets = {
  stamp: spring({ stiffness: 400, damping: 18 }),
  lift: spring({ stiffness: 260, damping: 24 }),
  settle: spring({ stiffness: 170, damping: 26 }),
  wobble: spring({ stiffness: 120, damping: 10 }),
};

const q = new URLSearchParams(location.search);
export const reduced = q.get('motion') === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Spring tween props. Reduced motion: 150ms fade-ish, final transform set instantly. */
export const sp = (name, extra = {}) => reduced
  ? { duration: 0.15, ease: 'none', overwrite: 'auto', ...extra }
  : { ...presets[name], overwrite: 'auto', ...extra };

/* Subtitle hold: 1200 + 40ms x chars, capped at 2600 (seconds). */
export const hold = text => Math.min(2600, 1200 + 40 * text.length) / 1000;

/* Red-pen write-on: transform-only mask wipe (outer slides right, inner counter-slides).
   Works on any background. Returns the tween. */
export function redpen(el, text, { delay = 0, duration = 0.9 } = {}) {
  el.innerHTML = '';
  const outer = document.createElement('span');
  outer.className = 'wipe';
  const inner = document.createElement('span');
  inner.className = 'wipe-in';
  inner.textContent = text;
  outer.append(inner);
  el.append(outer);
  el.hidden = false;
  if (reduced) return gsap.fromTo(outer, { opacity: 0 }, { opacity: 1, duration: 0.2, delay });
  gsap.set(outer, { opacity: 1 });
  return gsap.timeline({ delay })
    .fromTo(outer, { xPercent: -101 }, { xPercent: 0, duration, ease: 'power1.inOut' }, 0)
    .fromTo(inner, { xPercent: 101 }, { xPercent: 0, duration, ease: 'power1.inOut' }, 0);
}

/* Line-mask reveal: each el is the inner span of an overflow-hidden .ml line. */
export function maskReveal(lines, { delay = 0, stagger = 0.05, duration = 0.9 } = {}) {
  if (reduced) return gsap.fromTo(lines, { opacity: 0, yPercent: 0 }, { opacity: 1, duration: 0.2, delay, overwrite: 'auto' });
  return gsap.fromTo(lines, { yPercent: 105, opacity: 1 }, { yPercent: 0, duration, ease: ease.couture, stagger, delay, overwrite: 'auto' });
}

/* Hide a red-pen note (fade). */
export const clearPen = el => gsap.to(el, { opacity: 0, duration: 0.2, onComplete: () => { el.innerHTML = ''; gsap.set(el, { opacity: 1 }); } });

/* Small page shake (removed under reduced motion). */
export function shake(el, amp = 2) {
  if (reduced) return;
  gsap.fromTo(el, { x: 0 }, { keyframes: { x: [0, -amp, amp, -amp / 2, 0] }, duration: 0.16, ease: 'none', overwrite: 'auto' });
}

export default { ease, dur, spring, presets, sp, hold, redpen, maskReveal, clearPen, shake, reduced };
