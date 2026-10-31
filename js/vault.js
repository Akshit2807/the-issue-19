/* The personal content is AES-256-GCM encrypted in content.enc.json; the key comes from her password (PBKDF2-SHA256). */
const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
let blob = null;
export const normalize = p => String(p).trim().toLowerCase().replace(/u+$/, 'u');   // "billuu" -> "billu"
export async function openVault(pass) {
  try {
    blob ||= await (await fetch('content.enc.json', { cache: 'no-store' })).json();
    const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(normalize(pass)), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(blob.salt), iterations: blob.iter, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(blob.iv) }, key, b64(blob.data));
    return JSON.parse(new TextDecoder().decode(pt));
  } catch { return null; }   // wrong password = auth tag fails
}
export function mergeInto(cfg, sec) {
  for (const [k, v] of Object.entries(sec)) {
    if (k === 'copy') Object.assign(cfg.copy, v); else cfg[k] = v;
  }
}
