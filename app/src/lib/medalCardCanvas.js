// Draws a shareable "medal reached" card — same plain Canvas 2D approach
// as the app's other share cards, for the moment PointsBadge.jsx's
// lifetime point total crosses a new medal tier (Perunggu/Perak/Emas/
// Platinum, lib/points.js's POINT_TIERS).
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import { drawAirmoonBrand } from './drawAirmoonLogo';

const W = 1080;
const H = 1350;

async function ensureFontsReady() {
  await Promise.all([
    document.fonts.load('800 130px Poppins'),
    document.fonts.load('700 30px Poppins'),
    document.fonts.load('400 30px Poppins'),
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

export async function drawMedalCard(canvas, { tierIcon, tierLabel, tierColor = '#e8b84b', points, theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  const photoSrc = pool[6 % pool.length]; // fixed pick — a milestone card, not a daily-rotating one

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
    overlay.addColorStop(0, 'rgba(11,12,10,0.65)');
    overlay.addColorStop(1, 'rgba(11,12,10,0.94)');
  } else {
    overlay.addColorStop(0, 'rgba(13,77,71,0.68)');
    overlay.addColorStop(1, 'rgba(10,54,48,0.94)');
  }
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  // Double frame in the tier's own characteristic color — [UI] so a
  // Perunggu/Perak/Emas/Platinum card reads as visually distinct at a
  // glance, not just via the icon+label text. Same "this is a special
  // one" double-frame treatment as khatamCertificateCanvas.js's milestone
  // card, just tier-colored instead of always gold.
  ctx.strokeStyle = tierColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.lineWidth = 2;
  ctx.strokeRect(56, 56, W - 112, H - 112);

  drawAirmoonBrand(ctx, { centerX: W / 2, y: 110, size: 52 });

  ctx.textAlign = 'center';

  ctx.font = '700 30px Poppins, sans-serif';
  ctx.fillStyle = tierColor;
  ctx.fillText('MEDALI BARU DIRAIH', W / 2, H * 0.3);

  ctx.font = '400 170px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(tierIcon, W / 2, H * 0.46);

  ctx.font = '800 68px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(tierLabel, W / 2, H * 0.56);

  ctx.font = '400 32px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.9)';
  ctx.fillText(`${points} poin terkumpul`, W / 2, H * 0.61);

  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, H - 90);
}
