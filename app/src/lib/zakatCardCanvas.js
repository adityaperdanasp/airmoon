// Draws a shareable Zakat result card — same plain Canvas 2D approach as
// lib/receiptCanvas.js (big rupiah number + formula sub-line), applied to
// a computed zakat result from pages/KalkulatorZakat.jsx (any of the 3
// tabs: Penghasilan/Maal/Fitrah).
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import { drawAirmoonBrand } from './drawAirmoonLogo';

const W = 1080;
const H = 1350;

async function ensureFontsReady() {
  await Promise.all([
    document.fonts.load('800 100px Poppins'),
    document.fonts.load('700 32px Poppins'),
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

export async function drawZakatCard(canvas, { typeLabel, amountLabel, formulaLabel, theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  const photoSrc = pool[4 % pool.length]; // fixed pick, distinct from receiptCanvas.js's own day-rotated offset

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

  ctx.font = '700 32px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText(typeLabel.toUpperCase(), W / 2, H * 0.34);

  ctx.font = '800 96px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(amountLabel, W / 2, H * 0.44);

  ctx.font = '400 28px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.85)';
  ctx.fillText(formulaLabel, W / 2, H * 0.5);

  ctx.font = '600 26px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.75)';
  ctx.fillText('Yuk hitung zakatmu juga di airmoon', W / 2, H - 150);

  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, H - 90);
}
