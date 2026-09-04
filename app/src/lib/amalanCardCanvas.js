// Draws a shareable "today's ibadah progress" card — same plain Canvas 2D
// approach as lib/ayatCardCanvas.js (photo backdrop + brand-tinted overlay
// + wrapped text), reused here for a different message: how much of
// today's Amalan Harian checklist got done, as something worth posting
// rather than just a private in-app number. A social-growth angle on the
// same feature, not a new subsystem.
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import { drawAirmoonBrand } from './drawAirmoonLogo';

const W = 1080;
const H = 1350;

async function ensureFontsReady() {
  await Promise.all([
    document.fonts.load('800 120px Poppins'),
    document.fonts.load('700 40px Poppins'),
    document.fonts.load('600 30px Poppins'),
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

export async function drawAmalanCard(canvas, { totalDone, totalItems, dateLabel, theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  // Picked by day-of-year (not chapter/verse — there's no ayat here) so
  // the card looks different day to day without being random.
  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const photoSrc = pool[dayOfYear % pool.length];

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
    overlay.addColorStop(0, 'rgba(11,12,10,0.6)');
    overlay.addColorStop(1, 'rgba(11,12,10,0.92)');
  } else {
    overlay.addColorStop(0, 'rgba(13,77,71,0.65)');
    overlay.addColorStop(1, 'rgba(10,54,48,0.9)');
  }
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(232,184,75,0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  drawAirmoonBrand(ctx, { centerX: W / 2, y: 96, size: 52 });

  ctx.textAlign = 'center';

  ctx.font = '700 34px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText('AMALAN HARIAN', W / 2, H * 0.32);

  ctx.font = '800 150px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${totalDone}/${totalItems}`, W / 2, H * 0.46);

  ctx.font = '400 34px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.9)';
  ctx.fillText('selesai hari ini', W / 2, H * 0.53);

  ctx.font = '600 28px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.75)';
  ctx.fillText(dateLabel, W / 2, H - 150);

  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, H - 90);
}
