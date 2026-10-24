// Preferensi tampilan per perangkat (localStorage), diterapkan ke <html>
// sebagai atribut data-* / CSS zoom supaya seluruh aplikasi ikut tanpa
// tiap halaman perlu tahu:
//   fx        'full' | 'reduced'   -> data-reduce-fx   (matikan blur, mesh, animasi berat)
//   zoom      100 | 110 | 125      -> html { zoom }     (ukuran tampilan, untuk mata yang lelah)
//   contrast  'normal' | 'high'    -> data-contrast     (teks sekunder lebih tegas)
//   oled      boolean              -> data-oled         (hitam pekat di mode gelap)
//   haptics   boolean                                   (getar halus saat mencentang)
//   sound     boolean                                   (bunyi "tik" halus, default mati)
// plus `sky`, yang bukan pilihan pengguna: nama sholat yang sedang
// ditunggu, ditulis Home supaya warna latar seluruh app ikut waktu sholat.
const KEYS = { fx: 'airmoon-ui-fx', zoom: 'airmoon-ui-zoom', contrast: 'airmoon-ui-contrast', oled: 'airmoon-ui-oled', haptics: 'airmoon-ui-haptics', sound: 'airmoon-ui-sound', sky: 'airmoon-ui-sky', resume: 'airmoon-ui-resume', analytics: 'airmoon-ui-analytics', lastRoute: 'airmoon-ui-last-route' };

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Mode privat / penyimpanan penuh — pengaturan berlaku sesi ini saja.
  }
}

export function getUiPrefs() {
  const zoom = Number(read(KEYS.zoom, '100'));
  return {
    fx: read(KEYS.fx, 'full') === 'reduced' ? 'reduced' : 'full',
    zoom: [100, 110, 125].includes(zoom) ? zoom : 100,
    contrast: read(KEYS.contrast, 'normal') === 'high' ? 'high' : 'normal',
    oled: read(KEYS.oled, '0') === '1',
    haptics: read(KEYS.haptics, '1') !== '0',
    sound: read(KEYS.sound, '0') === '1',
    resume: read(KEYS.resume, '0') === '1',
    analytics: read(KEYS.analytics, '1') !== '0',
  };
}

export function applyUiPrefs(p = getUiPrefs()) {
  const root = document.documentElement;
  if (p.fx === 'reduced') root.dataset.reduceFx = '1';
  else delete root.dataset.reduceFx;
  if (p.contrast === 'high') root.dataset.contrast = 'high';
  else delete root.dataset.contrast;
  if (p.oled) root.dataset.oled = '1';
  else delete root.dataset.oled;
  root.style.zoom = p.zoom === 100 ? '' : String(p.zoom / 100);
}

export function setUiPref(name, value) {
  const store = { fx: value, zoom: value, contrast: value, oled: value ? '1' : '0', haptics: value ? '1' : '0', sound: value ? '1' : '0', resume: value ? '1' : '0', analytics: value ? '1' : '0' };
  write(KEYS[name], store[name]);
  applyUiPrefs();
}

export function hapticsEnabled() {
  return read(KEYS.haptics, '1') !== '0';
}
export function soundEnabled() {
  return read(KEYS.sound, '0') === '1';
}
export function effectsReduced() {
  return read(KEYS.fx, 'full') === 'reduced';
}

// Warna latar mengikuti sholat berikutnya (Subuh/Dzuhur/Ashar/Maghrib/Isya).
export function applySky(label) {
  const root = document.documentElement;
  if (label) {
    root.dataset.sky = label.toLowerCase();
    write(KEYS.sky, label.toLowerCase());
  }
}
export function applySavedSky() {
  const saved = read(KEYS.sky, '');
  if (saved) document.documentElement.dataset.sky = saved;
}

// Bunyi "tik" halus lewat WebAudio (tanpa berkas audio). Hanya jika pengguna
// menyalakannya; gagal diam-diam kalau browser menolak.
let audioCtx;
export function softTick() {
  if (!soundEnabled()) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.09);
    o.connect(g).connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.1);
  } catch {
    // ignore
  }
}

// Buka ke aktivitas terakhir (opsional): ingat halaman terakhir yang dibuka,
// lalu saat aplikasi dibuka di Home sekali per sesi, langsung lompat ke sana.
export function rememberRoute(pathname) {
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/x-')) return;
  write(KEYS.lastRoute, pathname);
}
export function routeToResume() {
  if (read(KEYS.resume, '0') !== '1') return null;
  try {
    if (sessionStorage.getItem('airmoon-resumed')) return null;
    sessionStorage.setItem('airmoon-resumed', '1');
  } catch {
    return null;
  }
  return read(KEYS.lastRoute, '') || null;
}
