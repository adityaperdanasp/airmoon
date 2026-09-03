// Draws a combined "Kartu Pencapaian" — same plain Canvas 2D approach as
// the app's other share cards, but pulling together 3 separate stats
// (Progress Khatam %, highest dzikir streak badge, lifetime sedekah
// total) that previously only ever had their own separate, single-metric
// share cards (Khatam certificate, Amalan daily progress, receipts).
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';

const W = 1080;
const H = 1350;

async function ensureFontsReady() {
  await Promise.all([
    document.fonts.load('800 60px Poppins'),
    document.fonts.load('700 32px Poppins'),
    document.fonts.load('400 26px Poppins'),
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
  ctx.font = '400 50px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(icon, 90, y);

  ctx.font = '400 24px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.75)';
  ctx.fillText(label, 160, y - 20);

  ctx.font = '800 36px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText(value, 160, y + 20);
}

export async function drawAchievementCard(canvas, { displayName, khatamPct, badgeLabel, totalSedekah, theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  const photoSrc = pool[1 % pool.length]; // fixed pick — a personal achievement card, not a daily-rotating one

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
    overlay.addColorStop(0, 'rgba(11,12,10,0.68)');
    overlay.addColorStop(1, 'rgba(11,12,10,0.94)');
  } else {
    overlay.addColorStop(0, 'rgba(13,77,71,0.7)');
    overlay.addColorStop(1, 'rgba(10,54,48,0.94)');
  }
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(232,184,75,0.6)';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  ctx.textAlign = 'center';
  ctx.font = '700 30px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText('KARTU PENCAPAIAN', W / 2, 150);

  ctx.font = '800 52px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(displayName, W / 2, 210);

  statRow(ctx, 480, '📖', 'Progress Khatam Qur\'an', `${khatamPct}%`);
  statRow(ctx, 620, '🔥', 'Rentetan Dzikir Terbaik', badgeLabel);
  statRow(ctx, 760, '💝', 'Total Sedekah', totalSedekah);

  ctx.textAlign = 'center';
  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, H - 90);
}
