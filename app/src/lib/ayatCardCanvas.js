// Draws a shareable "Ayat Card" (a real photo backdrop + Arabic +
// Indonesian translation + a small airmoon footer) onto a <canvas> —
// plain Canvas 2D, no html2canvas/library dependency: drawImage + gradient
// fills + wrapped fillText, all native canvas primitives. Canvas text
// rendering already goes through the browser's normal font-shaping
// engine, so Arabic joining/ligatures render correctly as long as the
// font itself is loaded first — see ensureFontsReady below.
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import { drawAirmoonBrand } from './drawAirmoonLogo';
import { wallpaperContentTop } from './wallpaperLayout';

const POST_W = 1080;
const POST_H = 1350;
// Buat Lock Screen HP (2026-09-07). `shift` below only ever positions the
// footer now — the main Arabic+translation block is centered on the
// wallpaper size via lib/wallpaperLayout.js's `wallpaperContentTop`
// instead (2026-09-09 follow-up, see that file's header for why: a fixed
// shift put every card's text at the same spot regardless of how long the
// content was, and left it lower than comfortable to read on an actual
// lock screen).
const WALLPAPER_W = 1080;
const WALLPAPER_H = 2340;

async function ensureFontsReady() {
  // fillText silently uses a fallback font if the real one hasn't finished
  // loading yet — document.fonts.load() forces the fetch and resolves once
  // it's actually usable, so the very first card generated doesn't render
  // in the browser's default serif by mistake.
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

// Same object-fit: cover math the CSS property does — scale up to
// whichever dimension needs it more, then center-crop the overflow.
function drawImageCover(ctx, img, w, h) {
  const scale = Math.max(w / img.width, h / img.height);
  const iw = img.width * scale;
  const ih = img.height * scale;
  ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
}

// Greedy word-wrap: splits `text` on spaces and packs words onto lines no
// wider than maxWidth, measured with the context's *current* font — caller
// must set ctx.font before calling this.
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

export async function drawAyatCard(canvas, { arabic, translation, chapterName, chapter, verse, theme = 'light', size = 'post' }) {
  const isWallpaper = size === 'wallpaper';
  const W = isWallpaper ? WALLPAPER_W : POST_W;
  const H = isWallpaper ? WALLPAPER_H : POST_H;
  const shift = isWallpaper ? (WALLPAPER_H - POST_H) * 0.75 : 0;

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  // data/photos.js's wider decorative pool (Home's rotating set + every
  // PAGE_PHOTOS entry, theme-aware), picked deterministically from
  // chapter+verse rather than randomly — the same ayat always gets the
  // same backdrop instead of a different one every time the card is
  // regenerated, and a variety of ayat shared to the same feed don't all
  // show the identical photo. Same-origin images (served from this app's
  // own /photos/) never taint the canvas, so no crossOrigin dance is
  // needed before toBlob()/toDataURL() later.
  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  const photoSrc = pool[(chapter * 31 + verse) % pool.length];

  try {
    const img = await loadImage(photoSrc);
    drawImageCover(ctx, img, W, H);
  } catch {
    // Photo failed to load (offline, etc.) — fall back to the flat
    // gradient this card used before photos were added, rather than
    // leaving a blank canvas.
    const fallback = ctx.createLinearGradient(0, 0, W, H);
    fallback.addColorStop(0, '#0d4d47');
    fallback.addColorStop(1, '#0a3630');
    ctx.fillStyle = fallback;
    ctx.fillRect(0, 0, W, H);
  }

  // Brand-tinted overlay over the photo — same theme-aware gradient
  // treatment Home.jsx's header photo and KutipanInspirasi.jsx's quote
  // card both use, so this reads as "this app's card" rather than a bare
  // stock photo with text pasted on top, and keeps the text legible
  // regardless of how bright the underlying photo is.
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

  // Thin gold frame, matching the app's teal/gold palette.
  ctx.strokeStyle = 'rgba(232,184,75,0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  drawAirmoonBrand(ctx, { centerX: W / 2, y: 96, size: 52 });

  ctx.textAlign = 'center';

  // Measure both blocks up front — for the wallpaper size the Arabic +
  // translation are centered together as one unit around a single anchor
  // point, instead of only the Arabic line being centered on a fixed spot
  // and the translation just trailing further down the longer it runs (see
  // lib/wallpaperLayout.js's header note).
  ctx.direction = 'rtl';
  ctx.font = '700 64px Amiri, serif';
  const arabicLines = wrapLines(ctx, arabic, W - 200);
  const arabicLineHeight = 96;
  const arabicBlockH = arabicLines.length * arabicLineHeight;

  ctx.direction = 'ltr';
  ctx.font = '400 34px Poppins, sans-serif';
  const translationLines = wrapLines(ctx, `"${translation}"`, W - 260);
  const translationLineHeight = 48;
  const blockGap = 50;

  const contentBlockH = arabicBlockH + blockGap + translationLines.length * translationLineHeight;
  const firstY = isWallpaper
    ? wallpaperContentTop(WALLPAPER_H, contentBlockH) + arabicLineHeight * 0.7
    : shift + POST_H * 0.36 - arabicBlockH / 2 + arabicLineHeight * 0.7;

  // Arabic block.
  ctx.direction = 'rtl';
  ctx.font = '700 64px Amiri, serif';
  ctx.fillStyle = '#ffffff';
  let y = firstY;
  for (const line of arabicLines) {
    ctx.fillText(line, W / 2, y);
    y += arabicLineHeight;
  }

  // Translation block below, LTR, muted ivory.
  ctx.direction = 'ltr';
  ctx.font = '400 34px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.88)';
  let ty = y + blockGap;
  for (const line of translationLines) {
    ctx.fillText(line, W / 2, ty);
    ty += translationLineHeight;
  }

  // Reference + footer wordmark near the bottom, not fighting the text
  // block above for space regardless of how long the ayat/translation ran.
  ctx.font = '600 30px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText(`QS. ${chapterName} : ${verse}`, W / 2, shift + POST_H - 150);

  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, shift + POST_H - 90);
}

export function canvasToFile(canvas, filename) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob], filename, { type: 'image/png' }));
    }, 'image/png');
  });
}
