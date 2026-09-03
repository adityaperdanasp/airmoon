// A celebratory "khatam selesai" card — same plain Canvas 2D approach as
// the app's other shareable cards (ayat/amalan/receipt), reserved
// specifically for the moment someone's Progress Khatam Qur'an
// (components/KhatamProgressCard.jsx) reaches all 604 Mushaf pages. A
// distinct, more ornamental treatment than the plain progress bar it's
// shown alongside — this is a real milestone worth a nicer image than a
// percentage.
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';

const W = 1080;
const H = 1350;

async function ensureFontsReady() {
  await Promise.all([
    document.fonts.load('800 90px Poppins'),
    document.fonts.load('700 40px Poppins'),
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

export async function drawKhatamCertificate(canvas, { theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  const photoSrc = pool[0]; // fixed, not day-rotated — this is a one-time milestone card, not a daily one

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
    overlay.addColorStop(0, 'rgba(11,12,10,0.65)');
    overlay.addColorStop(1, 'rgba(11,12,10,0.92)');
  } else {
    overlay.addColorStop(0, 'rgba(13,77,71,0.68)');
    overlay.addColorStop(1, 'rgba(10,54,48,0.92)');
  }
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  // A double gold frame — a step up from the single thin border the other
  // share cards use, matching the "this is a special one" occasion.
  ctx.strokeStyle = 'rgba(232,184,75,0.75)';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.lineWidth = 2;
  ctx.strokeRect(56, 56, W - 112, H - 112);

  ctx.textAlign = 'center';

  ctx.font = '400 60px Amiri, serif';
  ctx.fillStyle = '#e8b84b';
  ctx.fillText('الحمد لله', W / 2, H * 0.32);

  ctx.font = '700 30px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.9)';
  ctx.fillText('ALHAMDULILLAH', W / 2, H * 0.38);

  ctx.font = '800 78px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Khatam', W / 2, H * 0.48);
  ctx.fillText("Qur'an!", W / 2, H * 0.56);

  ctx.font = '400 30px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.85)';
  ctx.fillText('604 halaman selesai dibaca', W / 2, H * 0.63);

  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, H - 90);
}
