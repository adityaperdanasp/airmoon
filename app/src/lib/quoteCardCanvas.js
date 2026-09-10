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
import { drawStandardFrame } from './cardFrame';
import { overlayStops } from './cardOverlays';
import { wallpaperContentTop } from './wallpaperLayout';

const POST_W = 1080;
const POST_H = 1350;
// Buat Lock Screen HP (2026-09-07, founder request) — a taller 9:19.5-ish
// canvas sized for modern phone lock screens, not just social posts.
// `shift` below only positions the footer now — the Arabic+translation
// block itself is centered on the wallpaper size via
// lib/wallpaperLayout.js's `wallpaperContentTop` (2026-09-09 follow-up:
// the original fixed-shift approach put every card's text at the same
// spot no matter how long the quote was, and sat lower than comfortable
// to actually read once set as a lock screen).
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

export async function drawQuoteCard(canvas, { arabic, translation, source, quoteIndex, theme = 'light', size = 'post', overlayId = 'auto' }) {
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

  const [ov0, ov1] = overlayStops(overlayId, theme);
  const overlay = ctx.createLinearGradient(0, 0, W, H);
  overlay.addColorStop(0, ov0);
  overlay.addColorStop(1, ov1);
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  drawStandardFrame(ctx, W, H);

  drawAirmoonBrand(ctx, { centerX: W / 2, y: 96, size: 52 });

  ctx.textAlign = 'center';

  // Measure both blocks up front — see lib/ayatCardCanvas.js's own version
  // of this same centering logic and lib/wallpaperLayout.js's header note
  // for the full reasoning.
  ctx.direction = 'rtl';
  ctx.font = '700 60px Amiri, serif';
  const arabicLines = wrapLines(ctx, arabic, W - 200);
  const arabicLineHeight = 90;
  const arabicBlockH = arabicLines.length * arabicLineHeight;

  ctx.direction = 'ltr';
  ctx.font = 'italic 400 32px Poppins, sans-serif';
  const translationLines = wrapLines(ctx, `"${translation}"`, W - 260);
  const translationLineHeight = 46;
  const blockGap = 50;

  const contentBlockH = arabicBlockH + blockGap + translationLines.length * translationLineHeight;
  const firstY = isWallpaper
    ? wallpaperContentTop(WALLPAPER_H, contentBlockH) + arabicLineHeight * 0.7
    : shift + POST_H * 0.36 - arabicBlockH / 2 + arabicLineHeight * 0.7;

  ctx.direction = 'rtl';
  ctx.font = '700 60px Amiri, serif';
  ctx.fillStyle = '#ffffff';
  let y = firstY;
  for (const line of arabicLines) {
    ctx.fillText(line, W / 2, y);
    y += arabicLineHeight;
  }

  ctx.direction = 'ltr';
  ctx.font = 'italic 400 32px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.88)';
  let ty = y + blockGap;
  for (const line of translationLines) {
    ctx.fillText(line, W / 2, ty);
    ty += translationLineHeight;
  }

  ctx.font = '600 30px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText(source, W / 2, shift + POST_H - 150);

  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, shift + POST_H - 90);
}
