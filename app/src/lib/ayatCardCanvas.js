// Draws a shareable "Ayat Card" (Arabic + Indonesian translation + a small
// airmoon footer) onto a <canvas> — plain Canvas 2D, no html2canvas/library
// dependency, since the content here is just gradient + wrapped text, well
// within what fillText/measureText can do directly (and canvas text
// rendering already goes through the browser's normal font-shaping engine,
// so Arabic joining/ligatures render correctly as long as the font itself
// is loaded first — see ensureFontsReady below).

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

export async function drawAyatCard(canvas, { arabic, translation, chapterName, verse }) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await ensureFontsReady();

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0d4d47');
  grad.addColorStop(1, '#0a3630');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // A soft radial glow behind the text block, purely decorative.
  const glow = ctx.createRadialGradient(W / 2, H * 0.38, 40, W / 2, H * 0.38, W * 0.7);
  glow.addColorStop(0, 'rgba(232,184,75,0.14)');
  glow.addColorStop(1, 'rgba(232,184,75,0)');
  ctx.fillStyle = glow;
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
