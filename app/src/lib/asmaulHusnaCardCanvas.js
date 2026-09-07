// Draws a shareable Asmaul Husna card — same plain Canvas 2D shell as the
// app's other share cards (photo backdrop + brand overlay + wrapped
// text), for a single one of the 99 names. NamaNamaAllah.jsx previously
// had no share capability at all — this closes that gap per a direct ask
// ("asmaul husna bikin bisa dibagikan jadi card juga").
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import { drawAirmoonBrand } from './drawAirmoonLogo';

const W = 1080;
const H = 1350;

async function ensureFontsReady() {
  await Promise.all([
    document.fonts.load('700 30px Poppins'),
    document.fonts.load('800 60px Poppins'),
    document.fonts.load('400 30px Poppins'),
    document.fonts.load('400 130px Amiri'),
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

export async function drawAsmaulHusnaCard(canvas, { no, arabic, latin, meaning, photoIndex, theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

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
  ctx.fillText(`ASMAUL HUSNA · ${String(no).padStart(2, '0')} / 99`, W / 2, H * 0.3);

  ctx.font = '400 150px Amiri, serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(arabic, W / 2, H * 0.44);

  ctx.font = '800 54px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(latin, W / 2, H * 0.53);

  ctx.font = '400 32px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.9)';
  ctx.fillText(meaning, W / 2, H * 0.59);

  ctx.font = '700 26px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.7)';
  ctx.fillText('99 Nama-Nama Allah', W / 2, H - 90);
}
