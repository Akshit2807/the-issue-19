/* Sound (DESIGN.md §5.6): off by default, ambient <audio>, WebAudio-synthesised sfx, haptics. */
let on = false, ac = null, audio = null, cfg = null, rampId = 0;

function store(v) { try { localStorage.setItem('issue-sound', v ? '1' : '0'); } catch {} }
function stored() { try { return localStorage.getItem('issue-sound') === '1'; } catch { return false; } }

function ramp(to, done) {
  const id = ++rampId, from = audio.volume, t0 = performance.now();
  const step = now => {
    if (id !== rampId) return;
    const p = Math.min(1, (now - t0) / 1200);
    audio.volume = from + (to - from) * p;
    p < 1 ? requestAnimationFrame(step) : done?.();
  };
  requestAnimationFrame(step);
}

function noise(len) {
  const b = ac.createBuffer(1, Math.max(1, ac.sampleRate * len), ac.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = ac.createBufferSource(); s.buffer = b; return s;
}
function env(gain, t, len) {
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  g.connect(ac.destination); return g;
}
function tone(freq, gain, len, t, to = freq) {
  const o = ac.createOscillator(); o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(to, t + len);
  o.connect(env(gain, t, len)); o.start(t); o.stop(t + len);
}
function hiss(gain, len, t, type = 'highpass', f = 2000) {
  const n = noise(len), fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.value = f;
  n.connect(fl); fl.connect(env(gain, t, len)); n.start(t);
}

const sfx = {
  shutter: t => { hiss(0.18, 0.03, t); tone(1800, 0.08, 0.01, t + 0.035); },
  stamp: t => { tone(80, 0.25, 0.12, t, 50); hiss(0.12, 0.03, t, 'lowpass', 1200); },
  paper: t => hiss(0.08, 0.18, t, 'bandpass', 3000),
  crash: t => { tone(70, 0.25, 0.25, t, 40); hiss(0.18, 0.22, t, 'lowpass', 900); },
  tick: t => hiss(0.06, 0.002, t),
};

export default {
  init(config) {
    cfg = config.sound || {};
    if (cfg.ambient) {
      audio = new Audio();
      audio.loop = true; audio.preload = 'none'; audio.src = cfg.ambient; audio.volume = 0;
    }
    on = stored();
  },
  get on() { return on; },
  /* Called on the first user gesture (press OPEN, or the sound toggle). */
  unlock() {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch { ac = null; } }
    ac?.resume?.();
    if (on && audio && audio.paused) { audio.play().catch(() => {}); ramp(cfg.volume ?? 0.35); }
  },
  toggle() {
    on = !on; store(on); this.unlock();
    if (audio && !on) ramp(0, () => audio.pause());
    return on;
  },
  play(name) {
    if (!on || !ac || !sfx[name]) return;
    try { sfx[name](ac.currentTime + 0.005); } catch {}
  },
  haptic() { if (navigator.userActivation?.hasBeenActive ?? true) navigator.vibrate?.(8); },
};
