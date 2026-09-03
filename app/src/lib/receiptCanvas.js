// Draws a shareable "bukti sedekah" (donation receipt) card — same plain
// Canvas 2D approach as lib/ayatCardCanvas.js/lib/amalanCardCanvas.js
// (photo backdrop + brand overlay + wrapped text), applied to a real
// contribution record from Donasi.jsx's "Donasi Kamu" list. Gives someone
// a shareable/keepable proof of their own sedekah instead of it only ever
// living as a row in an in-app list.
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';

const W = 1080;
const H = 1350;

async function ensureFontsReady() {
  await Promise.all([
    document.fonts.load('800 60px Poppins'),
    document.fonts.load('700 36px Poppins'),
    document.fonts.load('400 30px Poppins'),
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

export async function drawReceiptCard(canvas, { amountLabel, donationTitle, dateLabel, theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const photoSrc = pool[(dayOfYear + 7) % pool.length]; // offset from amalanCardCanvas's index so the two don't always match on the same day

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

  ctx.textAlign = 'center';

  ctx.font = '700 32px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText('BUKTI SEDEKAH', W / 2, H * 0.34);

  ctx.font = '800 100px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(amountLabel, W / 2, H * 0.44);

  ctx.font = '400 32px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.9)';
  const titleLines = wrapLines(ctx, `untuk ${donationTitle}`, W - 220);
  let y = H * 0.5;
  for (const line of titleLines) {
    ctx.fillText(line, W / 2, y);
    y += 44;
  }

  ctx.font = '600 26px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.75)';
  ctx.fillText(dateLabel, W / 2, H - 150);

  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, H - 90);
}
