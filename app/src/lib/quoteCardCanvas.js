// Draws a shareable "Kutipan Inspirasi" card onto a <canvas> — the page
// itself only ever rendered the quote as plain HTML/CSS with a text-only
// "Bagikan" (navigator.share with just a string, no image at all, and no
// download option). Modeled directly on lib/ayatCardCanvas.js's
// drawAyatCard (same photo-backdrop + brand-tinted-overlay + wrapped
// Arabic/translation approach) rather than reusing it outright — a quote
// here already carries a pre-formatted `source` string ("QS. 15:1") from
// lib/quotesApi.js, with no separate chapter-name lookup available, so
// this takes that string directly instead of chapterName+verse.
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import { drawAirmoonBrand } from './drawAirmoonLogo';

const POST_W = 1080;
const POST_H = 1350;
// Buat Lock Screen HP (2026-09-07, founder request) — a taller 9:19.5-ish
// canvas sized for modern phone lock screens, not just social posts.
// Content is laid out with the exact same pixel math as the 'post' size
// (against the fixed POST_H reference below), then the whole text block
// is shifted down so it clears the upper portion of the screen where a
// phone's clock/date widget usually sits, rather than centering it or
// naively stretching every position by height ratio (which would just
// spread the same tight block thinly across a much taller canvas).
const WALLPAPER_W = 1080;
const WALLPAPER_H = 2340;

async function ensureFontsReady() {
  await Promise.all([
    document.fonts.load('700 64px Amiri'),
    document.fonts.load('800 40px Poppins'),
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

export async function drawQuoteCard(canvas, { arabic, translation, source, quoteIndex, theme = 'light', size = 'post' }) {
  const isWallpaper = size === 'wallpaper';
  const W = isWallpaper ? WALLPAPER_W : POST_W;
  const H = isWallpaper ? WALLPAPER_H : POST_H;
  // All content y-positions below are computed against this fixed
  // reference height (same as the 'post' size always was), then `shift`
  // pushes the whole block down for the taller wallpaper canvas — most of
  // the extra height goes above the text (clearing the phone's clock/date
  // zone), a smaller share stays below so the footer isn't cramped
  // against the very bottom edge either.
  const shift = isWallpaper ? (WALLPAPER_H - POST_H) * 0.75 : 0;

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  // Same photo pool + deterministic-pick-by-index reasoning as the
  // on-screen card (KutipanInspirasi.jsx's own `photoPool[idx % ...]`) —
  // this card should show the exact same backdrop the reader was just
  // looking at, not a re-randomized one.
  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  const photoSrc = pool[quoteIndex % pool.length];

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
    overlay.addColorStop(0, 'rgba(11,12,10,0.55)');
    overlay.addColorStop(1, 'rgba(11,12,10,0.9)');
  } else {
    overlay.addColorStop(0, 'rgba(13,77,71,0.6)');
    overlay.addColorStop(1, 'rgba(10,54,48,0.88)');
  }
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(232,184,75,0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  drawAirmoonBrand(ctx, { centerX: W / 2, y: 96, size: 52 });

  ctx.textAlign = 'center';
  ctx.direction = 'rtl';

  ctx.font = '700 60px Amiri, serif';
  ctx.fillStyle = '#ffffff';
  const arabicLines = wrapLines(ctx, arabic, W - 200);
  const arabicLineHeight = 90;
  const arabicBlockH = arabicLines.length * arabicLineHeight;
  let y = shift + POST_H * 0.36 - arabicBlockH / 2 + arabicLineHeight * 0.7;
  for (const line of arabicLines) {
    ctx.fillText(line, W / 2, y);
    y += arabicLineHeight;
  }

  ctx.direction = 'ltr';
  ctx.font = 'italic 400 32px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.88)';
  const translationLines = wrapLines(ctx, `"${translation}"`, W - 260);
  let ty = y + 50;
  for (const line of translationLines) {
    ctx.fillText(line, W / 2, ty);
    ty += 46;
  }

  ctx.font = '600 30px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText(source, W / 2, shift + POST_H - 150);

  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, shift + POST_H - 90);
}
