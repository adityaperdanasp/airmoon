// Shared "Unduh untuk Lock Screen" helper — every wallpaper-capable
// share modal (Kutipan Inspirasi, Ayat, Sejarah Islam, Kartu Ucapan) uses
// this instead of duplicating the offscreen-canvas boilerplate. Draws
// into a fresh <canvas> that's never attached to the DOM (no need to
// touch the visible preview canvas's own size/aspect-ratio) via the
// same draw function each card already uses, just with `size:
// 'wallpaper'` passed through — see e.g. lib/quoteCardCanvas.js's own
// header note for how that size variant is laid out.
export async function downloadCardWallpaper(drawFn, drawArgs, filename) {
  const canvas = document.createElement('canvas');
  await drawFn(canvas, { ...drawArgs, size: 'wallpaper' });
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    }, 'image/png');
  });
}
