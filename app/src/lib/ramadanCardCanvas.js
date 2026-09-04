// Draws a shareable "Progress Ramadan" card — same plain Canvas 2D shell
// as lib/amalanCardCanvas.js (photo backdrop + brand overlay + big
// number), applied to Ramadan Mode's puasa/tarawih tracker, which had no
// share option at all despite already tracking both all month.
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import { drawAirmoonBrand } from './drawAirmoonLogo';

const W = 1080;
const H = 1350;

async function ensureFontsReady() {
  await Promise.all([
    document.fonts.load('800 90px Poppins'),
    document.fonts.load('700 34px Poppins'),
    document.fonts.load('600 28px Poppins'),
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

export async function drawRamadanCard(canvas, { puasaCount, tarawihCount, monthDays, hijriYear, theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  // Ramadan Mode already prefers a dark, night-worship-toned photo
  // (home-dark-1.jpg, per its own PageHeaderPhoto choice) regardless of
  // the app's own light/dark theme — same reasoning applies here, so this
  // ignores the `theme` overlay tuning used elsewhere and always leans
  // dark, matching the page's own established treatment.
  const pool = DECORATIVE_PHOTOS_DARK;
  const photoSrc = pool[hijriYear % pool.length];

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
  overlay.addColorStop(0, 'rgba(11,12,10,0.62)');
  overlay.addColorStop(1, 'rgba(11,12,10,0.92)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(232,184,75,0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  drawAirmoonBrand(ctx, { centerX: W / 2, y: 96, size: 52 });

  ctx.textAlign = 'center';

  ctx.font = '700 32px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText(`🌙 RAMADAN ${hijriYear} H`, W / 2, H * 0.22);

  // Two stacked stat blocks (puasa + tarawih) rather than one combined
  // number — a physical calendar-of-fasting-days is inherently 2
  // separate tallies, and combining them into one figure would hide
  // which habit is actually lagging.
  ctx.font = '800 100px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${puasaCount}/${monthDays}`, W / 2, H * 0.38);
  ctx.font = '400 30px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.85)';
  ctx.fillText('hari puasa', W / 2, H * 0.42);

  ctx.font = '800 100px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${tarawihCount}/${monthDays}`, W / 2, H * 0.58);
  ctx.font = '400 30px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.85)';
  ctx.fillText('malam tarawih', W / 2, H * 0.62);

  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, H - 90);
}
