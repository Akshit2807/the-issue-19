/* Microphone for blowing out the candles. Asked once at the start (on OPEN YOUR COPY), reused by the cake. */
let stream = null;
// phones "clean up" a blow as noise: switch the voice processing off so the breath actually registers
const AUDIO = { echoCancellation: false, noiseSuppression: false, autoGainControl: false };
export const micSupported = () => !!(window.isSecureContext && navigator.mediaDevices?.getUserMedia);
export async function requestMic() {
  if (stream && stream.active) return stream;
  if (!micSupported()) return null;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: AUDIO }); }
  catch { try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { stream = null; } }
  return stream;
}
/* already allowed on this device? then the cake can start listening without a tap */
export async function micGranted() {
  try { return (await navigator.permissions.query({ name: 'microphone' })).state === 'granted'; } catch { return false; }
}
export function stopMicTracks() { stream?.getTracks().forEach(t => t.stop()); stream = null; }
/* one shared AudioContext, created/resumed on any tap (iOS keeps contexts made outside a tap silent) */
let ac = null;
export function audioCtx() { try { ac ||= new (window.AudioContext || window.webkitAudioContext)(); } catch {} return ac; }
addEventListener('pointerdown', () => { const c = audioCtx(); if (c?.state === 'suspended') c.resume().catch(() => {}); }, { capture: true, passive: true });
