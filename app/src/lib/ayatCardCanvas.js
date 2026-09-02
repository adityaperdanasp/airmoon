// Draws a shareable "Ayat Card" (a real photo backdrop + Arabic +
// Indonesian translation + a small airmoon footer) onto a <canvas> —
// plain Canvas 2D, no html2canvas/library dependency: drawImage + gradient
// fills + wrapped fillText, all native canvas primitives. Canvas text
// rendering already goes through the browser's normal font-shaping
// engine, so Arabic joining/ligatures render correctly as long as the
// font itself is loaded first — see ensureFontsReady below.
import { HOME_PHOTOS_LIGHT, HOME_PHOTOS_DARK } from '../data/photos';

const W = 1080;
const H = 1350;

async function ensureFontsReady() {
  // fillText silently uses a fallback font if the real one hasn't finished
  // loading yet — document.fonts.load() forces the fetch and resolves once
  // it's actually usable, so the very first card generated doesn't render
  // in the browser's default serif by mistake.
  await Promise.all([
    document.fonts.load('700 64px Amiri'),
    document.fonts.load('800 40px Poppins'),
    document.fonts.load('600 30px Poppins'),
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
function drawImageCover(ctx, img) {
  const scale = Math.max(W / img.width, H / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
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

export async function drawAyatCard(canvas, { arabic, translation, chapterName, chapter, verse, theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  // Same rotating photo pool Home.jsx's own header uses (theme-aware),
  // picked deterministically from chapter+verse rather than randomly — the
  // same ayat always gets the same backdrop instead of a different one
  // every time the card is regenerated, and a variety of ayat shared to
  // the same feed don't all show the identical photo. Same-origin images
  // (served from this app's own /photos/) never taint the canvas, so no
  // crossOrigin dance is needed before toBlob()/toDataURL() later.
  const pool = theme === 'dark' ? HOME_PHOTOS_DARK : HOME_PHOTOS_LIGHT;
  const photoSrc = pool[(chapter * 31 + verse) % pool.length];

  try {
    const img = await loadImage(photoSrc);
    drawImageCover(ctx, img);
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

  ctx.textAlign = 'center';
  ctx.direction = 'rtl';

  // Arabic block, vertically centered-ish in the upper-middle area.
  ctx.font = '700 64px Amiri, serif';
  ctx.fillStyle = '#ffffff';
  const arabicLines = wrapLines(ctx, arabic, W - 200);
  const arabicLineHeight = 96;
  const arabicBlockH = arabicLines.length * arabicLineHeight;
  let y = H * 0.36 - arabicBlockH / 2 + arabicLineHeight * 0.7;
  for (const line of arabicLines) {
    ctx.fillText(line, W / 2, y);
    y += arabicLineHeight;
  }

  // Translation block below, LTR, muted ivory.
  ctx.direction = 'ltr';
  ctx.font = '400 34px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.88)';
  const translationLines = wrapLines(ctx, `"${translation}"`, W - 260);
  let ty = y + 50;
  for (const line of translationLines) {
    ctx.fillText(line, W / 2, ty);
    ty += 48;
  }

  // Reference + footer wordmark near the bottom, not fighting the text
  // block above for space regardless of how long the ayat/translation ran.
  ctx.font = '600 30px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText(`QS. ${chapterName} : ${verse}`, W / 2, H - 150);

  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, H - 90);
}

export function canvasToFile(canvas, filename) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob], filename, { type: 'image/png' }));
    }, 'image/png');
  });
}
