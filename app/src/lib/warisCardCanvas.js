// Draws a shareable Kalkulator Waris result card — same plain Canvas 2D
// approach as the app's other share cards, listing each heir's share
// (up to a reasonable count) rather than just one big number, since a
// waris result is inherently a breakdown, not a single figure.
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';

const W = 1080;
const H = 1350;
const MAX_ROWS = 8; // more heirs than this and the card would overflow — a real edge case (many wives + many anak) gets truncated with a "+N lagi" line instead

async function ensureFontsReady() {
  await Promise.all([
    document.fonts.load('800 44px Poppins'),
    document.fonts.load('700 32px Poppins'),
    document.fonts.load('400 28px Poppins'),
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

export async function drawWarisCard(canvas, { totalHarta, results, theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const photoSrc = pool[(dayOfYear + 11) % pool.length];

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
    overlay.addColorStop(0, 'rgba(11,12,10,0.72)');
    overlay.addColorStop(1, 'rgba(11,12,10,0.94)');
  } else {
    overlay.addColorStop(0, 'rgba(13,77,71,0.75)');
    overlay.addColorStop(1, 'rgba(10,54,48,0.94)');
  }
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(232,184,75,0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  ctx.textAlign = 'center';
  ctx.font = '700 32px Poppins, sans-serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText('KALKULATOR WARIS', W / 2, 150);

  ctx.font = '400 26px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.85)';
  ctx.fillText(`Total Harta: Rp ${totalHarta.toLocaleString('id-ID')}`, W / 2, 195);

  const rows = results.slice(0, MAX_ROWS);
  const rowH = 84;
  let y = 280;
  ctx.textAlign = 'left';
  for (const r of rows) {
    ctx.font = '700 32px Poppins, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(r.label, 90, y);

    ctx.textAlign = 'right';
    ctx.font = '800 32px Poppins, sans-serif';
    ctx.fillStyle = '#e8b84b';
    ctx.fillText(`Rp ${Math.round(r.amount).toLocaleString('id-ID')}`, W - 90, y);
    ctx.textAlign = 'left';

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, y + 24);
    ctx.lineTo(W - 90, y + 24);
    ctx.stroke();

    y += rowH;
  }
  if (results.length > MAX_ROWS) {
    ctx.textAlign = 'center';
    ctx.font = '400 26px Poppins, sans-serif';
    ctx.fillStyle = 'rgba(244,240,230,0.75)';
    ctx.fillText(`+ ${results.length - MAX_ROWS} ahli waris lagi`, W / 2, y + 10);
  }

  ctx.textAlign = 'center';
  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, H - 90);
}
