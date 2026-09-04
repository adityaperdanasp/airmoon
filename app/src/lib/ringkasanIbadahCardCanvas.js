// Draws a shareable "Ringkasan Ibadah" card — same plain Canvas 2D shell
// as the app's other share cards, pulling together the same 5 stats the
// real RingkasanIbadah.jsx dashboard shows (a superset of what
// achievementCardCanvas.js's older 3-stat Kartu Pencapaian covers).
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import { drawAirmoonBrand } from './drawAirmoonLogo';

const W = 1080;
const H = 1350;

async function ensureFontsReady() {
  await Promise.all([
    document.fonts.load('800 52px Poppins'),
    document.fonts.load('700 28px Poppins'),
    document.fonts.load('400 22px Poppins'),
    document.fonts.load("600 60px 'Fredoka'"),
  ]);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawImageCover(ctx, img) {
  const scale = Math.max(W / img.width, H / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
}

function statRow(ctx, y, icon, label, value) {
  ctx.textAlign = 'left';
  ctx.font = '400 42px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(icon, 90, y);

  ctx.font = '400 21px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.75)';
  ctx.fillText(label, 155, y - 16);

  ctx.font = '800 32px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText(value, 155, y + 20);
}

export async function drawRingkasanIbadahCard(canvas, { displayName, khatamPct, badgeLabel, totalSedekah, puasaCount, readingStreakDays, theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  const photoSrc = pool[2 % pool.length]; // fixed pick — a personal dashboard card, not a daily-rotating one

  try {
    const img = await loadImage(photoSrc);
    drawImageCover(ctx, img);
  } catch {
    const fallback = ctx.createLinearGradient(0, 0, W, H);
    fallback.addColorStop(0, '#0d4d47');
    fallback.addColorStop(1, '#0a3630');
    ctx.fillStyle = fallback;
    ctx.fillRect(0, 0, W, H);
  }

  const overlay = ctx.createLinearGradient(0, 0, W, H);
  if (theme === 'dark') {
    overlay.addColorStop(0, 'rgba(11,12,10,0.7)');
    overlay.addColorStop(1, 'rgba(11,12,10,0.95)');
  } else {
    overlay.addColorStop(0, 'rgba(13,77,71,0.72)');
    overlay.addColorStop(1, 'rgba(10,54,48,0.95)');
  }
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(232,184,75,0.6)';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  drawAirmoonBrand(ctx, { centerX: W / 2, y: 96, size: 52 });

  ctx.textAlign = 'center';
  ctx.font = '700 28px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText('RINGKASAN IBADAH', W / 2, 175);

  ctx.font = '800 46px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(displayName, W / 2, 235);

  statRow(ctx, 400, '📖', 'Progress Khatam Qur\'an', `${khatamPct}%`);
  statRow(ctx, 520, '🔥', 'Rentetan Dzikir Terbaik', badgeLabel);
  statRow(ctx, 640, '💝', 'Total Sedekah', totalSedekah);
  statRow(ctx, 760, '🌙', 'Puasa Sunnah', `${puasaCount}x`);
  statRow(ctx, 880, '📚', 'Streak Baca Qur\'an', `${readingStreakDays} hari`);

  ctx.textAlign = 'center';
  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, H - 90);
}
