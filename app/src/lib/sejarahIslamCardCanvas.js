// Draws a shareable "Sejarah Islam" card — same plain Canvas 2D shell as
// the app's other share cards. Sejarah Islam previously only had a
// text-only "Bagikan" (navigator.share with a plain string), despite the
// page itself already rendering a photo-backed card visually.
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import { drawAirmoonBrand } from './drawAirmoonLogo';

const W = 1080;
const H = 1350;

async function ensureFontsReady() {
  await Promise.all([
    document.fonts.load('800 44px Poppins'),
    document.fonts.load('700 28px Poppins'),
    document.fonts.load('400 32px Poppins'),
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

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function drawSejarahIslamCard(canvas, { title, year, text, photoIndex, theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  // Same photo pool + deterministic-pick-by-index reasoning as the
  // on-screen card (SejarahIslam.jsx's own `photoPool[idx % ...]`) — this
  // card should show the exact same backdrop the reader was just looking at.
  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  const photoSrc = pool[photoIndex % pool.length];

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
    overlay.addColorStop(0, 'rgba(13,77,71,0.68)');
    overlay.addColorStop(1, 'rgba(13,77,71,0.9)');
  }
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(232,184,75,0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  drawAirmoonBrand(ctx, { centerX: W / 2, y: 96, size: 52 });

  ctx.textAlign = 'center';

  ctx.font = '700 28px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText(year.toUpperCase(), W / 2, H * 0.34);

  ctx.font = '800 44px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  const titleLines = wrapLines(ctx, title, W - 200);
  let y = H * 0.4;
  for (const line of titleLines) {
    ctx.fillText(line, W / 2, y);
    y += 56;
  }

  y += 20;
  ctx.font = '400 32px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.9)';
  const textLines = wrapLines(ctx, text, W - 220);
  for (const line of textLines) {
    ctx.fillText(line, W / 2, y);
    y += 46;
  }

  ctx.font = '700 26px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.7)';
  ctx.fillText('Hari Ini dalam Sejarah Islam', W / 2, H - 90);
}
