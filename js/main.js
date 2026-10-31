/* Boot: read params, load config, init motion/sound, start the manager. */
import config from '../config.js';
import motion from './motion.js';
import sound from './sound.js';
import { createManager } from './manager.js';
import { openVault, mergeInto } from './vault.js';
import press from './scenes/press.js';
import cover from './scenes/cover.js';
import release from './scenes/release.js';
import cake from './scenes/cake.js';
import edit from './scenes/edit.js';
import gifts from './scenes/gifts.js';
import specimens from './scenes/specimens.js';
import letter from './scenes/letter.js';
import back from './scenes/back.js';

const q = new URLSearchParams(location.search);
const tParam = q.get('t') && new Date(q.get('t'));
const offset = tParam && !isNaN(tParam) ? tParam - Date.now() : 0;   // ?t= fakes "now", and the clock keeps ticking
const now = () => new Date(Date.now() + offset);

if (motion.reduced) document.documentElement.classList.add('reduce');
window.gsap.config({ force3D: 'auto' });   // no lingering translate3d layers once a scene settles
sound.init(config);
addEventListener('pointerdown', () => sound.unlock(), { once: true, capture: true });   // after the unlock reload, music resumes on her first tap

const start = () => createManager({
  config, now,
  scenes: [press, cover, release, cake, edit, gifts, specimens, letter, back],
  startId: q.get('scene'),
});
// Wait (briefly) for the type so the masthead fits on first measure.
// Unlock with the password she saved on this device (if any), then start.
const boot = async () => {
  let saved = null;
  try { saved = localStorage.getItem('billuu-key'); } catch {}
  if (saved) {
    const sec = await openVault(saved);
    if (sec) { mergeInto(config, sec); window.__issueUnlocked = true; }
    else try { localStorage.removeItem('billuu-key'); } catch {}
  }
  start();
};
Promise.race([document.fonts?.ready, new Promise(r => setTimeout(r, 1500))]).then(boot);
