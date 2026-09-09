// Shared vertical-placement helper for the "Buat Lock Screen HP" wallpaper
// cards (Ayat Card, Kutipan Inspirasi, Sejarah Islam) — founder feedback
// 2026-09-09: the text sat too low (a fixed downward `shift` centered only
// the *first* text block, e.g. the Arabic line, around a set point, then
// let whatever came after it — translation, description — trail further
// down the screen the longer it ran) and, being a fixed shift, put every
// card's text at roughly the same spot regardless of how much text there
// actually was.
//
// This centers the WHOLE measured content block (every line, every
// element) around one target anchor point instead. Short text — little
// `blockHeight` — ends up snug and high, right around the anchor; long
// text expands symmetrically around that same anchor rather than just
// getting pushed further down, so a short quote and a long history entry
// both read as "comfortably placed", not "the short one floats weirdly
// high/low" or "the long one runs off toward the bottom edge".
//
// The two clamps exist for the extremes: `minTop` keeps even a one-line
// card from drifting up into the zone a phone's clock/date/widgets
// usually occupy; `maxBottom` keeps a long multi-line card from bleeding
// down into the footer/bottom safe area.
export function wallpaperContentTop(
  wallpaperH,
  blockHeight,
  { anchor = 0.4, minTop = 0.22, maxBottom = 0.68 } = {}
) {
  const idealTop = wallpaperH * anchor - blockHeight / 2;
  return Math.max(wallpaperH * minTop, Math.min(idealTop, wallpaperH * maxBottom - blockHeight));
}
