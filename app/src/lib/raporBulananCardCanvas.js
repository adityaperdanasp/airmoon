// Rapor ibadah bulanan: kartu yang bisa dibagikan. Sengaja tidak ada
// perbandingan dengan orang lain, hanya ringkasan pribadi bulan itu.
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import { drawAirmoonBrand } from './drawAirmoonLogo';
import { drawStandardFrame } from './cardFrame';

const W = 1080;
const H = 1350;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function drawRaporBulananCard(canvas, { monthLabel, report, sholatStreak, puasaCount, theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  await Promise.all([document.fonts.load('800 60px Poppins'), document.fonts.load('600 32px Poppins'), document.fonts.load("600 60px 'Fredoka'")]);
  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  try {
    const img = await loadImage(pool[new Date().getMonth() % pool.length]);
    const s = Math.max(W / img.width, H / img.height);
    ctx.drawImage(img, (W - img.width * s) / 2, (H - img.height * s) / 2, img.width * s, img.height * s);
  } catch {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#0d4d47');
    g.addColorStop(1, '#0a3630');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  const ov = ctx.createLinearGradient(0, 0, 0, H);
  ov.addColorStop(0, 'rgba(10,40,36,0.8)');
  ov.addColorStop(1, 'rgba(8,28,26,0.95)');
  ctx.fillStyle = ov;
  ctx.fillRect(0, 0, W, H);
  drawStandardFrame(ctx, W, H);
  drawAirmoonBrand(ctx, { centerX: W / 2, y: 96, size: 52 });

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e8b84b';
  ctx.font = '700 28px Poppins, sans-serif';
  ctx.fillText('RAPOR IBADAH', W / 2, 250);
  ctx.fillStyle = '#fff';
  ctx.font = '800 64px Poppins, sans-serif';
  ctx.fillText(monthLabel, W / 2, 330);

  const tiles = [
    [`${report.points}`, `poin dari ${report.maxPoints}`],
    [`${report.sholatComplete}`, 'hari sholat lengkap'],
    [`${report.tilawahDays}`, 'hari membaca Qur\'an'],
    [`${report.dzikirDays}`, 'hari berdzikir'],
    [`${sholatStreak?.best ?? 0}`, 'rekor hari beruntun'],
    [`${puasaCount}`, 'puasa sunnah'],
  ];
  const cw = 420;
  const ch = 220;
  tiles.forEach(([big, small], i) => {
    const x = 110 + (i % 2) * (cw + 40);
    const y = 400 + Math.floor(i / 2) * (ch + 30);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.roundRect(x, y, cw, ch, 32);
    ctx.fill();
    ctx.fillStyle = '#f0cd7b';
    ctx.font = '800 84px Poppins, sans-serif';
    ctx.fillText(big, x + cw / 2, y + 108);
    ctx.fillStyle = 'rgba(244,240,230,0.88)';
    ctx.font = '600 28px Poppins, sans-serif';
    ctx.fillText(small, x + cw / 2, y + 168);
  });

  ctx.font = '500 26px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.7)';
  ctx.fillText('Semoga Allah menerima dan menambah amal kita', W / 2, H - 100);
}
