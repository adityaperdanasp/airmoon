// Draws a shareable "medal reached" card — same plain Canvas 2D approach
// as the app's other share cards, for the moment PointsBadge.jsx's
// lifetime point total crosses a new medal tier (Perunggu/Perak/Emas/
// Platinum, lib/points.js's POINT_TIERS).
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import { drawAirmoonBrand } from './drawAirmoonLogo';
import { drawMilestoneFrame } from './cardFrame';

const W = 1080;
const H = 1350;

async function ensureFontsReady() {
  await Promise.all([
    document.fonts.load('800 130px Poppins'),
    document.fonts.load('700 30px Poppins'),
    document.fonts.load('400 30px Poppins'),
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

// Metal tones per tier — kept in sync with serviceIcons.jsx's MEDAL_TONES
// (the DOM <MedalIcon>) so the share card's medal and the in-app badge
// read as the same object.
const MEDAL_TONES = {
  perunggu: ['#e0b483', '#b08d57', '#7d5f34'],
  perak: ['#eef1f4', '#c0c5cc', '#8b9099'],
  emas: ['#ffe9a8', '#e8b84b', '#b3861f'],
  platinum: ['#c8f2f6', '#7dd8e0', '#3f9aa4'],
};

// A vector medallion + star, replacing the platform emoji this card used
// to fillText at 170px. cx/cy is the medallion centre, r its radius.
function drawMedalMark(ctx, cx, cy, r, tierId) {
  const [light, mid, dark] = MEDAL_TONES[tierId] || MEDAL_TONES.perunggu;

  // ribbon behind the disc
  ctx.fillStyle = '#1c8577';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.6, cy - r * 1.4);
  ctx.lineTo(cx - r * 0.05, cy + r * 0.2);
  ctx.lineTo(cx - r * 0.5, cy + r * 0.35);
  ctx.lineTo(cx - r * 1.05, cy - r * 1.25);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#0a4a43';
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.6, cy - r * 1.4);
  ctx.lineTo(cx + r * 1.05, cy - r * 1.25);
  ctx.lineTo(cx + r * 0.5, cy + r * 0.35);
  ctx.lineTo(cx + r * 0.05, cy + r * 0.2);
  ctx.closePath();
  ctx.fill();

  // disc
  const g = ctx.createLinearGradient(cx, cy - r, cx, cy + r);
  g.addColorStop(0, light);
  g.addColorStop(0.55, mid);
  g.addColorStop(1, dark);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = dark;
  ctx.lineWidth = r * 0.09;
  ctx.stroke();
  ctx.strokeStyle = light;
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = r * 0.06;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.68, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // star
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r * 0.5 : r * 0.21;
    const px = cx + Math.cos(ang) * rad;
    const py = cy + Math.sin(ang) * rad;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export async function drawMedalCard(canvas, { tierId, tierLabel, tierColor = '#e8b84b', points, theme = 'light' }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  const pool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;
  const photoSrc = pool[6 % pool.length]; // fixed pick — a milestone card, not a daily-rotating one

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
    overlay.addColorStop(1, 'rgba(11,12,10,0.94)');
  } else {
    overlay.addColorStop(0, 'rgba(13,77,71,0.68)');
    overlay.addColorStop(1, 'rgba(10,54,48,0.94)');
  }
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  // Milestone double frame in the tier's own metal colour — [UI] so a
  // Perunggu/Perak/Emas/Platinum card reads as visibly distinct at a
  // glance (see lib/cardFrame.js's rule — this is the "special occasion"
  // weight, same as the Khatam certificate).
  drawMilestoneFrame(ctx, W, H, tierColor);

  drawAirmoonBrand(ctx, { centerX: W / 2, y: 110, size: 52 });

  ctx.textAlign = 'center';

  ctx.font = '700 30px Poppins, sans-serif';
  ctx.fillStyle = tierColor;
  ctx.fillText('MEDALI BARU DIRAIH', W / 2, H * 0.3);

  drawMedalMark(ctx, W / 2, H * 0.42, 120, tierId);

  ctx.font = '800 68px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(tierLabel, W / 2, H * 0.56);

  ctx.font = '400 32px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(244,240,230,0.9)';
  ctx.fillText(`${points} poin terkumpul`, W / 2, H * 0.61);

  ctx.font = '800 40px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('airmoon', W / 2, H - 90);
}
