// Draws the REAL airmoon mark (crescent + star, same path data as
// components/Logo.jsx — kept in sync manually since one is SVG markup and
// the other is Canvas 2D, there's no shared source) onto a canvas —
// every existing share card used to only print the plain word "airmoon"
// in small text near the bottom, no actual logo graphic, and not
// positioned to catch the eye first. A shared card viewed on WhatsApp
// should read as airmoon's at a glance, before anyone reads the content
// — the mark now goes at the TOP of every share card, per an explicit
// founder ask ("harus ada lambang airmoon diatasnya buat promosi").
//
// Path2D + ctx.fill(path) — the same SVG path syntax the browser's own
// SVG renderer understands is also valid input to the Canvas 2D Path2D
// constructor, so this is a direct reuse of Logo.jsx's own path data, not
// a hand-redrawn approximation.
const LOGO_VIEWBOX = { x: 2.921, y: 3.271, w: 17.801, h: 17.801 };
const LOGO_CRESCENT_PATH = 'M14.72296282518494,4.185868350271921 A8.5,8.5 0 1,0 19.81413164972808,9.27703717481506 A6.0,6.0 0 1,1 14.72296282518494,4.185868350271921 Z';
const LOGO_STAR_PATH = 'M14.22,8.34 14.69,9.29 15.74,9.45 14.98,10.19 15.16,11.23 14.22,10.74 13.28,11.23 13.46,10.19 12.7,9.45 13.75,9.29Z';

export async function ensureLogoFontReady() {
  await document.fonts.load("600 60px 'Fredoka'");
}

// Draws just the mark (no wordmark), centered at (x, y), `size` wide/tall.
export function drawAirmoonMark(ctx, { x, y, size, color = '#ffffff' }) {
  const scale = size / LOGO_VIEWBOX.w;
  ctx.save();
  ctx.translate(x - (LOGO_VIEWBOX.w / 2) * scale, y - (LOGO_VIEWBOX.h / 2) * scale);
  ctx.scale(scale, scale);
  ctx.translate(-LOGO_VIEWBOX.x, -LOGO_VIEWBOX.y);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(LOGO_CRESCENT_PATH));
  ctx.fill(new Path2D(LOGO_STAR_PATH));
  ctx.restore();
}

// Mark + "airmoon" wordmark side by side, matching Logo.jsx's own layout,
// horizontally centered at `centerX`. This is what every share card
// actually calls — the bare mark alone (drawAirmoonMark) reads as
// abstract to someone who doesn't already know the brand; pairing it
// with the wordmark is what makes a shared image promote the app by name.
export function drawAirmoonBrand(ctx, { centerX, y, size = 56, color = '#ffffff' }) {
  const gap = size * 0.32;
  const fontPx = Math.round(size * 0.85);
  ctx.font = `600 ${fontPx}px 'Fredoka', 'Poppins', sans-serif`;
  ctx.textAlign = 'left';
  const textWidth = ctx.measureText('airmoon').width;
  const totalWidth = size + gap + textWidth;
  const startX = centerX - totalWidth / 2;

  drawAirmoonMark(ctx, { x: startX + size / 2, y, size, color });

  const prevBaseline = ctx.textBaseline;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText('airmoon', startX + size + gap, y + 1);
  ctx.textBaseline = prevBaseline;
  ctx.textAlign = 'center'; // every card's own subsequent fillText calls assume centered alignment
}
