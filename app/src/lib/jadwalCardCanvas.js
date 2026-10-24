// Kartu "Jadwal Sholat hari ini + lokasiku" untuk dibagikan (status WhatsApp,
// grup keluarga, pengurus masjid). Canvas biasa seperti kartu bagikan lain.
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import { drawAirmoonBrand } from './drawAirmoonLogo';
import { drawStandardFrame } from './cardFrame';

const W = 1080;
const H = 1350;
const ROWS = [
  ['Subuh', 'Fajr'],
  ['Syuruq', 'Sunrise'],
  ['Dzuhur', 'Dhuhr'],
  ['Ashar', 'Asr'],
  ['Maghrib', 'Maghrib'],
  ['Isya', 'Isha'],
];

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(ctx, img, w, h) {
  const s = Math.max(w / img.width, h / img.height);
  ctx.drawImage(img, (w - img.width * s) / 2, (h - img.height * s) / 2, img.width * s, img.height * s);
}

export async function drawJadwalCard(canvas, { timings, location, dateLabel, hijriLabel, methodLabel, source, theme = 'light', dayIndex = 0 }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  await Promise.all([
    document.fonts.load('800 56px Poppins'),
    document.fonts.load('700 34px Poppins'),
    document.fonts.load('500 28px Poppins'),
    document.fonts.load("600 60px 'Fredoka'"),
  ]);

  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  try {
    drawCover(ctx, await loadImage(pool[dayIndex % pool.length]), W, H);
  } catch {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#0d4d47');
    g.addColorStop(1, '#0a3630');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  const ov = ctx.createLinearGradient(0, 0, 0, H);
  ov.addColorStop(0, 'rgba(10,40,36,0.78)');
  ov.addColorStop(1, 'rgba(8,28,26,0.94)');
  ctx.fillStyle = ov;
  ctx.fillRect(0, 0, W, H);
  drawStandardFrame(ctx, W, H);
  drawAirmoonBrand(ctx, { centerX: W / 2, y: 96, size: 52 });

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e8b84b';
  ctx.font = '700 28px Poppins, sans-serif';
  ctx.fillText('JADWAL SHOLAT HARI INI', W / 2, 250);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 54px Poppins, sans-serif';
  let loc = location || 'Lokasi kamu';
  while (ctx.measureText(loc).width > W - 160 && loc.length > 4) loc = loc.slice(0, -2);
  if (loc !== (location || 'Lokasi kamu')) loc += '…';
  ctx.fillText(loc, W / 2, 322);

  ctx.font = '500 28px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.85)';
  ctx.fillText([dateLabel, hijriLabel].filter(Boolean).join('  ·  '), W / 2, 372);

  // 6 rows (5 sholat + syuruq as a lighter reference row)
  const top = 450;
  const rowH = 126;
  ROWS.forEach(([label, key], i) => {
    const y = top + i * rowH;
    const dim = key === 'Sunrise';
    ctx.fillStyle = dim ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.11)';
    ctx.beginPath();
    ctx.roundRect(110, y, W - 220, rowH - 22, 28);
    ctx.fill();
    ctx.textAlign = 'left';
    ctx.font = `${dim ? 500 : 700} 38px Poppins, sans-serif`;
    ctx.fillStyle = dim ? 'rgba(244,240,230,0.7)' : '#ffffff';
    ctx.fillText(label, 160, y + 64);
    ctx.textAlign = 'right';
    ctx.font = `${dim ? 600 : 800} 48px Poppins, sans-serif`;
    ctx.fillStyle = dim ? 'rgba(244,240,230,0.8)' : '#f0cd7b';
    ctx.fillText((timings?.[key] || '--:--').slice(0, 5), W - 160, y + 66);
  });

  ctx.textAlign = 'center';
  ctx.font = '500 26px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.7)';
  ctx.fillText([source, methodLabel].filter(Boolean).join('  ·  '), W / 2, H - 100);
}
