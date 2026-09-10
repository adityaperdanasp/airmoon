// Draws a shareable "Sejarah Islam" card — same plain Canvas 2D shell as
// the app's other share cards. Sejarah Islam previously only had a
// text-only "Bagikan" (navigator.share with a plain string), despite the
// page itself already rendering a photo-backed card visually.
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import { drawAirmoonBrand } from './drawAirmoonLogo';
import { drawStandardFrame } from './cardFrame';
import { wallpaperContentTop } from './wallpaperLayout';

const POST_W = 1080;
const POST_H = 1350;
// Buat Lock Screen HP (2026-09-07) — see lib/quoteCardCanvas.js's own
// header note for the full reasoning.
const WALLPAPER_W = 1080;
const WALLPAPER_H = 2340;

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

function drawImageCover(ctx, img, w, h) {
  const scale = Math.max(w / img.width, h / img.height);
  const iw = img.width * scale;
  const ih = img.height * scale;
  ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
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

export async function drawSejarahIslamCard(canvas, { title, year, text, photoIndex, theme = 'light', size = 'post' }) {
  const isWallpaper = size === 'wallpaper';
  const W = isWallpaper ? WALLPAPER_W : POST_W;
  const H = isWallpaper ? WALLPAPER_H : POST_H;
  const shift = isWallpaper ? (WALLPAPER_H - POST_H) * 0.75 : 0;

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
    drawImageCover(ctx, img, W, H);
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

  drawStandardFrame(ctx, W, H);

  drawAirmoonBrand(ctx, { centerX: W / 2, y: 96, size: 52 });

  ctx.textAlign = 'center';

  // Measure the title + description up front — for the wallpaper size the
  // whole block (year through the last description line) gets centered
  // around one anchor point rather than each piece being pinned to its own
  // fixed fraction of the canvas (see lib/wallpaperLayout.js's header note).
  const TITLE_GAP = POST_H * 0.06; // year baseline -> first title baseline
  const TITLE_LINE_H = 56;
  const TEXT_GAP = 20;
  const TEXT_LINE_H = 46;

  ctx.font = '800 44px Poppins, sans-serif';
  const titleLines = wrapLines(ctx, title, W - 200);
  ctx.font = '400 32px Poppins, sans-serif';
  const textLines = wrapLines(ctx, text, W - 220);

  const contentBlockH = TITLE_GAP + titleLines.length * TITLE_LINE_H + TEXT_GAP + textLines.length * TEXT_LINE_H;
  const yearY = isWallpaper ? wallpaperContentTop(WALLPAPER_H, contentBlockH) : shift + POST_H * 0.34;

  ctx.font = '700 28px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText(year.toUpperCase(), W / 2, yearY);

  ctx.font = '800 44px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  let y = yearY + TITLE_GAP;
  for (const line of titleLines) {
    ctx.fillText(line, W / 2, y);
    y += TITLE_LINE_H;
  }

  y += TEXT_GAP;
  ctx.font = '400 32px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.9)';
  for (const line of textLines) {
    ctx.fillText(line, W / 2, y);
    y += TEXT_LINE_H;
  }

  ctx.font = '700 26px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.7)';
  ctx.fillText('Hari Ini dalam Sejarah Islam', W / 2, shift + POST_H - 90);
}
